'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { getCurrentUser } from '@/app/auth-actions'

// --- In-Memory Mock Database for demo fallback ---
// This ensures the application is fully functional and interactive even without Supabase setup.
let mockReviews: any[] = [
  {
    id: 'mock-rev-1',
    user_id: 'mock-user-1',
    media_id: 693134, // Dune: Part Two
    media_type: 'movie',
    media_title: 'Dune: Part Two',
    rating: 'perfection',
    content: 'An absolute cinematic masterpiece! The sound design, visuals, and acting are top-tier. Denis Villeneuve has done it again.',
    contains_spoilers: false,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    profiles: {
      username: 'paul_atreides',
      display_name: 'Muad\'Dib',
      avatar_url: null,
    }
  },
  {
    id: 'mock-rev-2',
    user_id: 'mock-user-2',
    media_id: 693134, // Dune: Part Two
    media_type: 'movie',
    media_title: 'Dune: Part Two',
    rating: 'go_for_it',
    content: 'Extremely good movie, although it drags slightly in the middle. The final battle is insane. Definitely watch it on the biggest screen possible!',
    contains_spoilers: true,
    created_at: new Date(Date.now() - 86400000).toISOString(),
    profiles: {
      username: 'fremen_warrior',
      display_name: 'Chani fan',
      avatar_url: null,
    }
  }
];

let mockWatchlists: any[] = [];
let mockCollections: any[] = [
  {
    id: 'mock-col-1',
    user_id: 'mock-user-1',
    name: 'Must Watch Sci-Fi',
    description: 'A curated list of mind-bending science fiction movies and shows.',
    is_private: false,
    created_at: new Date().toISOString(),
    items: [
      { media_id: 693134, media_type: 'movie', media_title: 'Dune: Part Two', media_poster_path: '/czembDcB20oAD7ysRZr8w56214X.jpg' },
      { media_id: 872585, media_type: 'movie', media_title: 'Oppenheimer', media_poster_path: '/8Gxv8gS0W05R2qKVq1e5El4X7XG.jpg' }
    ],
    profiles: {
      username: 'paul_atreides',
      display_name: 'Muad\'Dib',
    }
  }
];

let mockFollows: { follower_id: string; following_id: string }[] = [];

// Helper to determine if we should use mock database
async function isDbMockMode() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url || url.includes('your-project')) return true;
  
  // Try to ping Supabase
  try {
    const supabase = await createClient();
    const { error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
    return !!error;
  } catch {
    return true;
  }
}

// --- REVIEWS & RATINGS ACTIONS ---

export async function getMovieReviews(mediaId: number, mediaType: 'movie' | 'tv') {
  const mockMode = await isDbMockMode();
  if (mockMode) {
    return mockReviews.filter(r => r.media_id === mediaId && r.media_type === mediaType);
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('reviews')
      .select('*, profiles(username, display_name, avatar_url)')
      .eq('media_id', mediaId)
      .eq('media_type', mediaType)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (e) {
    console.error('getMovieReviews failed, falling back to mock:', e);
    return mockReviews.filter(r => r.media_id === mediaId && r.media_type === mediaType);
  }
}

export async function getMovieRatingStats(mediaId: number, mediaType: 'movie' | 'tv') {
  const reviews = await getMovieReviews(mediaId, mediaType);
  
  const total = reviews.length;
  const counts = {
    skip: 0,
    timepass: 0,
    go_for_it: 0,
    perfection: 0
  };

  reviews.forEach(r => {
    const rKey = r.rating as keyof typeof counts;
    if (counts[rKey] !== undefined) {
      counts[rKey]++;
    }
  });

  const percentages = {
    skip: total ? Math.round((counts.skip / total) * 100) : 0,
    timepass: total ? Math.round((counts.timepass / total) * 100) : 0,
    go_for_it: total ? Math.round((counts.go_for_it / total) * 100) : 0,
    perfection: total ? Math.round((counts.perfection / total) * 100) : 0,
  };

  return {
    total,
    counts,
    percentages
  };
}

export async function submitReview(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return { error: 'You must be logged in to submit a review' };

  const mediaId = parseInt(formData.get('mediaId') as string);
  const mediaType = formData.get('mediaType') as string;
  const mediaTitle = formData.get('mediaTitle') as string;
  const mediaPosterPath = formData.get('mediaPosterPath') as string;
  const rating = formData.get('rating') as string;
  const content = formData.get('content') as string;
  const containsSpoilers = formData.get('containsSpoilers') === 'true';

  if (!mediaId || !mediaType || !rating || !content) {
    return { error: 'Missing required review fields' };
  }

  const mockMode = await isDbMockMode();
  if (mockMode) {
    // Check if user already reviewed
    const existingIndex = mockReviews.findIndex(r => r.media_id === mediaId && r.media_type === mediaType && r.user_id === user.id);
    const newReview = {
      id: existingIndex >= 0 ? mockReviews[existingIndex].id : 'mock-rev-' + Math.random().toString(36).substr(2, 9),
      user_id: user.id,
      media_id: mediaId,
      media_type: mediaType,
      media_title: mediaTitle,
      media_poster_path: mediaPosterPath,
      rating,
      content,
      contains_spoilers: containsSpoilers,
      created_at: new Date().toISOString(),
      profiles: {
        username: user.profile?.username || 'demo_user',
        display_name: user.profile?.display_name || 'Demo User',
        avatar_url: null,
      }
    };

    if (existingIndex >= 0) {
      mockReviews[existingIndex] = newReview;
    } else {
      mockReviews.unshift(newReview);
    }

    revalidatePath(`/${mediaType}/${mediaId}`);
    return { success: 'Review submitted successfully!' };
  }

  try {
    const supabase = await createClient();
    
    // Check if review already exists to update it, else insert
    const { data: existing } = await supabase
      .from('reviews')
      .select('id')
      .eq('user_id', user.id)
      .eq('media_id', mediaId)
      .eq('media_type', mediaType)
      .single();

    let result;
    if (existing) {
      result = await supabase
        .from('reviews')
        .update({ rating, content, contains_spoilers: containsSpoilers, updated_at: new Date().toISOString() })
        .eq('id', existing.id);
    } else {
      result = await supabase
        .from('reviews')
        .insert({
          user_id: user.id,
          media_id: mediaId,
          media_type: mediaType,
          media_title: mediaTitle,
          media_poster_path: mediaPosterPath,
          rating,
          content,
          contains_spoilers: containsSpoilers,
        });
    }

    if (result.error) throw result.error;

    // Award watch hours: perfection = 3 hrs, go_for_it = 2 hrs, timepass = 1 hr, skip = 0
    let hoursToAdd = 0;
    if (rating === 'perfection') hoursToAdd = 3;
    else if (rating === 'go_for_it') hoursToAdd = 2;
    else if (rating === 'timepass') hoursToAdd = 1;

    if (hoursToAdd > 0 && user.profile) {
      const currentHours = user.profile.watched_hours || 0;
      await supabase
        .from('profiles')
        .update({ watched_hours: currentHours + hoursToAdd })
        .eq('id', user.id);
    }

    revalidatePath(`/${mediaType}/${mediaId}`);
    return { success: 'Review submitted successfully!' };
  } catch (e: any) {
    console.error('submitReview failed:', e);
    return { error: e.message || 'Failed to submit review' };
  }
}

// --- WATCHLIST ACTIONS ---

export async function toggleWatchlist(mediaId: number, mediaType: 'movie' | 'tv', mediaTitle: string, mediaPosterPath: string) {
  const user = await getCurrentUser();
  if (!user) return { error: 'You must be logged in to modify your watchlist' };

  const mockMode = await isDbMockMode();
  if (mockMode) {
    const existingIndex = mockWatchlists.findIndex(w => w.media_id === mediaId && w.media_type === mediaType && w.user_id === user.id);
    if (existingIndex >= 0) {
      mockWatchlists.splice(existingIndex, 1);
      return { success: 'Removed from watchlist', active: false };
    } else {
      mockWatchlists.push({
        id: 'mock-w-' + Math.random().toString(36).substr(2, 9),
        user_id: user.id,
        media_id: mediaId,
        media_type: mediaType,
        media_title: mediaTitle,
        media_poster_path: mediaPosterPath,
        added_at: new Date().toISOString()
      });
      return { success: 'Added to watchlist', active: true };
    }
  }

  try {
    const supabase = await createClient();
    
    // Check if item is in watchlist
    const { data: existing } = await supabase
      .from('watchlists')
      .select('id')
      .eq('user_id', user.id)
      .eq('media_id', mediaId)
      .eq('media_type', mediaType)
      .single();

    if (existing) {
      const { error } = await supabase.from('watchlists').delete().eq('id', existing.id);
      if (error) throw error;
      return { success: 'Removed from watchlist', active: false };
    } else {
      const { error } = await supabase.from('watchlists').insert({
        user_id: user.id,
        media_id: mediaId,
        media_type: mediaType,
        media_title: mediaTitle,
        media_poster_path: mediaPosterPath
      });
      if (error) throw error;
      return { success: 'Added to watchlist', active: true };
    }
  } catch (e: any) {
    console.error('toggleWatchlist failed:', e);
    return { error: e.message || 'Failed to update watchlist' };
  }
}

export async function getWatchlistStatus(mediaId: number, mediaType: 'movie' | 'tv') {
  const user = await getCurrentUser();
  if (!user) return false;

  const mockMode = await isDbMockMode();
  if (mockMode) {
    return mockWatchlists.some(w => w.media_id === mediaId && w.media_type === mediaType && w.user_id === user.id);
  }

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('watchlists')
      .select('id')
      .eq('user_id', user.id)
      .eq('media_id', mediaId)
      .eq('media_type', mediaType)
      .single();
    return !!data;
  } catch {
    return false;
  }
}

export async function getUserWatchlist(userId: string) {
  const mockMode = await isDbMockMode();
  if (mockMode) {
    return mockWatchlists.filter(w => w.user_id === userId);
  }

  try {
    const supabase = await createClient();
    const { data } = await supabase.from('watchlists').select('*').eq('user_id', userId).order('added_at', { ascending: false });
    return data || [];
  } catch {
    return [];
  }
}

// --- SOCIAL GRAPH ACTIONS ---

export async function toggleFollow(followingId: string) {
  const user = await getCurrentUser();
  if (!user) return { error: 'You must be logged in to follow users' };
  if (user.id === followingId) return { error: 'You cannot follow yourself' };

  const mockMode = await isDbMockMode();
  if (mockMode) {
    const index = mockFollows.findIndex(f => f.follower_id === user.id && f.following_id === followingId);
    if (index >= 0) {
      mockFollows.splice(index, 1);
      return { success: 'Unfollowed user', active: false };
    } else {
      mockFollows.push({ follower_id: user.id, following_id: followingId });
      return { success: 'Followed user', active: true };
    }
  }

  try {
    const supabase = await createClient();
    const { data: existing } = await supabase
      .from('follows')
      .select('*')
      .eq('follower_id', user.id)
      .eq('following_id', followingId)
      .single();

    if (existing) {
      await supabase.from('follows').delete().eq('follower_id', user.id).eq('following_id', followingId);
      return { success: 'Unfollowed user', active: false };
    } else {
      await supabase.from('follows').insert({ follower_id: user.id, following_id: followingId });
      return { success: 'Followed user', active: true };
    }
  } catch (e: any) {
    return { error: e.message || 'Failed to toggle follow status' };
  }
}

export async function getFollowStatus(followingId: string) {
  const user = await getCurrentUser();
  if (!user) return false;

  const mockMode = await isDbMockMode();
  if (mockMode) {
    return mockFollows.some(f => f.follower_id === user.id && f.following_id === followingId);
  }

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('follows')
      .select('*')
      .eq('follower_id', user.id)
      .eq('following_id', followingId)
      .single();
    return !!data;
  } catch {
    return false;
  }
}

export async function getSocialActivityFeed(userId: string) {
  const mockMode = await isDbMockMode();
  if (mockMode) {
    // Return all reviews from other people for this mock demo
    return mockReviews;
  }

  try {
    const supabase = await createClient();
    
    // Get list of followed user IDs
    const { data: followed } = await supabase.from('follows').select('following_id').eq('follower_id', userId);
    const followedIds = (followed || []).map(f => f.following_id);
    
    if (followedIds.length === 0) return [];

    const { data } = await supabase
      .from('reviews')
      .select('*, profiles(username, display_name, avatar_url)')
      .in('user_id', followedIds)
      .order('created_at', { ascending: false });

    return data || [];
  } catch {
    return [];
  }
}

// --- COLLECTIONS ACTIONS ---

export async function getUserCollections(userId: string) {
  const mockMode = await isDbMockMode();
  if (mockMode) {
    return mockCollections.filter(c => c.user_id === userId);
  }

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('collections')
      .select('*, collection_items(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    return data || [];
  } catch {
    return [];
  }
}

export async function createCollection(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return { error: 'You must be logged in to create a collection' };

  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const isPrivate = formData.get('isPrivate') === 'true';

  if (!name) return { error: 'Collection name is required' };

  const mockMode = await isDbMockMode();
  if (mockMode) {
    const newCollection = {
      id: 'mock-col-' + Math.random().toString(36).substr(2, 9),
      user_id: user.id,
      name,
      description,
      is_private: isPrivate,
      created_at: new Date().toISOString(),
      items: [],
      profiles: {
        username: user.profile?.username || 'demo_user',
        display_name: user.profile?.display_name || 'Demo User',
      }
    };
    mockCollections.push(newCollection);
    return { success: 'Collection created!', collection: newCollection };
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('collections')
      .insert({ user_id: user.id, name, description, is_private: isPrivate })
      .select()
      .single();

    if (error) throw error;
    return { success: 'Collection created!', collection: data };
  } catch (e: any) {
    return { error: e.message || 'Failed to create collection' };
  }
}

export async function addMediaToCollection(collectionId: string, mediaId: number, mediaType: 'movie' | 'tv', mediaTitle: string, mediaPosterPath: string) {
  const mockMode = await isDbMockMode();
  if (mockMode) {
    const collection = mockCollections.find(c => c.id === collectionId);
    if (!collection) return { error: 'Collection not found' };
    
    const exists = collection.items.some((i: any) => i.media_id === mediaId && i.media_type === mediaType);
    if (exists) return { error: 'Already in collection' };

    collection.items.push({ media_id: mediaId, media_type: mediaType, media_title: mediaTitle, media_poster_path: mediaPosterPath });
    return { success: 'Added to collection!' };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from('collection_items')
      .insert({
        collection_id: collectionId,
        media_id: mediaId,
        media_type: mediaType,
        media_title: mediaTitle,
        media_poster_path: mediaPosterPath
      });

    if (error) throw error;
    return { success: 'Added to collection!' };
  } catch (e: any) {
    return { error: e.message || 'Failed to add item to collection' };
  }
}

export async function getUserReviews(userId: string) {
  const mockMode = await isDbMockMode();
  if (mockMode) {
    return mockReviews.filter(r => r.user_id === userId);
  }

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('reviews')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    return data || [];
  } catch {
    return mockReviews.filter(r => r.user_id === userId);
  }
}

// --- FORUMS & HUBS ACTIONS ---

let mockThreads: any[] = [
  {
    id: 'mock-t-1',
    user_id: 'mock-user-1',
    title: 'Who is excited for Anime Season Fall 2026?',
    content: 'We have some massive releases scheduled: Chainsaw Man Season 2, Solo Leveling sequel, and a bunch of new original anime. What is on your watchlist?',
    hub: 'anime-season',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    profiles: {
      username: 'paul_atreides',
      display_name: "Muad'Dib",
    }
  },
  {
    id: 'mock-t-2',
    user_id: 'mock-user-2',
    title: 'Is the MCU finally recovering?',
    content: 'Recent movies like Deadpool & Wolverine and the news about Avengers Doomsday have sparked some hope. Do you guys think the franchise is heading in the right direction?',
    hub: 'marvel',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    profiles: {
      username: 'fremen_warrior',
      display_name: 'Chani fan',
    }
  }
];

let mockComments: any[] = [
  {
    id: 'mock-c-1',
    thread_id: 'mock-t-1',
    user_id: 'mock-user-2',
    content: 'Definitely Solo Leveling for me! The first season was incredible. Also hoping for some surprise dark-horse anime hits.',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    profiles: {
      username: 'fremen_warrior',
      display_name: 'Chani fan'
    }
  }
];

export async function getDiscussionThreads(hub?: string) {
  const mockMode = await isDbMockMode();
  if (mockMode) {
    return hub ? mockThreads.filter(t => t.hub === hub) : mockThreads;
  }

  try {
    const supabase = await createClient();
    let query = supabase.from('discussion_threads').select('*, profiles(username, display_name, avatar_url)');
    if (hub) {
      query = query.eq('hub', hub);
    }
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (e) {
    console.error('getDiscussionThreads failed, using mock:', e);
    return hub ? mockThreads.filter(t => t.hub === hub) : mockThreads;
  }
}

export async function getThreadDetails(threadId: string) {
  const mockMode = await isDbMockMode();
  if (mockMode || threadId.startsWith('mock-')) {
    return mockThreads.find(t => t.id === threadId) || mockThreads[0];
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('discussion_threads')
      .select('*, profiles(username, display_name, avatar_url)')
      .eq('id', threadId)
      .single();
    if (error) throw error;
    return data;
  } catch (e) {
    console.error('getThreadDetails failed, using mock:', e);
    return mockThreads.find(t => t.id === threadId) || mockThreads[0];
  }
}

export async function createDiscussionThread(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return { error: 'You must be logged in to create a thread' };

  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const hub = formData.get('hub') as string;

  if (!title || !content || !hub) {
    return { error: 'All fields are required' };
  }

  const mockMode = await isDbMockMode();
  if (mockMode) {
    const newThread = {
      id: 'mock-t-' + Math.random().toString(36).substr(2, 9),
      user_id: user.id,
      title,
      content,
      hub,
      created_at: new Date().toISOString(),
      profiles: {
        username: user.profile?.username || 'demo_user',
        display_name: user.profile?.display_name || 'Demo User',
      }
    };
    mockThreads.unshift(newThread);
    revalidatePath('/forums');
    return { success: 'Thread created successfully!', threadId: newThread.id };
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('discussion_threads')
      .insert({ user_id: user.id, title, content, hub })
      .select('id')
      .single();

    if (error) throw error;
    revalidatePath('/forums');
    return { success: 'Thread created successfully!', threadId: data.id };
  } catch (e: any) {
    return { error: e.message || 'Failed to create thread' };
  }
}

export async function getThreadComments(threadId: string) {
  const mockMode = await isDbMockMode();
  if (mockMode || threadId.startsWith('mock-')) {
    return mockComments.filter(c => c.thread_id === threadId);
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('discussion_comments')
      .select('*, profiles(username, display_name, avatar_url)')
      .eq('thread_id', threadId)
      .order('created_at', { ascending: true });
    if (error) throw error;
    return data || [];
  } catch (e) {
    console.error('getThreadComments failed, using mock:', e);
    return mockComments.filter(c => c.thread_id === threadId);
  }
}

export async function createThreadComment(threadId: string, content: string) {
  const user = await getCurrentUser();
  if (!user) return { error: 'You must be logged in to post a comment' };

  if (!content.trim()) {
    return { error: 'Comment content cannot be empty' };
  }

  const mockMode = await isDbMockMode();
  if (mockMode || threadId.startsWith('mock-')) {
    const newComment = {
      id: 'mock-c-' + Math.random().toString(36).substr(2, 9),
      thread_id: threadId,
      user_id: user.id,
      content,
      created_at: new Date().toISOString(),
      profiles: {
        username: user.profile?.username || 'demo_user',
        display_name: user.profile?.display_name || 'Demo User',
      }
    };
    mockComments.push(newComment);
    revalidatePath(`/forums/threads/${threadId}`);
    return { success: 'Comment posted!' };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from('discussion_comments')
      .insert({ thread_id: threadId, user_id: user.id, content });

    if (error) throw error;
    revalidatePath(`/forums/threads/${threadId}`);
    return { success: 'Comment posted!' };
  } catch (e: any) {
    return { error: e.message || 'Failed to post comment' };
  }
}


