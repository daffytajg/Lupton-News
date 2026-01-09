'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'lupton-news-bookmarks';

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);

  // Load bookmarks from localStorage on mount
  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setBookmarks(new Set(JSON.parse(stored)));
      }
    } catch (e) {
      console.error('Failed to load bookmarks:', e);
    }
  }, []);

  // Save bookmarks to localStorage whenever they change
  useEffect(() => {
    if (mounted) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(bookmarks)));
      } catch (e) {
        console.error('Failed to save bookmarks:', e);
      }
    }
  }, [bookmarks, mounted]);

  const isBookmarked = useCallback((articleId: string) => {
    return bookmarks.has(articleId);
  }, [bookmarks]);

  const toggleBookmark = useCallback((articleId: string) => {
    setBookmarks(prev => {
      const newBookmarks = new Set(prev);
      if (newBookmarks.has(articleId)) {
        newBookmarks.delete(articleId);
      } else {
        newBookmarks.add(articleId);
      }
      return newBookmarks;
    });
  }, []);

  const addBookmark = useCallback((articleId: string) => {
    setBookmarks(prev => {
      const newSet = new Set(prev);
      newSet.add(articleId);
      return newSet;
    });
  }, []);

  const removeBookmark = useCallback((articleId: string) => {
    setBookmarks(prev => {
      const newBookmarks = new Set(prev);
      newBookmarks.delete(articleId);
      return newBookmarks;
    });
  }, []);

  return {
    bookmarks: Array.from(bookmarks),
    isBookmarked,
    toggleBookmark,
    addBookmark,
    removeBookmark,
    mounted,
  };
}
