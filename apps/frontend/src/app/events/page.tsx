'use client';

import { useEffect, useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Card, CardHeader, CardTitle, CardContent, Button } from '@/components/ui';
import { eventsApi } from '@/lib/api';
import Link from 'next/link';

interface Event {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  organizer: {
    name: string;
  };
  maxAttendees?: number;
  _count: {
    rsvps: number;
  };
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'upcoming'>('upcoming');

  useEffect(() => {
    fetchEvents();
  }, [filter]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response =
        filter === 'upcoming'
          ? await eventsApi.getUpcoming()
          : await eventsApi.getUpcoming(); // TODO: Implement getAll
      setEvents(response.data);
    } catch (err) {
      console.error('Failed to load events');
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
                <h1 className="text-3xl font-bold text-gray-900">Events</h1>
                <p className="text-gray-600 mt-1">
                  Discover and join neighborhood events
                </p>
              </div>
              <Link href="/events/create">
                <Button variant="primary">Create Event</Button>
              </Link>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Filters */}
          <div className="mb-6 flex space-x-2">
            <Button
              variant={filter === 'upcoming' ? 'primary' : 'outline'}
              onClick={() => setFilter('upcoming')}
            >
              Upcoming
            </Button>
            <Button
              variant={filter === 'all' ? 'primary' : 'outline'}
              onClick={() => setFilter('all')}
            >
              All Events
            </Button>
          </div>

          {/* Events Grid */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading events...</p>
            </div>
          ) : events.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-gray-600">No events found</p>
                <Link href="/events/create">
                  <Button variant="primary" className="mt-4">
                    Create the first event
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <Card key={event.id} className="hover:shadow-lg transition-shadow">
                  <CardContent padding="md">
                    <div className="mb-3">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {event.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {event.description}
                      </p>
                    </div>

                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div className="flex items-center">
                        <span className="mr-2">📅</span>
                        <span>
                          {new Date(event.startDate).toLocaleDateString()} at{' '}
                          {new Date(event.startDate).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="mr-2">📍</span>
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="mr-2">👤</span>
                        <span>by {event.organizer.name}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="mr-2">👥</span>
                        <span>
                          {event._count.rsvps} attending
                          {event.maxAttendees && ` / ${event.maxAttendees}`}
                        </span>
                      </div>
                    </div>

                    <Link href={`/events/${event.id}`}>
                      <Button variant="primary" size="sm" className="w-full">
                        View Details
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
