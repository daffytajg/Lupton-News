'use client';

import { useState } from 'react';
import { Bookmark, Share2, MoreHorizontal, Link2, Twitter, Linkedin, Mail } from 'lucide-react';
import { useBookmarks } from '@/hooks/useBookmarks';
import { useToast } from '@/components/Toast';
import { cn } from '@/lib/utils';

interface ArticleActionsProps {
  articleId: string;
  articleTitle: string;
  articleUrl: string;
  variant?: 'default' | 'compact';
  className?: string;
}

export function ArticleActions({
  articleId,
  articleTitle,
  articleUrl,
  variant = 'default',
  className,
}: ArticleActionsProps) {
  const { isBookmarked, toggleBookmark, mounted } = useBookmarks();
  const { showToast } = useToast();
  const [showShareMenu, setShowShareMenu] = useState(false);

  const bookmarked = mounted ? isBookmarked(articleId) : false;

  const handleBookmark = () => {
    toggleBookmark(articleId);
    if (bookmarked) {
      showToast('info', 'Removed from bookmarks');
    } else {
      showToast('success', 'Added to bookmarks');
    }
  };

  const handleShare = async (method: 'copy' | 'twitter' | 'linkedin' | 'email') => {
    const fullUrl = typeof window !== 'undefined' 
      ? `${window.location.origin}${articleUrl}` 
      : articleUrl;

    switch (method) {
      case 'copy':
        try {
          await navigator.clipboard.writeText(fullUrl);
          showToast('success', 'Link copied to clipboard');
        } catch (err) {
          showToast('error', 'Failed to copy link');
        }
        break;
      case 'twitter':
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(articleTitle)}&url=${encodeURIComponent(fullUrl)}`,
          '_blank'
        );
        break;
      case 'linkedin':
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullUrl)}`,
          '_blank'
        );
        break;
      case 'email':
        window.location.href = `mailto:?subject=${encodeURIComponent(articleTitle)}&body=${encodeURIComponent(`Check out this article: ${fullUrl}`)}`;
        break;
    }
    setShowShareMenu(false);
  };

  const handleNativeShare = async () => {
    const fullUrl = typeof window !== 'undefined' 
      ? `${window.location.origin}${articleUrl}` 
      : articleUrl;

    if (navigator.share) {
      try {
        await navigator.share({
          title: articleTitle,
          url: fullUrl,
        });
      } catch (err) {
        // User cancelled
      }
    } else {
      setShowShareMenu(!showShareMenu);
    }
  };

  if (variant === 'compact') {
    return (
      <div className={cn('flex items-center gap-1', className)}>
        <button
          onClick={handleBookmark}
          className={cn(
            'p-1.5 rounded transition-colors',
            bookmarked
              ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/30'
              : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800'
          )}
          title={bookmarked ? 'Remove bookmark' : 'Bookmark'}
        >
          <Bookmark className={cn('w-4 h-4', bookmarked && 'fill-current')} />
        </button>
        <button
          onClick={handleNativeShare}
          className="p-1.5 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          title="Share"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className={cn('flex items-center gap-2 relative', className)}>
      <button
        onClick={handleBookmark}
        className={cn(
          'p-2 rounded-lg transition-colors',
          bookmarked
            ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/30'
            : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800'
        )}
        title={bookmarked ? 'Remove bookmark' : 'Bookmark'}
      >
        <Bookmark className={cn('w-5 h-5', bookmarked && 'fill-current')} />
      </button>
      
      <div className="relative">
        <button
          onClick={handleNativeShare}
          className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          title="Share"
        >
          <Share2 className="w-5 h-5" />
        </button>

        {/* Share dropdown menu */}
        {showShareMenu && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setShowShareMenu(false)} 
            />
            <div className="absolute right-0 bottom-full mb-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 py-1">
              <button
                onClick={() => handleShare('copy')}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Link2 className="w-4 h-4" />
                Copy link
              </button>
              <button
                onClick={() => handleShare('twitter')}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Twitter className="w-4 h-4" />
                Share on Twitter
              </button>
              <button
                onClick={() => handleShare('linkedin')}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Linkedin className="w-4 h-4" />
                Share on LinkedIn
              </button>
              <button
                onClick={() => handleShare('email')}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Mail className="w-4 h-4" />
                Send via Email
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ArticleActions;
