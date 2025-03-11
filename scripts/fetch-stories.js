#!/usr/bin/env node
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const fs = require('fs');
const path = require('path');

async function fetchStories() {
  try {
    const response = await fetch(
      'https://dev.to/api/articles?tag=wecoded&state=fresh&per_page=10',
      {
        headers: {
          'User-Agent': 'WeCoded Game Fetch Script',
          'Accept': 'application/json'
        }
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Response Error:', errorText);
      throw new Error(`Failed to fetch stories. Status: ${response.status}`);
    }

    const stories = await response.json();
    
    const sortedStories = stories
      .filter(story => story && story.id && story.title)
      .sort((a, b) => new Date(b.published_timestamp).getTime() - new Date(a.published_timestamp).getTime())
      .slice(0, 10);

    const outputPath = path.join(process.cwd(), 'public', 'stories.json');
    
    fs.writeFileSync(
      outputPath, 
      JSON.stringify(sortedStories, null, 2)
    );

    console.log('Stories successfully fetched and saved!');
    console.log('Number of stories:', sortedStories.length);
  } catch (error) {
    console.error('Detailed Error:', error);
    
    const fallbackStories = [
      {
        id: 1,
        title: "Join the WeCoded Challenge!",
        description: "Be part of the movement! Share your tech journey with the #wecoded tag on DEV.to.",
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
      }
    ];

    const outputPath = path.join(process.cwd(), 'public', 'stories.json');
    
    fs.writeFileSync(
      outputPath, 
      JSON.stringify(fallbackStories, null, 2)
    );

    console.error('Saved fallback stories due to fetch error');
  }
}

fetchStories();
