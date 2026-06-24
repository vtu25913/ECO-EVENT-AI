import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { FiSun, FiMoon, FiLogOut, FiMenu, FiX, FiChevronLeft, FiBarChart2, FiTrendingUp, FiAward, FiGlobe, FiFileText, FiInfo, FiSettings } from 'react-icons/fi'

const navSections = [
  {
    label: 'Main',
    links: [
      { path: '/dashboard', label: 'Dashboard', icon: <FiTrendingUp className="w-5 h-5" /> },
      { path: '/analyze', label: 'Analyzer', icon: <FiBarChart2 className="w-5 h-5" /> },
    ],
  },
  {
    label: 'Insights',
    links: [
      { path: '/leaderboard', label: 'Leaderboard', icon: <FiAward className="w-5 h-5" /> },
      { path: '/sdg-impact', label: 'SDG Impact', icon: <FiGlobe className="w-5 h-5" /> },
      { path: '/reports', label: 'Reports', icon: <FiFileText className="w-5 h-5" /> },
    ],
  },
  {
    label: 'Platform',
    links: [
      { path: '/about', label: 'About', icon: <FiInfo className="w-5 h-5" /> },
      { path: '/settings', label: 'Settings', icon: <FiSettings className="w-5 h-5" /> },
    ],
  },
]

const sectionVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.08, type: 'spring', stiffness: 200, damping: 25 },
  }),
}

const linkVariants = {
  hover: { scale: 1.02, x: 4 },
  tap: { scale: 0.98 },
}

export default function Sidebar({ collapsed: controlledCollapsed, onCollapsedChange }) {
  const [internalCollapsed, setInternalCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { isDark, toggleTheme } = useTheme()
  const { isAuthenticated, user, signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const collapsed = controlledCollapsed !== undefined ? controlledCollapsed : internalCollapsed
  const setCollapsed = onCollapsedChange || setInternalCollapsed

  const isActive = (path) => location.pathname === path

  const sidebarContent = (
    <div className={`flex flex-col h-full ${collapsed ? 'items-center' : ''}`}>
      {/* Premium gradient orb background */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-eco-500/20 via-emerald-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-500/10 via-purple-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative flex items-center ${collapsed ? 'justify-center' : 'justify-between'} px-4 py-5 border-b border-white/[0.06]`}
      >
        <Link to="/dashboard" className="flex items-center gap-3 group">
          <motion.div
            className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-eco-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-eco-500/20 group-hover:shadow-eco-500/30 transition-shadow"
            whileHover={{ rotate: [0, -10, 10, 0], scale: 1.05 }}
            transition={{ duration: 0.4 }}
          >
            <span className="text-lg leading-none relative z-10">🌿</span>
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent" />
          </motion.div>
          {!collapsed && (
            <div className="min-w-0">
              <span className="block text-base font-bold bg-gradient-to-r from-white via-white to-eco-300 bg-clip-text text-transparent leading-tight">
                EcoEvent AI
              </span>
              <span className="block text-[10px] text-gray-500 font-medium tracking-wider uppercase">
                Sustainability Platform
              </span>
            </div>
          )}
        </Link>
        <motion.button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex p-1.5 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-white/[0.06] transition-all"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <FiChevronLeft className={`w-4 h-4 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} />
        </motion.button>
      </motion.div>

      {/* Navigation */}
      <nav className="relative flex-1 overflow-y-auto px-3 py-5 space-y-6 scrollbar-hide">
        {navSections.map((section, si) => (
          <motion.div
            key={section.label}
            custom={si}
            initial="hidden"
            animate="visible"
            variants={sectionVariants}
          >
            {!collapsed && (
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500 mb-3 px-3 flex items-center gap-2">
                <span className="flex-1 h-px bg-gradient-to-r from-white/[0.06] to-transparent" />
                {section.label}
                <span className="flex-1 h-px bg-gradient-to-l from-white/[0.06] to-transparent" />
              </p>
            )}
            <div className="space-y-1">
              {section.links.map((link) => {
                const active = isActive(link.path)
                return (
                  <motion.div
                    key={link.path}
                    variants={linkVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <Link
                      to={link.path}
                      onClick={() => setMobileOpen(false)}
                      className={`relative flex items-center ${collapsed ? 'justify-center' : 'gap-3'} px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group`}
                    >
                      {/* Active indicator glow */}
                      {active && (
                        <motion.div
                          layoutId="sidebar-active"
                          className="absolute inset-0 rounded-xl"
                          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        >
                          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-eco-500/15 via-emerald-500/10 to-transparent" />
                          <div className="absolute inset-0 rounded-xl border border-eco-500/20" />
                          <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-eco-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                          <div className="absolute inset-y-2 left-0 w-[2px] rounded-full bg-gradient-to-b from-eco-400 to-emerald-500" />
                        </motion.div>
                      )}

                      {/* Icon */}
                      <span className={`relative z-10 transition-all duration-200 ${
                        active
                          ? 'text-eco-400'
                          : 'text-gray-500 group-hover:text-gray-300'
                      }`}>
                        {link.icon}
                      </span>

                      {/* Label */}
                      {!collapsed && (
                        <span className={`relative z-10 transition-all duration-200 ${
                          active
                            ? 'text-white font-semibold'
                            : 'text-gray-400 group-hover:text-gray-200'
                        }`}>
                          {link.label}
                        </span>
                      )}

                      {/* Active dot */}
                      {active && !collapsed && (
                        <motion.div
                          layoutId="sidebar-dot"
                          className="ml-auto relative z-10 w-1.5 h-1.5 rounded-full bg-eco-400 shadow-[0_0_6px_rgba(52,211,153,0.5)]"
                          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        />
                      )}

                      {/* Hover glow effect */}
                      {!active && (
                        <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 bg-white/[0.03] transition-opacity duration-200" />
                      )}
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        ))}
      </nav>

      {/* Bottom section */}
      <div className={`relative p-3 border-t border-white/[0.06] space-y-2 ${collapsed ? 'flex flex-col items-center' : ''}`}>
        {/* Glow orb */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-40 h-40 bg-gradient-to-b from-eco-500/5 to-transparent rounded-full blur-2xl pointer-events-none" />

        {/* Theme toggle */}
        <motion.button
          onClick={toggleTheme}
          className={`relative flex items-center ${collapsed ? 'justify-center' : 'gap-3'} w-full px-3 py-2.5 rounded-xl text-sm text-gray-500 hover:text-gray-300 hover:bg-white/[0.05] transition-all group`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.div
            key={isDark ? 'moon' : 'sun'}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {isDark ? <FiSun className="w-4 h-4" /> : <FiMoon className="w-4 h-4" />}
          </motion.div>
          {!collapsed && <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>}
          {!collapsed && (
            <motion.div
              className={`ml-auto w-8 h-4 rounded-full p-0.5 transition-colors ${isDark ? 'bg-eco-500/30' : 'bg-white/10'}`}
              layout
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            >
              <motion.div
                className={`w-3 h-3 rounded-full ${isDark ? 'bg-eco-400 ml-auto' : 'bg-gray-400'}`}
                layout
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </motion.div>
          )}
        </motion.button>

        {/* User section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {isAuthenticated ? (
            <div className={`flex ${collapsed ? 'flex-col items-center' : 'items-center justify-between'} gap-2 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.05]`}>
              {!collapsed && (
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-eco-400 to-emerald-500 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                      {user?.email?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <p className="text-xs font-medium text-gray-300 truncate">{user?.email?.split('@')[0] || 'User'}</p>
                  </div>
                </div>
              )}
              <motion.button
                onClick={async () => {
                  await signOut()
                  navigate('/')
                }}
                className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                title="Sign Out"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FiLogOut className="w-4 h-4" />
              </motion.button>
            </div>
          ) : (
            <Link
              to="/login"
              className={`relative flex items-center ${collapsed ? 'justify-center' : 'gap-3'} px-3 py-2.5 rounded-xl text-sm font-medium overflow-hidden group`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-eco-500 to-emerald-600 opacity-90 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <motion.span
                className="relative z-10 text-lg"
                whileHover={{ rotate: 10 }}
              >
                🔑
              </motion.span>
              {!collapsed && (
                <span className="relative z-10 text-white font-semibold">Sign In</span>
              )}
              {!collapsed && (
                <span className="relative z-10 ml-auto text-white/60 text-[10px] group-hover:text-white/80 transition-colors">
                  Get started →
                </span>
              )}
            </Link>
          )}
        </motion.div>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile hamburger - premium glass style */}
      <motion.button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 lg:hidden p-3 rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl border border-white/20 dark:border-white/5 shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] text-gray-600 dark:text-gray-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <FiMenu className="w-5 h-5" />
      </motion.button>

      {/* Mobile overlay backdrop */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
          >
            {/* Mobile sidebar panel */}
            <motion.div
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              className="absolute left-0 top-0 bottom-0 w-80 bg-gray-950 border-r border-white/[0.06] shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-end p-4">
                <motion.button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-xl text-gray-500 hover:text-gray-300 hover:bg-white/[0.06] transition-all"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FiX className="w-4 h-4" />
                </motion.button>
              </div>
              {sidebarContent}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop sidebar - premium glass sidebar */}
      <aside
        className={`hidden lg:fixed lg:flex lg:flex-col h-full bg-gray-950/80 backdrop-blur-2xl border-r border-white/[0.06] shadow-[4px_0_30px_rgba(0,0,0,0.3)] transition-all duration-300 z-30 ${
          collapsed ? 'w-[72px]' : 'w-64'
        }`}
        style={{ margin: 0, top: 0, left: 0, bottom: 0 }}
      >
        {sidebarContent}
      </aside>
    </>
  )
}
