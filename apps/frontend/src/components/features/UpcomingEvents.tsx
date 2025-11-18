'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { eventsApi } from '@/lib/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';

interface Event {
  id: string;
  title: string;
  startDate: string;
  location: string;
}

export const UpcomingEvents: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await eventsApi.getUpcoming();
      setEvents(response.data.slice(0, 3)); // Show only 3 upcoming events
    } catch (err) {
      console.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Upcoming Events</CardTitle>
          <Link
            href="/events"
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            See all
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : events.length === 0 ? (
          <p className="text-sm text-gray-600">No upcoming events</p>
        ) : (
          <div className="space-y-3">
            {events.map((event) => (
              <Link
                key={event.id}
                href={`/events/${event.id}`}
                className="block p-3 rounded-lg hover:bg-gray-50 border border-gray-200"
              >
                <h4 className="font-medium text-gray-900">{event.title}</h4>
                <p className="text-sm text-gray-600 mt-1">
                  📅 {new Date(event.startDate).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">📍 {event.location}</p>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
