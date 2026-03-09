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
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">W</span>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Workerscraft
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/auth/login"
                className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/auth/signup"
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-medium rounded-lg hover:from-blue-500 hover:to-cyan-500 transition-all shadow-lg shadow-blue-500/20"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="pt-24 pb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-800/50 border border-gray-700/50 rounded-full text-gray-300 text-sm mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            AI-Powered Software Development Platform
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold mb-6 tracking-tight">
            <span className="text-white">
              Your Personal 
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Software Engineer
            </span>
          </h1>
          
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Describe your idea in natural language. Our AI architect builds production-ready web and mobile apps automatically.
          </p>
          
          <div className="flex items-center justify-center gap-4 mb-16">
            <Link
              href="/auth/signup"
              className="px-8 py-3 bg-white text-gray-900 text-base font-semibold rounded-lg hover:bg-gray-100 transition-all"
            >
              Start building
            </Link>
            <Link
              href="/pricing"
              className="px-8 py-3 bg-transparent border border-gray-700 text-white text-base font-semibold rounded-lg hover:bg-gray-800 transition-all"
            >
              View pricing
            </Link>
          </div>

          
        </div>

        {/* App Demo */}
        <div className="py-24 border-t border-gray-800">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              See it in action
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Watch how Workerscraft builds a complete application from a simple description
            </p>
          </div>
          
          <div className="max-w-5xl mx-auto">
            {/* Demo Video/Screenshot Placeholder */}
            <div className="relative bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden aspect-video">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                  <p className="text-gray-400 text-lg">Demo video coming soon</p>
                </div>
              </div>
            </div>
            
            {/* Demo Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Instant Generation
                </h3>
                <p className="text-gray-400 text-sm">
                  From prompt to working app in under 60 seconds
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-cyan-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Live Preview
                </h3>
                <p className="text-gray-400 text-sm">
                  See changes in real-time as AI builds your app
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Chat to Refine
                </h3>
                <p className="text-gray-400 text-sm">
                  Iterate and improve through natural conversation
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="py-24 border-t border-gray-800">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Everything you need
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Professional development tools powered by AI
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-xl hover:border-gray-700 transition-all">
              <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Live preview
              </h3>
              <p className="text-gray-400 text-sm">
                See your app update in real-time as the AI builds it
              </p>
            </div>

            <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-xl hover:border-gray-700 transition-all">
              <div className="w-10 h-10 bg-cyan-500/10 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Chat to iterate
              </h3>
              <p className="text-gray-400 text-sm">
                Request changes and improvements through natural conversation
              </p>
            </div>

            <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-xl hover:border-gray-700 transition-all">
              <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Self-healing
              </h3>
              <p className="text-gray-400 text-sm">
                Automatic error detection and intelligent bug fixes
              </p>
            </div>

            <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-xl hover:border-gray-700 transition-all">
              <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Supabase backend
              </h3>
              <p className="text-gray-400 text-sm">
                PostgreSQL database and authentication included
              </p>
            </div>

            <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-xl hover:border-gray-700 transition-all">
              <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Web & mobile
              </h3>
              <p className="text-gray-400 text-sm">
                Build responsive web apps and native mobile applications
              </p>
            </div>

            <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-xl hover:border-gray-700 transition-all">
              <div className="w-10 h-10 bg-pink-500/10 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Export & deploy
              </h3>
              <p className="text-gray-400 text-sm">
                Download source code or deploy to production instantly
              </p>
            </div>
          </div>
        </div>

        {/* Pricing Tiers Preview */}
        <div className="py-24 border-t border-gray-800">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Simple pricing
            </h2>
            <p className="text-lg text-gray-400">
              Select a plan that fit your needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            
            {/* Starter Tier */}
            <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-xl">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-2">Starter</h3>
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-white">$30</span>
                  <span className="text-gray-400 ml-2">/mo</span>
                </div>
              </div>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start text-sm text-gray-400">
                  <svg className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  10 builds/month
                </li>
                <li className="flex items-start text-sm text-gray-400">
                  <svg className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  AI chat assistant
                </li>
                <li className="flex items-start text-sm text-gray-400">
                  <svg className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Supabase backend
                </li>
              </ul>
              <Link
                href="/auth/signup"
                className="block w-full text-center px-6 py-2 border border-gray-700 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-all"
              >
                Get started
              </Link>
            </div>

            {/* Pro Tier */}
            <div className="bg-white p-6 rounded-xl relative transform md:scale-105">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs font-semibold rounded-full">
                POPULAR
              </div>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Pro</h3>
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-gray-900">$50</span>
                  <span className="text-gray-500 ml-2">/mo</span>
                </div>
              </div>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start text-sm text-gray-600">
                  <svg className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  30 builds/month
                </li>
                <li className="flex items-start text-sm text-gray-600">
                  <svg className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  All Starter features
                </li>
                <li className="flex items-start text-sm text-gray-600">
                  <svg className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Priority support
                </li>
              </ul>
              <Link
                href="/auth/signup"
                className="block w-full text-center px-6 py-2 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-all"
              >
                Get started
              </Link>
            </div>

            {/* Max Tier */}
            <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-xl">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-2">Max</h3>
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-white">$100</span>
                  <span className="text-gray-400 ml-2">/mo</span>
                </div>
              </div>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start text-sm text-gray-400">
                  <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Unlimited builds
                </li>
                <li className="flex items-start text-sm text-gray-400">
                  <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  All Pro features
                </li>
                <li className="flex items-start text-sm text-gray-400">
                  <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Dedicated resources
                </li>
              </ul>
              <Link
                href="/auth/signup"
                className="block w-full text-center px-6 py-2 border border-gray-700 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-all"
              >
                Get started
              </Link>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link
              href="/pricing"
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              View detailed pricing →
            </Link>
          </div>
        </div>

        {/* CTA */}
        <div className="py-24 border-t border-gray-800">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to build?
            </h2>
            <p className="text-lg text-gray-400 mb-8">
              Start building your app today. No credit card required.
            </p>
            <Link
              href="/auth/signup"
              className="inline-block px-8 py-3 bg-white text-gray-900 text-base font-semibold rounded-lg hover:bg-gray-100 transition-all"
            >
              Get started for free
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">W</span>
              </div>
              <span className="text-gray-400">© 2026 Workerscraft AI</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
              <Link href="/auth/login" className="hover:text-white transition-colors">Sign in</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
