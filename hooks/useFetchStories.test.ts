import { renderHook, waitFor } from '@testing-library/react';
import useFetchStories from './useFetchStories';

let fetchMock: jest.Mock;

function makeResponse(options: {
    status?: number;
    ok?: boolean;
    jsonData?: unknown;
    etag?: string | null;
}) {
    const { status = 200, ok = true, jsonData = [], etag = 'W/"123"' } = options;
    return {
        ok,
        status,
        json: async () => jsonData,
        headers: {
            get: (key: string) => (key.toLowerCase() === 'etag' ? etag : null),
        },
    } as unknown as Response;
}

const FIVE_MIN_MS = 5 * 60 * 1000;

describe('useFetchStories', () => {
    beforeEach(() => {
        localStorage.clear();
        jest.spyOn(console, 'warn').mockImplementation(() => { });
        jest.spyOn(console, 'error').mockImplementation(() => { });
        jest.spyOn(console, 'log').mockImplementation(() => { });
        fetchMock = jest.fn();
        globalThis.fetch = fetchMock as unknown as typeof fetch;
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    test('successful API fetch: sorts, updates state', async () => {
        const articles = [
            {
                id: 2,
                title: 'B',
                description: '',
                url: '',
                published_timestamp: '2024-01-01T00:00:00Z',
                tag_list: [],
                user: {
                    name: 'n',
                    username: 'u',
                    twitter_username: null,
                    github_username: null,
                    profile_image_90: '',
                },
            },
            {
                id: 1,
                title: 'A',
                description: '',
                url: '',
                published_timestamp: '2024-06-01T00:00:00Z',
                tag_list: [],
                user: {
                    name: 'n',
                    username: 'u',
                    twitter_username: null,
                    github_username: null,
                    profile_image_90: '',
                },
            },
        ];

        fetchMock.mockResolvedValue(
            makeResponse({ status: 200, ok: true, jsonData: articles, etag: 'W/"etag-1"' })
        );

        const { result } = renderHook(() => useFetchStories());

        await waitFor(() => expect(result.current.isLoading).toBe(false));
        expect(result.current.error).toBeNull();
        expect(result.current.stories.map((a) => a.id)).toEqual([1, 2]); // sorted desc by date

        // Cache should be written
        const cached = JSON.parse(localStorage.getItem('wecoded_stories_v2') || '{}');
        expect(Array.isArray(cached.data)).toBe(true);
        expect(cached.etag).toBe('W/"etag-1"');
    });

    test('cache hit: returns fresh cached data without fetch', async () => {
        const cachedArticles = [
            {
                id: 3,
                title: 'C',
                description: '',
                url: '',
                published_timestamp: '2024-07-01T00:00:00Z',
                tag_list: [],
                user: {
                    name: 'n',
                    username: 'u',
                    twitter_username: null,
                    github_username: null,
                    profile_image_90: '',
                },
            },
        ];

        const cacheData = {
            data: cachedArticles,
            timestamp: Date.now(), 
            etag: 'W/"etag-cached"',
        };
        localStorage.setItem('wecoded_stories_v2', JSON.stringify(cacheData));

        const { result } = renderHook(() => useFetchStories());

        await waitFor(() => expect(result.current.isLoading).toBe(false));
        expect(result.current.error).toBeNull();
        expect(result.current.stories.map((a) => a.id)).toEqual([3]);
        expect(fetchMock).not.toHaveBeenCalled();
    });

    test('cache miss (expired): makes API call and updates cache, sends If-None-Match when available', async () => {
        const expiredCache = {
            data: [{ id: 9 }],
            timestamp: Date.now() - FIVE_MIN_MS - 1,
            etag: 'W/"old-etag"',
        };
        localStorage.setItem('wecoded_stories_v2', JSON.stringify(expiredCache));

        const articles = [
            {
                id: 5,
                title: 'E',
                description: '',
                url: '',
                published_timestamp: '2024-08-01T00:00:00Z',
                tag_list: [],
                user: {
                    name: 'n',
                    username: 'u',
                    twitter_username: null,
                    github_username: null,
                    profile_image_90: '',
                },
            },
        ];

        fetchMock.mockResolvedValue(
            makeResponse({ status: 200, ok: true, jsonData: articles, etag: 'W/"new-etag"' })
        );

        const { result } = renderHook(() => useFetchStories());

        await waitFor(() => expect(result.current.isLoading).toBe(false));

        // Called once with If-None-Match
        expect(fetchMock).toHaveBeenCalledTimes(1);
        const fetchArgs = fetchMock.mock.calls[0];
        expect(fetchArgs[1]?.headers?.['If-None-Match']).toBe('W/"old-etag"');

        expect(result.current.error).toBeNull();
        expect(result.current.stories.map((a) => a.id)).toEqual([5]);

        const updatedCache = JSON.parse(localStorage.getItem('wecoded_stories_v2') || '{}');
        expect(updatedCache.etag).toBe('W/"new-etag"');
        expect(Array.isArray(updatedCache.data)).toBe(true);
    });

    test('304 Not Modified: uses cached data when present', async () => {
        const cachedArticles = [
            {
                id: 7,
                title: 'G',
                description: '',
                url: '',
                published_timestamp: '2024-03-01T00:00:00Z',
                tag_list: [],
                user: {
                    name: 'n',
                    username: 'u',
                    twitter_username: null,
                    github_username: null,
                    profile_image_90: '',
                },
            },
        ];

        // Expired but has ETag -> triggers request which returns 304
        const cacheData = {
            data: cachedArticles,
            timestamp: Date.now() - FIVE_MIN_MS - 1,
            etag: 'W/"etag-304"',
        };
        localStorage.setItem('wecoded_stories_v2', JSON.stringify(cacheData));

        fetchMock.mockResolvedValue(
            makeResponse({ status: 304, ok: false, jsonData: undefined, etag: 'W/"etag-304"' })
        );

        const { result } = renderHook(() => useFetchStories());

        await waitFor(() => expect(result.current.isLoading).toBe(false));
        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(result.current.error).toBeNull();
        expect(result.current.stories.map((a) => a.id)).toEqual([7]);
    });

    test('API error: sets error message and falls back to expired cache when available', async () => {
        const cachedArticles = [
            {
                id: 11,
                title: 'K',
                description: '',
                url: '',
                published_timestamp: '2024-02-01T00:00:00Z',
                tag_list: [],
                user: {
                    name: 'n',
                    username: 'u',
                    twitter_username: null,
                    github_username: null,
                    profile_image_90: '',
                },
            },
        ];
        const cacheData = {
            data: cachedArticles,
            timestamp: Date.now() - FIVE_MIN_MS - 10_000,
            etag: 'W/"old"',
        };
        localStorage.setItem('wecoded_stories_v2', JSON.stringify(cacheData));

        fetchMock.mockResolvedValue(
            makeResponse({ status: 500, ok: false, jsonData: undefined, etag: null })
        );

        const { result } = renderHook(() => useFetchStories());

        await waitFor(() => expect(result.current.isLoading).toBe(false));
        expect(result.current.error).toBe('DEV.to API responded with status: 500');
        expect(result.current.stories.map((a) => a.id)).toEqual([11]);
    });

    test('Invalid API payload (non-array): sets error', async () => {
        fetchMock.mockResolvedValue(
            makeResponse({ status: 200, ok: true, jsonData: { message: 'not an array' }, etag: 'W/"x"' })
        );

        const { result } = renderHook(() => useFetchStories());

        await waitFor(() => expect(result.current.isLoading).toBe(false));
        expect(result.current.error).toBe('DEV.to API did not return an array of stories');
        expect(result.current.stories).toEqual([]);
    });
});

