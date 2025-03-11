'use client';

const CodeEditor = () => {
  return (
    <pre className="code-editor">
{`// Fetch WeCoded stories from the DEV.to API
async function fetchStories() {
  const url = 'https://dev.to/api/articles?tag=wecoded';
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    return data.map(story => ({
      title: story.title,
      author: story.user.name,
      profileImage: story.user.profile_image,
      url: story.url,
      publishedDate: new Date(story.published_at),
      tags: story.tags,
      readingTime: story.reading_time_minutes
    }));
  } catch (error) {
    console.error('Error fetching WeCoded stories:', error);
    return [];
  }
}

// Display stories in our game interface
fetchStories().then(stories => {
  const container = document.getElementById('storyCard');
  if (stories.length > 0) {
    displayStory(stories[0], container);
  }
});`}
    </pre>
  );
};

export default CodeEditor;