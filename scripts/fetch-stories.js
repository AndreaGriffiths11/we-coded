#!/usr/bin/env node
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const fs = require('fs');
const path = require('path');

async function fetchStories() {
  try {
    console.log('Fetching stories from DEV.to API...');
    
    const response = await fetch(
      'https://dev.to/api/articles?tag=wecoded&top=7',
      {
        headers: {
          'User-Agent': 'WeCoded Game Fetch Script',
          'Accept': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch stories. Status: ${response.status}`);
    }

    const stories = await response.json();
    
    const sortedStories = stories
      .filter(story => story && story.id && story.title)
      .sort((a, b) => new Date(b.published_timestamp).getTime() - new Date(a.published_timestamp).getTime());

    const outputPath = path.join(process.cwd(), 'public', 'stories.json');
    
    fs.writeFileSync(
      outputPath, 
      JSON.stringify(sortedStories, null, 2)
    );

    console.log('Stories successfully fetched and saved!');
    console.log('Number of stories:', sortedStories.length);
  } catch (error) {
    console.error('Error fetching stories:', error);
    process.exit(1);
  }
}

fetchStories();
