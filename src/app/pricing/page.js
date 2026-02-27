'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Check, Zap, Sparkles, Crown } from 'lucide-react';
import { getAuthToken } from '@/lib/api';

export default function PricingPage() {
  const router = useRouter();
  const [currentTier, setCurrentTier] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch current user tier if authenticated
    const fetchUserTier = async () => {
      const token = getAuthToken();
      if (token) {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/users/me`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            setCurrentTier(data.subscription_tier);
          }
        } catch (error) {
          console.error('Failed to fetch user tier:', error);
        }
      }
      setIsLoading(false);
    };

    fetchUserTier();
  }, []);

  const tiers = [
    {
      name: 'Free',
      price: '$0',
      period: '',
      description: 'Perfect for trying out Workerscraft',
      features: [
        '1 Lifetime Build',
        'Web & Mobile Apps',
        'AI Chat Assistant',
        'Live Preview',
        'E2B Sandbox Environment',
        'Deploy via Vercel',
        'Export as ZIP',
      ],
      cta: 'Get Started',
      ctaLink: '/auth/signup',
      highlighted: false,
      icon: Zap,
      tier: 'free',
    },
    {
      name: 'Starter',
      price: '$30',
      period: '/month',
      description: 'For developers building multiple projects',
      features: [
        '10 Builds per Month',
        'Chat-based Iteration',
        'Supabase Backend',
        'Visual Debugger',
        'Self-Healing Errors',
        'Environment Variables',
        'Custom Domain Deployment',
        'Direct Deployment',
      ],
      cta: 'Get Started',
      ctaLink: '/auth/signup',
      polarCheckoutUrl: 'https://polar.sh/workerscraft/starter', // Replace with actual Polar URL
      highlighted: true,
      icon: Sparkles,
      tier: 'starter',
    },
    {
      name: 'Max',
      price: '$100',
      period: '/month',
      description: 'For power users and teams',
      features: [
        'Unlimited Builds',
        'Priority Support',
        'All Starter Features',
        'Advanced Analytics',
        'Dedicated Resources',
        'Early Access to Features',
        'Premium Support Channel',
      ],
      cta: 'Get Started',
      ctaLink: '/auth/signup',
      polarCheckoutUrl: 'https://polar.sh/workerscraft/max', // Replace with actual Polar URL
      highlighted: false,
      icon: Crown,
      tier: 'max',
    },
  ];

  const handleCTAClick = (tier) => {
    if (tier.polarCheckoutUrl && currentTier && currentTier !== 'free') {
      // Redirect to Polar checkout for paid tiers
      window.location.href = tier.polarCheckoutUrl;
    } else {
      router.push(tier.ctaLink);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="bg-gray-900 shadow-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
              Workerscraft
            </Link>
            <div className="flex items-center gap-4">
              {currentTier ? (
                <Link
                  href="/dashboard"
                  className="px-4 py-2 text-gray-300 hover:text-white"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="px-4 py-2 text-gray-300 hover:text-white"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-medium rounded-lg hover:from-blue-500 hover:to-cyan-500 transition-colors"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Choose the plan that fits your needs. Start free and upgrade as you grow.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {tiers.map((tier) => {
            const Icon = tier.icon;
            const isCurrentTier = !isLoading && currentTier === tier.tier;
            
            return (
              <div
                key={tier.name}
                className={`relative bg-gray-900 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl ${
                  tier.highlighted
                    ? 'border-4 border-cyan-500 transform md:scale-105'
                    : 'border-2 border-gray-800'
                } ${isCurrentTier ? 'ring-4 ring-green-500' : ''}`}
              >
                {tier.highlighted && (
                  <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                      Most Popular
                    </span>
                  </div>
                )}

                {isCurrentTier && (
                  <div className="absolute -top-5 right-4">
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                      Current Plan
                    </span>
                  </div>
                )}

                <div className="p-8">
                  {/* Icon and Name */}
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold text-white">{tier.name}</h3>
                    <Icon className={`w-8 h-8 ${tier.highlighted ? 'text-cyan-400' : 'text-gray-500'}`} />
                  </div>

                  {/* Price */}
                  <div className="mb-4">
                    <span className="text-5xl font-bold text-white">{tier.price}</span>
                    {tier.period && (
                      <span className="text-xl text-gray-400">{tier.period}</span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-gray-400 mb-6">{tier.description}</p>

                  {/* CTA Button */}
                  <button
                    onClick={() => handleCTAClick(tier)}
                    disabled={isCurrentTier}
                    className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors mb-8 ${
                      tier.highlighted
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-500 hover:to-cyan-500'
                        : 'border-2 border-cyan-500 text-cyan-400 hover:bg-cyan-500/10'
                    } ${isCurrentTier ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isCurrentTier ? 'Current Plan' : tier.cta}
                  </button>

                  {/* Features List */}
                  <ul className="space-y-4">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Feature Comparison Table */}
        <div className="bg-gray-900 rounded-2xl shadow-lg p-8 mb-16 border border-gray-800">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-8 text-center">
            Feature Comparison
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-800">
                  <th className="text-left py-4 px-4 text-white font-semibold">Feature</th>
                  <th className="text-center py-4 px-4 text-white font-semibold">Free</th>
                  <th className="text-center py-4 px-4 text-white font-semibold">Starter</th>
                  <th className="text-center py-4 px-4 text-white font-semibold">Max</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                <tr>
                  <td className="py-4 px-4 text-gray-300">Monthly Builds</td>
                  <td className="text-center py-4 px-4 text-gray-400">1 Lifetime</td>
                  <td className="text-center py-4 px-4 text-gray-400">10</td>
                  <td className="text-center py-4 px-4 text-gray-400">Unlimited</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 text-gray-300">Web & Mobile Apps</td>
                  <td className="text-center py-4 px-4"><Check className="w-5 h-5 text-green-400 mx-auto" /></td>
                  <td className="text-center py-4 px-4"><Check className="w-5 h-5 text-green-400 mx-auto" /></td>
                  <td className="text-center py-4 px-4"><Check className="w-5 h-5 text-green-400 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="py-4 px-4 text-gray-300">AI Chat Assistant</td>
                  <td className="text-center py-4 px-4"><Check className="w-5 h-5 text-green-400 mx-auto" /></td>
                  <td className="text-center py-4 px-4"><Check className="w-5 h-5 text-green-400 mx-auto" /></td>
                  <td className="text-center py-4 px-4"><Check className="w-5 h-5 text-green-400 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="py-4 px-4 text-gray-300">Live Preview</td>
                  <td className="text-center py-4 px-4"><Check className="w-5 h-5 text-green-400 mx-auto" /></td>
                  <td className="text-center py-4 px-4"><Check className="w-5 h-5 text-green-400 mx-auto" /></td>
                  <td className="text-center py-4 px-4"><Check className="w-5 h-5 text-green-400 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="py-4 px-4 text-gray-300">Deploy via Vercel</td>
                  <td className="text-center py-4 px-4"><Check className="w-5 h-5 text-green-400 mx-auto" /></td>
                  <td className="text-center py-4 px-4"><Check className="w-5 h-5 text-green-400 mx-auto" /></td>
                  <td className="text-center py-4 px-4"><Check className="w-5 h-5 text-green-400 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="py-4 px-4 text-gray-300">Supabase Backend</td>
                  <td className="text-center py-4 px-4 text-gray-600">—</td>
                  <td className="text-center py-4 px-4"><Check className="w-5 h-5 text-green-400 mx-auto" /></td>
                  <td className="text-center py-4 px-4"><Check className="w-5 h-5 text-green-400 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="py-4 px-4 text-gray-300">Visual Debugger</td>
                  <td className="text-center py-4 px-4 text-gray-600">—</td>
                  <td className="text-center py-4 px-4"><Check className="w-5 h-5 text-green-400 mx-auto" /></td>
                  <td className="text-center py-4 px-4"><Check className="w-5 h-5 text-green-400 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="py-4 px-4 text-gray-300">Custom Domain Deployment</td>
                  <td className="text-center py-4 px-4 text-gray-600">—</td>
                  <td className="text-center py-4 px-4"><Check className="w-5 h-5 text-green-400 mx-auto" /></td>
                  <td className="text-center py-4 px-4"><Check className="w-5 h-5 text-green-400 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="py-4 px-4 text-gray-300">Priority Support</td>
                  <td className="text-center py-4 px-4 text-gray-600">—</td>
                  <td className="text-center py-4 px-4 text-gray-600">—</td>
                  <td className="text-center py-4 px-4"><Check className="w-5 h-5 text-green-400 mx-auto" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-gray-900 rounded-2xl shadow-lg p-8 border border-gray-800">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6 max-w-3xl mx-auto">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Can I upgrade or downgrade my plan?
              </h3>
              <p className="text-gray-400">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately,
                and we'll prorate any charges or credits.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                What happens if I exceed my build limit?
              </h3>
              <p className="text-gray-400">
                If you reach your monthly build limit, you'll be prompted to upgrade to a higher tier.
                Your existing projects remain accessible, but you won't be able to start new builds.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Do you offer refunds?
              </h3>
              <p className="text-gray-400">
                We offer a 14-day money-back guarantee on all paid plans. If you're not satisfied,
                contact our support team for a full refund.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Can I export my projects?
              </h3>
              <p className="text-gray-400">
                Absolutely! All plans include the ability to export your projects as ZIP files.
                You own your code and can deploy it anywhere you like.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 mt-20 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-500">
            © 2026 Workerscraft. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
