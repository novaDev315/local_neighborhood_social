import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Connect with Your Neighborhood
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            A hyperlocal social network that brings neighbors together through events,
            safety alerts, marketplace, and community engagement.
          </p>

          <div className="flex gap-4 justify-center mb-16">
            <Link
              href="/auth/register"
              className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Get Started
            </Link>
            <Link
              href="/auth/login"
              className="px-8 py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition"
            >
              Sign In
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="p-6 bg-white rounded-lg shadow-md">
              <div className="text-4xl mb-4">🏘️</div>
              <h3 className="text-xl font-semibold mb-2">Community Feed</h3>
              <p className="text-gray-600">
                Share updates, ask questions, and stay connected with your neighbors
              </p>
            </div>

            <div className="p-6 bg-white rounded-lg shadow-md">
              <div className="text-4xl mb-4">📅</div>
              <h3 className="text-xl font-semibold mb-2">Local Events</h3>
              <p className="text-gray-600">
                Discover and organize neighborhood events, gatherings, and activities
              </p>
            </div>

            <div className="p-6 bg-white rounded-lg shadow-md">
              <div className="text-4xl mb-4">🛡️</div>
              <h3 className="text-xl font-semibold mb-2">Safety Alerts</h3>
              <p className="text-gray-600">
                Real-time safety notifications to keep your neighborhood informed
              </p>
            </div>

            <div className="p-6 bg-white rounded-lg shadow-md">
              <div className="text-4xl mb-4">🏪</div>
              <h3 className="text-xl font-semibold mb-2">Local Marketplace</h3>
              <p className="text-gray-600">
                Buy, sell, and trade with trusted neighbors in your area
              </p>
            </div>

            <div className="p-6 bg-white rounded-lg shadow-md">
              <div className="text-4xl mb-4">💼</div>
              <h3 className="text-xl font-semibold mb-2">Business Directory</h3>
              <p className="text-gray-600">
                Discover and support local businesses in your community
              </p>
            </div>

            <div className="p-6 bg-white rounded-lg shadow-md">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-xl font-semibold mb-2">Groups & Communities</h3>
              <p className="text-gray-600">
                Join interest-based groups and connect with like-minded neighbors
              </p>
            </div>
          </div>

          <div className="mt-16 text-sm text-gray-500">
            <p>🔒 Privacy-focused · ✅ Address verified · 🌍 Hyperlocal by design</p>
          </div>
        </div>
      </div>
    </main>
  );
}
