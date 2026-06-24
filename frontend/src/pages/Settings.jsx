import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Card from '../components/common/Card.jsx'
import Button from '../components/common/Button.jsx'
import { useTheme } from '../context/ThemeContext.jsx'
import { useApp } from '../context/AppContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { getPreferences, savePreferences } from '../utils/storage.js'
import { seedSampleDataToCloud } from '../services/apiService.js'
import { FiSun, FiMoon, FiTrash2, FiBell, FiGlobe, FiDownload, FiDatabase, FiCloud } from 'react-icons/fi'

export default function Settings() {
  const { isDark, toggleTheme } = useTheme()
  const { analyses, deleteAnalysis, refreshData } = useApp()
  const { user, isAuthenticated, session } = useAuth()
  const [prefs, setPrefs] = useState(getPreferences)
  const [seeding, setSeeding] = useState(false)
  const [seedMessage, setSeedMessage] = useState('')

  const hasSupabase = !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_URL !== 'https://placeholder.supabase.co')

  const [notifications, setNotifications] = useState(prefs.notifications !== false)
  const [autoSave, setAutoSave] = useState(prefs.autoSave !== false)
  const [unitSystem, setUnitSystem] = useState(prefs.unitSystem || 'metric')

  useEffect(() => {
    savePreferences({ notifications, autoSave, unitSystem })
  }, [notifications, autoSave, unitSystem])

  const handleExportData = () => {
    const data = JSON.stringify(analyses, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `eco-event-data-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleClearAll = () => {
    if (confirm('Delete all analyses and data? This cannot be undone.')) {
      analyses.forEach((a) => deleteAnalysis(a.id))
      localStorage.clear()
      window.location.reload()
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            <span className="bg-gradient-to-r from-eco-500 to-emerald-500 bg-clip-text text-transparent">
              Settings
            </span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Customize your EcoEvent AI experience.
          </p>
        </div>

        <div className="space-y-6">
          {/* Theme */}
          <Card>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white">
                  {isDark ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Theme</h3>
                  <p className="text-sm text-gray-500">{isDark ? 'Dark Mode' : 'Light Mode'}</p>
                </div>
              </div>
              <button
                onClick={toggleTheme}
                className={`relative w-14 h-7 rounded-full transition-colors ${isDark ? 'bg-eco-500' : 'bg-gray-300'}`}
              >
                <motion.div
                  animate={{ x: isDark ? 28 : 2 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-md"
                />
              </button>
            </div>
          </Card>

          {/* Preferences */}
          <Card>
            <h3 className="font-bold text-gray-900 dark:text-white mb-6">⚙️ Preferences</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FiBell className="w-5 h-5 text-gray-400" />
                  <div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Notifications</span>
                    <p className="text-xs text-gray-500">Show update notifications</p>
                  </div>
                </div>
                <button
                  onClick={() => setNotifications(!notifications)}
                  className={`w-12 h-6 rounded-full transition-colors ${notifications ? 'bg-eco-500' : 'bg-gray-300'}`}
                >
                  <motion.div
                    animate={{ x: notifications ? 24 : 2 }}
                    className="w-5 h-5 bg-white rounded-full shadow-sm"
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FiGlobe className="w-5 h-5 text-gray-400" />
                  <div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Unit System</span>
                    <p className="text-xs text-gray-500">Metric or Imperial</p>
                  </div>
                </div>
                <select
                  value={unitSystem}
                  onChange={(e) => setUnitSystem(e.target.value)}
                  className="px-3 py-1.5 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-sm text-gray-900 dark:text-white"
                >
                  <option value="metric">Metric</option>
                  <option value="imperial">Imperial</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FiDownload className="w-5 h-5 text-gray-400" />
                  <div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Auto-save Analyses</span>
                    <p className="text-xs text-gray-500">Automatically save results</p>
                  </div>
                </div>
                <button
                  onClick={() => setAutoSave(!autoSave)}
                  className={`w-12 h-6 rounded-full transition-colors ${autoSave ? 'bg-eco-500' : 'bg-gray-300'}`}
                >
                  <motion.div
                    animate={{ x: autoSave ? 24 : 2 }}
                    className="w-5 h-5 bg-white rounded-full shadow-sm"
                  />
                </button>
              </div>
            </div>
          </Card>

          {/* Data */}
          <Card>
            <h3 className="font-bold text-gray-900 dark:text-white mb-6">💾 Data Management</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Export Data</span>
                  <p className="text-xs text-gray-500">Download all analyses as JSON</p>
                </div>
                <Button variant="secondary" size="sm" onClick={handleExportData}>
                  <FiDownload className="w-4 h-4" /> Export
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Stored Analyses</span>
                  <p className="text-xs text-gray-500">{analyses.length} analyses saved locally</p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-white/5 space-y-3">
                {hasSupabase && isAuthenticated ? (
                  <>
                    <Button variant="secondary" size="sm" onClick={async () => {
                      setSeeding(true)
                      setSeedMessage('')
                      try {
                        const data = await seedSampleDataToCloud(user.id, session?.access_token)
                        if (data.success) {
                          setSeedMessage(`✅ ${data.message}`)
                          await refreshData()
                        } else {
                          setSeedMessage('❌ Failed to seed data: ' + (data.error || 'Unknown error'))
                        }
                      } catch (err) {
                        setSeedMessage('❌ Failed to connect to backend. Make sure the server is running on port 3001.')
                      } finally {
                        setSeeding(false)
                      }
                    }} disabled={seeding}>
                      <FiCloud className="w-4 h-4" /> {seeding ? 'Seeding...' : 'Load Sample Data to Cloud'}
                    </Button>
                    <p className="text-xs text-gray-400">Populates 12 sample events into your Supabase account.</p>
                    {seedMessage && (
                      <p className={`text-xs ${seedMessage.startsWith('✅') ? 'text-eco-500' : 'text-red-400'}`}>
                        {seedMessage}
                      </p>
                    )}
                  </>
                ) : (
                  <>
                    <Button variant="secondary" size="sm" onClick={async () => {
                      const { seedSampleData } = await import('../utils/seedData.js')
                      if (seedSampleData()) window.location.reload()
                    }}>
                      <FiDatabase className="w-4 h-4" /> Load Sample Data (Local)
                    </Button>
                    <p className="text-xs text-gray-400">Populates 12 sample event analyses locally (not synced to cloud).</p>
                  </>
                )}
                <div className="pt-3 border-t border-gray-200 dark:border-white/5">
                  <Button variant="danger" size="sm" onClick={handleClearAll}>
                    <FiTrash2 className="w-4 h-4" /> Clear All Data
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* About */}
          <Card>
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">ℹ️ About</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Version</span>
                <span className="font-medium text-gray-900 dark:text-white">1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Framework</span>
                <span className="font-medium text-gray-900 dark:text-white">React + Vite</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">PWA</span>
                <span className="font-medium text-gray-900 dark:text-white">Installable</span>
              </div>
            </div>
          </Card>
        </div>
      </motion.div>
    </div>
  )
}
