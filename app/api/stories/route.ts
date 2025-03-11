import { NextResponse } from 'next/server';
import type { DevArticle } from '../../../types';

export async function GET() {
  try {
    // Fetch stories with #wecoded tag, prioritizing recent and relevant content
    const response = await fetch(
      'https://dev.to/api/articles?tag=wecoded&state=fresh&per_page=10',
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        next: {
          revalidate: 3600 // Revalidate cache every hour
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch stories');
    }

    const articles: DevArticle[] = await response.json();
    
    if (articles.length === 0) {
      return NextResponse.json([{
        id: 1,
        title: "Join the WeCoded Challenge!",
        description: "Be part of the movement! Share your tech journey with the #wecoded tag on DEV.to. Your story could inspire others in the tech community.",
        url: "https://dev.to/t/wecoded",
        published_timestamp: new Date().toISOString(),
        tag_list: ["wecoded", "devjourney", "diversity"],
        user: {
          name: "WeCoded Community",
          username: "wecoded",
          twitter_username: null,
          github_username: null,
          profile_image_90: "https://picsum.photos/90/90"
        }
      }]);
    }

    // Return all available articles, sorted by publish date
    const sortedArticles = articles
      .sort((a, b) => new Date(b.published_timestamp).getTime() - new Date(a.published_timestamp).getTime())
      .slice(0, 10); // Limit to 10 most recent articles

    return NextResponse.json(sortedArticles);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stories' },
      { status: 500 }
    );
  }
}