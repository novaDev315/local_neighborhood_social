'use client';

import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Card, CardHeader, CardTitle, CardContent, Button, Input } from '@/components/ui';
import { lostFoundApi } from '@/lib/api';
import Link from 'next/link';

const LOST_FOUND_TYPES = ['LOST_PET', 'FOUND_PET', 'LOST_ITEM', 'FOUND_ITEM'];

interface LostFoundItem {
  id: string;
  type: string;
  title: string;
  description: string;
  petName?: string;
  petType?: string;
  itemType?: string;
  lastSeenLocation: string;
  lastSeenDate: string;
  contactPhone?: string;
  imageUrl?: string;
  status: string;
  createdAt: string;
  reporter: { name: string };
}

export default function LostFoundPage() {
  const [items, setItems] = useState<LostFoundItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: 'LOST_PET',
    title: '',
    description: '',
    petName: '',
    petType: '',
    itemType: '',
    lastSeenLocation: '',
    lastSeenDate: '',
    contactPhone: '',
  });

  useEffect(() => {
    loadItems();
  }, [filter]);

  const loadItems = async () => {
    try {
      const params = filter ? { type: filter } : {};
      const response = await lostFoundApi.getAll(params);
      setItems(response.data);
    } catch (error) {
      console.error('Failed to load items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await lostFoundApi.create(formData);
      setShowForm(false);
      setFormData({
        type: 'LOST_PET',
        title: '',
        description: '',
        petName: '',
        petType: '',
        itemType: '',
        lastSeenLocation: '',
        lastSeenDate: '',
        contactPhone: '',
      });
      loadItems();
    } catch (error) {
      console.error('Failed to create post:', error);
    }
  };

  const getTypeColor = (type: string) => {
    if (type.includes('LOST')) return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
  };

  const getTypeLabel = (type: string) => {
    return type.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Lost & Found</h1>
              <div className="flex space-x-4">
                <Button onClick={() => setShowForm(!showForm)}>
                  {showForm ? 'Cancel' : 'Report Lost/Found'}
                </Button>
                <Link href="/dashboard">
                  <Button variant="ghost">Back to Dashboard</Button>
                </Link>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Filter Tabs */}
          <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
            <Button
              variant={filter === '' ? 'default' : 'outline'}
              onClick={() => setFilter('')}
            >
              All
            </Button>
            {LOST_FOUND_TYPES.map((type) => (
              <Button
                key={type}
                variant={filter === type ? 'default' : 'outline'}
                onClick={() => setFilter(type)}
              >
                {getTypeLabel(type)}
              </Button>
            ))}
          </div>

          {/* Create Form */}
          {showForm && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Report Lost or Found</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 dark:bg-gray-700"
                      >
                        {LOST_FOUND_TYPES.map((type) => (
                          <option key={type} value={type}>{getTypeLabel(type)}</option>
                        ))}
                      </select>
                    </div>
                    <Input
                      label="Title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                    {formData.type.includes('PET') && (
                      <>
                        <Input
                          label="Pet Name"
                          value={formData.petName}
                          onChange={(e) => setFormData({ ...formData, petName: e.target.value })}
                        />
                        <Input
                          label="Pet Type (dog, cat, etc.)"
                          value={formData.petType}
                          onChange={(e) => setFormData({ ...formData, petType: e.target.value })}
                        />
                      </>
                    )}
                    {formData.type.includes('ITEM') && (
                      <Input
                        label="Item Type"
                        value={formData.itemType}
                        onChange={(e) => setFormData({ ...formData, itemType: e.target.value })}
                      />
                    )}
                    <Input
                      label="Last Seen Location"
                      value={formData.lastSeenLocation}
                      onChange={(e) => setFormData({ ...formData, lastSeenLocation: e.target.value })}
                      required
                    />
                    <Input
                      label="Last Seen Date"
                      type="date"
                      value={formData.lastSeenDate}
                      onChange={(e) => setFormData({ ...formData, lastSeenDate: e.target.value })}
                      required
                    />
                    <Input
                      label="Contact Phone"
                      value={formData.contactPhone}
                      onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 dark:bg-gray-700"
                      rows={3}
                      required
                    />
                  </div>
                  <Button type="submit">Submit Report</Button>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Items Grid */}
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : items.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-gray-500">No lost or found items reported yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  {item.imageUrl && (
                    <img src={item.imageUrl} alt={item.title} className="w-full h-48 object-cover" />
                  )}
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(item.type)}`}>
                        {getTypeLabel(item.type)}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">{item.title}</h3>
                    {item.petName && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">Pet: {item.petName} ({item.petType})</p>
                    )}
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">{item.description}</p>
                    <div className="mt-3 text-sm text-gray-500">
                      <p>Last seen: {item.lastSeenLocation}</p>
                      <p>Date: {new Date(item.lastSeenDate).toLocaleDateString()}</p>
                    </div>
                    {item.contactPhone && (
                      <p className="mt-2 text-sm font-medium text-blue-600">Contact: {item.contactPhone}</p>
                    )}
                    <p className="mt-2 text-xs text-gray-400">Posted by: {item.reporter?.name}</p>
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
