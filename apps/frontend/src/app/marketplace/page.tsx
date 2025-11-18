'use client';

import { useEffect, useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Card, CardContent, Button } from '@/components/ui';
import { marketplaceApi } from '@/lib/api';
import Link from 'next/link';

interface MarketplaceItem {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  condition: string;
  images: string[];
  seller: {
    name: string;
  };
  createdAt: string;
  sold: boolean;
}

export default function MarketplacePage() {
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<string>('all');

  const categories = [
    { value: 'all', label: 'All Items' },
    { value: 'FREE', label: 'Free Stuff' },
    { value: 'FOR_SALE', label: 'For Sale' },
    { value: 'SERVICES', label: 'Services' },
    { value: 'WANTED', label: 'Wanted' },
  ];

  useEffect(() => {
    fetchItems();
  }, [category]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await marketplaceApi.getAll({
        category: category === 'all' ? undefined : category,
      });
      setItems(response.data);
    } catch (err) {
      console.error('Failed to load marketplace items');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Marketplace</h1>
                <p className="text-gray-600 mt-1">
                  Buy, sell, and trade with your neighbors
                </p>
              </div>
              <Link href="/marketplace/create">
                <Button variant="primary">List Item</Button>
              </Link>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Category Filters */}
          <div className="mb-6 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Button
                key={cat.value}
                variant={category === cat.value ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setCategory(cat.value)}
              >
                {cat.label}
              </Button>
            ))}
          </div>

          {/* Items Grid */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading items...</p>
            </div>
          ) : items.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-gray-600">No items found</p>
                <Link href="/marketplace/create">
                  <Button variant="primary" className="mt-4">
                    List the first item
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((item) => (
                <Card
                  key={item.id}
                  className="hover:shadow-lg transition-shadow overflow-hidden"
                >
                  <div className="relative">
                    {item.images.length > 0 ? (
                      <img
                        src={item.images[0]}
                        alt={item.title}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400 text-4xl">📦</span>
                      </div>
                    )}
                    {item.sold && (
                      <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-semibold">
                        SOLD
                      </div>
                    )}
                    {item.price === 0 && !item.sold && (
                      <div className="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 rounded text-xs font-semibold">
                        FREE
                      </div>
                    )}
                  </div>

                  <CardContent padding="md">
                    <div className="mb-2">
                      <h3 className="font-bold text-lg text-gray-900 line-clamp-1">
                        {item.title}
                      </h3>
                      {item.price > 0 && (
                        <p className="text-2xl font-bold text-blue-600">
                          ${item.price.toFixed(2)}
                        </p>
                      )}
                    </div>

                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      {item.description}
                    </p>

                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                      <span className="inline-flex items-center px-2 py-1 rounded bg-gray-100">
                        {item.condition}
                      </span>
                      <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>

                    <div className="text-sm text-gray-600 mb-3">
                      <span className="font-medium">Seller:</span> {item.seller.name}
                    </div>

                    <Link href={`/marketplace/${item.id}`}>
                      <Button
                        variant={item.sold ? 'ghost' : 'primary'}
                        size="sm"
                        className="w-full"
                        disabled={item.sold}
                      >
                        {item.sold ? 'Sold' : 'View Details'}
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
