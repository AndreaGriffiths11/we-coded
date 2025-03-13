'use client';

import { useEffect, useState } from 'react';
import type { DevArticle } from '../types';

interface CacheData {
  data: DevArticle[];
  timestamp: number;
  etag: string | null;
}

const CACHE_KEY = 'wecoded_stories_v2';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

const useFetchStories = () => {
  const [stories, setStories] = useState<DevArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        setIsLoading(true);
        setError(null);

        let headers: HeadersInit = {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        };

        // Check cache and add If-None-Match header if we have an ETag
        let cachedData: CacheData | null = null;
        try {
          const cached = localStorage.getItem(CACHE_KEY);
          if (cached) {
            cachedData = JSON.parse(cached) as CacheData;
            const isValid = Date.now() - cachedData.timestamp < CACHE_DURATION;
            
            if (isValid) {
              console.log('Using cached data');
              setStories(cachedData.data);
              setIsLoading(false);
              return;
            }

            if (cachedData.etag) {
              headers['If-None-Match'] = cachedData.etag;
            }
          }
        } catch (e) {
          console.warn('Cache read error:', e);
          localStorage.removeItem(CACHE_KEY);
        }

        const response = await fetch(
          'https://dev.to/api/articles?tag=wecoded&top=7',
          { headers }
        );

        // Handle 304 Not Modified
        if (response.status === 304 && cachedData) {
          console.log('Content not modified, using cache');
          setStories(cachedData.data);
          return;
        }

        if (!response.ok) {
          throw new Error(`DEV.to API responded with status: ${response.status}`);
        }

        const data = await response.json();
        
        if (!Array.isArray(data)) {
          throw new Error('DEV.to API did not return an array of stories');
        }

        // Sort stories by date
        const sortedStories = data.sort((a, b) => 
          new Date(b.published_timestamp).getTime() - new Date(a.published_timestamp).getTime()
        );

        // Cache the result with ETag
        const etag = response.headers.get('etag');
        const cacheData: CacheData = {
          data: sortedStories,
          timestamp: Date.now(),
          etag
        };

        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
        } catch (e) {
          console.warn('Cache write error:', e);
        }

        setStories(sortedStories);
      } catch (error) {
        console.error('Error fetching stories:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to load stories';
        setError(errorMessage);
        
        // Try to use cached data as fallback, even if expired
        try {
          const cached = localStorage.getItem(CACHE_KEY);
          if (cached) {
            const { data } = JSON.parse(cached) as CacheData;
            console.log('Using expired cache as fallback');
            setStories(data);
          }
        } catch (e) {
          console.warn('Cache fallback error:', e);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchStories();
  }, []);

  return { stories, isLoading, error };
};

export default useFetchStories;
