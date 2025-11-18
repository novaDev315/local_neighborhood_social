'use client';

import { Card, CardHeader, CardTitle, CardContent, Button } from '@/components/ui';

export const QuickActions: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Button variant="primary" size="md" className="w-full justify-start">
            <span className="mr-2">✍️</span>
            Create Post
          </Button>
          <Button variant="outline" size="md" className="w-full justify-start">
            <span className="mr-2">📅</span>
            Plan Event
          </Button>
          <Button variant="outline" size="md" className="w-full justify-start">
            <span className="mr-2">🛒</span>
            List Item
          </Button>
          <Button variant="outline" size="md" className="w-full justify-start">
            <span className="mr-2">🚨</span>
            Report Alert
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
