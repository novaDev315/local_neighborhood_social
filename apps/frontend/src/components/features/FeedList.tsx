'use client';

import { useEffect, useState } from 'react';
import { postsApi } from '@/lib/api';
import { Button } from '@/components/ui';

interface Post {
  id: string;
  title: string;
  content: string;
  category: string;
  author: {
    name: string;
  };
  createdAt: string;
  reactions: Array<{ type: string }>;
  _count: {
    comments: number;
  };
}

export const FeedList: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await postsApi.getAll({ limit: 10 });
      setPosts(response.data);
    } catch (err) {
      setError('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const handleReaction = async (postId: string, type: string) => {
    try {
      await postsApi.addReaction(postId, type);
      fetchPosts(); // Refresh posts
    } catch (err) {
      console.error('Failed to add reaction');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading posts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        {error}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No posts yet. Be the first to share!</p>
        <Button variant="primary" size="sm" className="mt-4">
          Create Post
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div
          key={post.id}
          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-gray-900">{post.title}</h3>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                  {post.category}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                by {post.author.name} • {new Date(post.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <p className="mt-3 text-gray-700">{post.content}</p>

          <div className="mt-4 flex items-center space-x-4 text-sm">
            <button
              onClick={() => handleReaction(post.id, 'like')}
              className="flex items-center space-x-1 text-gray-600 hover:text-blue-600"
            >
              <span>👍</span>
              <span>{post.reactions.filter((r) => r.type === 'like').length}</span>
            </button>
            <button className="flex items-center space-x-1 text-gray-600 hover:text-blue-600">
              <span>💬</span>
              <span>{post._count?.comments || 0}</span>
            </button>
            <button className="text-gray-600 hover:text-blue-600">Share</button>
          </div>
        </div>
      ))}
    </div>
  );
};
