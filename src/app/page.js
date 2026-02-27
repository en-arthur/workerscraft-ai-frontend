'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getAuthToken } from '@/lib/api';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard if already authenticated
    const token = getAuthToken();
    if (token) {
      router.push('/dashboard');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Workerscraft</h1>
            <div className="flex items-center gap-4">
              <Link
                href="/auth/login"
                className="px-4 py-2 text-gray-700 hover:text-gray-900"
              >
                Sign in
              </Link>
              <Link
                href="/auth/signup"
                className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Your Personal Software Engineer
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Workerscraft uses a Master Architect Agent to autonomously build production-ready
            web and mobile applications. Just describe your idea, and watch it come to life.
          </p>
          <Link
            href="/auth/signup"
            className="inline-block px-8 py-4 bg-blue-600 text-white text-lg font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Start Building for Free
          </Link>
        </div>

        {/* Features */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-blue-600 text-3xl mb-4">🤖</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              AI-Powered Development
            </h3>
            <p className="text-gray-600">
              Our Master Architect Agent autonomously plans, builds, and maintains your application.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-blue-600 text-3xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Live Preview
            </h3>
            <p className="text-gray-600">
              See your application come to life in real-time with instant preview and updates.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-blue-600 text-3xl mb-4">🔧</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Self-Healing
            </h3>
            <p className="text-gray-600">
              Automatic error detection and correction ensures your build succeeds every time.
            </p>
          </div>
        </div>

        {/* Pricing Tiers Preview */}
        <div className="mt-20">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Simple, Transparent Pricing
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md border-2 border-gray-200">
              <h4 className="text-2xl font-bold text-gray-900 mb-2">Free</h4>
              <p className="text-4xl font-bold text-gray-900 mb-4">$0</p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center text-gray-600">
                  <span className="mr-2">✓</span> 1 Lifetime Build
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="mr-2">✓</span> Web & Mobile Apps
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="mr-2">✓</span> Live Preview
                </li>
              </ul>
              <Link
                href="/auth/signup"
                className="block w-full text-center px-6 py-3 border-2 border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors"
              >
                Get Started
              </Link>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg border-2 border-blue-600 relative">
              <div className="absolute top-0 right-0 bg-blue-600 text-white px-3 py-1 text-sm font-medium rounded-bl-lg">
                Popular
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-2">Starter</h4>
              <p className="text-4xl font-bold text-gray-900 mb-4">$30<span className="text-lg text-gray-600">/mo</span></p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center text-gray-600">
                  <span className="mr-2">✓</span> 10 Builds/month
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="mr-2">✓</span> Chat-based Iteration
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="mr-2">✓</span> Supabase Backend
                </li>
              </ul>
              <Link
                href="/auth/signup"
                className="block w-full text-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Get Started
              </Link>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md border-2 border-gray-200">
              <h4 className="text-2xl font-bold text-gray-900 mb-2">Max</h4>
              <p className="text-4xl font-bold text-gray-900 mb-4">$100<span className="text-lg text-gray-600">/mo</span></p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center text-gray-600">
                  <span className="mr-2">✓</span> Unlimited Builds
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="mr-2">✓</span> Priority Support
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="mr-2">✓</span> All Features
                </li>
              </ul>
              <Link
                href="/auth/signup"
                className="block w-full text-center px-6 py-3 border-2 border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
          <div className="text-center mt-8">
            <Link
              href="/pricing"
              className="inline-block text-blue-600 hover:text-blue-700 font-medium"
            >
              View detailed pricing and features →
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-600">
            © 2026 Workerscraft.
          </p>
        </div>
      </footer>
    </div>
  );
}
