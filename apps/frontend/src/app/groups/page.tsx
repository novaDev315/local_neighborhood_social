'use client';

import { useEffect, useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Card, CardContent, Button } from '@/components/ui';
import { groupsApi } from '@/lib/api';
import Link from 'next/link';

interface Group {
  id: string;
  name: string;
  description: string;
  privacy: 'PUBLIC' | 'PRIVATE' | 'SECRET';
  category: string;
  creator: {
    name: string;
  };
  _count: {
    members: number;
  };
  createdAt: string;
}

const privacyLevels = [
  { value: 'ALL', label: 'All Groups' },
  { value: 'PUBLIC', label: 'Public' },
  { value: 'PRIVATE', label: 'Private' },
];

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [privacyFilter, setPrivacyFilter] = useState('ALL');

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const response = await groupsApi.getAll();
      setGroups(response.data);
    } catch (err) {
      console.error('Failed to load groups');
    } finally {
      setLoading(false);
    }
  };

  const filteredGroups =
    privacyFilter === 'ALL'
      ? groups
      : groups.filter((g) => g.privacy === privacyFilter);

  const getPrivacyIcon = (privacy: string) => {
    switch (privacy) {
      case 'PUBLIC':
        return '🌐';
      case 'PRIVATE':
        return '🔒';
      case 'SECRET':
        return '🔐';
      default:
        return '👥';
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Groups</h1>
                <p className="text-gray-600 mt-1">
                  Join groups to connect with neighbors who share your interests
                </p>
              </div>
              <Link href="/groups/create">
                <Button variant="primary">Create Group</Button>
              </Link>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Privacy Filters */}
          <div className="mb-6 flex gap-2">
            {privacyLevels.map((level) => (
              <Button
                key={level.value}
                variant={privacyFilter === level.value ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setPrivacyFilter(level.value)}
              >
                {level.label}
              </Button>
            ))}
          </div>

          {/* My Groups Section */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">My Groups</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                Groups you've joined will appear here
              </p>
            </div>
          </div>

          {/* All Groups Grid */}
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Discover Groups
            </h2>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading groups...</p>
            </div>
          ) : filteredGroups.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-gray-600">No groups found</p>
                <Link href="/groups/create">
                  <Button variant="primary" className="mt-4">
                    Create the first group
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGroups.map((group) => (
                <Card
                  key={group.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardContent padding="md">
                    <div className="mb-3">
                      <div className="flex items-start justify-between">
                        <h3 className="text-xl font-bold text-gray-900 flex-1">
                          {group.name}
                        </h3>
                        <span className="text-2xl ml-2">
                          {getPrivacyIcon(group.privacy)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                          {group.privacy}
                        </span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          {group.category}
                        </span>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                      {group.description}
                    </p>

                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div className="flex items-center">
                        <span className="mr-2">👥</span>
                        <span>{group._count.members} members</span>
                      </div>
                      <div className="flex items-center">
                        <span className="mr-2">👤</span>
                        <span>Created by {group.creator.name}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="mr-2">📅</span>
                        <span>
                          {new Date(group.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <Link href={`/groups/${group.id}`}>
                      <Button variant="primary" size="sm" className="w-full">
                        View Group
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
