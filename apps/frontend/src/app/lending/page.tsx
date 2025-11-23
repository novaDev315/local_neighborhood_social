'use client';

import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Card, CardHeader, CardTitle, CardContent, Button, Input } from '@/components/ui';
import { lendingApi } from '@/lib/api';
import Link from 'next/link';

const LENDING_CATEGORIES = ['TOOLS', 'GARDEN', 'KITCHEN', 'SPORTS', 'ELECTRONICS', 'PARTY', 'CAMPING', 'BABY', 'OTHER'];

interface LendingItem {
  id: string;
  name: string;
  description: string;
  category: string;
  condition: string;
  imageUrl?: string;
  status: string;
  maxLendDays: number;
  depositAmount?: number;
  createdAt: string;
  owner: { id: string; name: string };
}

export default function LendingPage() {
  const [items, setItems] = useState<LendingItem[]>([]);
  const [myItems, setMyItems] = useState<LendingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'browse' | 'my-items' | 'requests'>('browse');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'TOOLS',
    condition: 'GOOD',
    maxLendDays: 7,
    depositAmount: '',
  });

  useEffect(() => {
    if (activeTab === 'browse') {
      loadItems();
    } else if (activeTab === 'my-items') {
      loadMyItems();
    }
  }, [filter, activeTab]);

  const loadItems = async () => {
    try {
      const params: { category?: string; status?: string } = { status: 'AVAILABLE' };
      if (filter) params.category = filter;
      const response = await lendingApi.getItems(params);
      setItems(response.data);
    } catch (error) {
      console.error('Failed to load items:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMyItems = async () => {
    try {
      const response = await lendingApi.getMyItems();
      setMyItems(response.data);
    } catch (error) {
      console.error('Failed to load my items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await lendingApi.createItem({
        ...formData,
        depositAmount: formData.depositAmount ? parseFloat(formData.depositAmount) : null,
      });
      setShowForm(false);
      setFormData({
        name: '',
        description: '',
        category: 'TOOLS',
        condition: 'GOOD',
        maxLendDays: 7,
        depositAmount: '',
      });
      if (activeTab === 'my-items') loadMyItems();
      else loadItems();
    } catch (error) {
      console.error('Failed to add item:', error);
    }
  };

  const getCategoryLabel = (category: string) => {
    return category.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'LENT_OUT': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Lending Library</h1>
              <div className="flex space-x-4">
                <Button onClick={() => setShowForm(!showForm)}>
                  {showForm ? 'Cancel' : 'Add Item to Lend'}
                </Button>
                <Link href="/dashboard">
                  <Button variant="ghost">Back to Dashboard</Button>
                </Link>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Tabs */}
          <div className="flex space-x-4 mb-6 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('browse')}
              className={`pb-2 px-1 ${activeTab === 'browse' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
            >
              Browse Items
            </button>
            <button
              onClick={() => setActiveTab('my-items')}
              className={`pb-2 px-1 ${activeTab === 'my-items' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
            >
              My Items
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              className={`pb-2 px-1 ${activeTab === 'requests' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
            >
              Borrow Requests
            </button>
          </div>

          {/* Category Filter (for browse) */}
          {activeTab === 'browse' && (
            <div className="flex flex-wrap gap-2 mb-6">
              <Button
                variant={filter === '' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('')}
              >
                All
              </Button>
              {LENDING_CATEGORIES.map((cat) => (
                <Button
                  key={cat}
                  variant={filter === cat ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter(cat)}
                >
                  {getCategoryLabel(cat)}
                </Button>
              ))}
            </div>
          )}

          {/* Create Form */}
          {showForm && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Add Item to Lending Library</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Item Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 dark:bg-gray-700"
                      >
                        {LENDING_CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>{getCategoryLabel(cat)}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Condition</label>
                      <select
                        value={formData.condition}
                        onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 dark:bg-gray-700"
                      >
                        <option value="NEW">New</option>
                        <option value="EXCELLENT">Excellent</option>
                        <option value="GOOD">Good</option>
                        <option value="FAIR">Fair</option>
                      </select>
                    </div>
                    <Input
                      label="Max Lend Days"
                      type="number"
                      value={formData.maxLendDays}
                      onChange={(e) => setFormData({ ...formData, maxLendDays: parseInt(e.target.value) })}
                      required
                    />
                    <Input
                      label="Deposit Amount (optional)"
                      type="number"
                      step="0.01"
                      value={formData.depositAmount}
                      onChange={(e) => setFormData({ ...formData, depositAmount: e.target.value })}
                      placeholder="0.00"
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
                  <Button type="submit">Add Item</Button>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Items Grid */}
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : (
            <>
              {activeTab === 'browse' && (
                items.length === 0 ? (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <p className="text-gray-500">No items available to borrow</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((item) => (
                      <Card key={item.id}>
                        {item.imageUrl && (
                          <img src={item.imageUrl} alt={item.name} className="w-full h-40 object-cover rounded-t-lg" />
                        )}
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                              {getCategoryLabel(item.category)}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                              {item.status.replace('_', ' ')}
                            </span>
                          </div>
                          <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-1">{item.name}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">{item.description}</p>
                          <div className="text-sm text-gray-500 space-y-1">
                            <p>Condition: {item.condition}</p>
                            <p>Max {item.maxLendDays} days</p>
                            {item.depositAmount && <p>Deposit: ${item.depositAmount}</p>}
                          </div>
                          <p className="mt-2 text-xs text-gray-400">Owner: {item.owner?.name}</p>
                          <Button className="mt-3 w-full" size="sm">Request to Borrow</Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )
              )}

              {activeTab === 'my-items' && (
                myItems.length === 0 ? (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <p className="text-gray-500">You haven't added any items yet</p>
                      <Button className="mt-4" onClick={() => setShowForm(true)}>Add Your First Item</Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {myItems.map((item) => (
                      <Card key={item.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {getCategoryLabel(item.category)}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                              {item.status.replace('_', ' ')}
                            </span>
                          </div>
                          <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{item.name}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{item.description}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )
              )}

              {activeTab === 'requests' && (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-gray-500">No pending borrow requests</p>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
