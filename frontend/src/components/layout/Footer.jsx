import { Link } from 'react-router-dom'
import { sdgs } from '../../data/sdgs.js'

export default function Footer() {
  return (
    <footer className="relative border-t border-gray-200/50 dark:border-white/5 bg-white/30 dark:bg-gray-950/30 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🌿</span>
              <span className="text-xl font-bold bg-gradient-to-r from-eco-500 to-emerald-600 bg-clip-text text-transparent">
                EcoEvent AI
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm max-w-md mb-6">
              Plan Smarter. Waste Less. Create Sustainable Impact. An AI-powered platform helping organizations design environmentally sustainable events.
            </p>
            <div className="flex gap-2 flex-wrap">
              {sdgs.slice(0, 6).map((sdg) => (
                <span
                  key={sdg.id}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ backgroundColor: sdg.color }}
                  title={sdg.title}
                >
                  {sdg.id}
                </span>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[ 
                { to: '/analyze', label: 'Event Analyzer' },
                { to: '/dashboard', label: 'Dashboard' },
                { to: '/assistant', label: 'AI Assistant' },
                { to: '/simulator', label: 'Carbon Simulator' },
                { to: '/leaderboard', label: 'Leaderboard' },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-gray-500 dark:text-gray-400 hover:text-eco-500 dark:hover:text-eco-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Resources</h3>
            <ul className="space-y-2">
              {[
                { to: '/sdg-impact', label: 'SDG Impact Center' },
                { to: '/reports', label: 'Reports' },
                { to: '/about', label: 'About Project' },
                { to: '/settings', label: 'Settings' },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-gray-500 dark:text-gray-400 hover:text-eco-500 dark:hover:text-eco-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-gray-200/50 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500 dark:text-gray-500">
            © 2026 EcoEvent AI. Built for a sustainable future.
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-600">
            Supporting UN Sustainable Development Goals
          </p>
        </div>
      </div>
    </footer>
  )
}
