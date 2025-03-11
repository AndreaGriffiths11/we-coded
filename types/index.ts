/**
 * Accessibility settings for user preferences
 */
export interface AccessibilitySettings {
  highContrast: boolean;
  reduceMotion: boolean;
  largeText: boolean;
}

/**
 * Story data structure
 */
export interface Story {
  title: string;
  author: string;
  role: string;
  content: string;
  date: string;
}

/**
 * Notification state
 */
export interface NotificationState {
  show: boolean;
  message: string;
}

/**
 * Game statistics
 */
export interface GameStats {
  storiesCount: number;
  authorsCount: number;
  countriesCount: number;
  yearsCount: number;
}

/**
 * DEV.to API types
 */
export interface DevArticle {
  id: number;
  title: string;
  description: string;
  url: string;
  published_timestamp: string;
  tag_list: string[];
  user: {
    name: string;
    username: string;
    twitter_username: string | null;
    github_username: string | null;
    profile_image_90: string;
  };
}

export interface StoryCardProps {
  story: DevArticle;
  onStoryClick: (story: DevArticle) => void;
}