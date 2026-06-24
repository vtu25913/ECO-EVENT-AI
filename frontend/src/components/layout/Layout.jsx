import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar.jsx'
import Footer from './Footer.jsx'
import AIChatWidget from '../chat/AIChatWidget.jsx'
import { useSidebar } from '../../context/SidebarContext.jsx'
import { useApp } from '../../context/AppContext.jsx'

export default function Layout() {
  const { sidebarCollapsed, setSidebarCollapsed } = useSidebar()
  const { backendOnline } = useApp()
  const location = useLocation()
  const showFooter = location.pathname === '/about'

  return (
    <div className="min-h-screen relative bg-[url('https://www.twi-global.com/image-library/hero/sustainability-istock-473558826.jpg')] bg-cover bg-center bg-fixed flex">
      {/* Gradient overlay for readability */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-50/85 via-white/80 to-eco-50/85 dark:from-gray-950/88 dark:via-gray-900/85 dark:to-eco-950/88 pointer-events-none" />

      <Sidebar collapsed={sidebarCollapsed} onCollapsedChange={setSidebarCollapsed} />
      
      {/* Main content area - offset by sidebar width with transition */}
      <div className={`relative flex-1 flex flex-col min-h-screen transition-all duration-300 z-10 ${sidebarCollapsed ? 'lg:ml-[72px]' : 'lg:ml-64'}`}>

        {/* Backend offline banner */}
        {backendOnline === false && (
          <div className="sticky top-0 z-20 bg-amber-500/90 backdrop-blur-sm text-white text-xs font-medium text-center py-2 px-4 flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>{' '}
            Backend offline — working in local mode. Start the backend server on port 3001 to sync with Supabase.
          </div>
        )}

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 lg:py-8 pt-20 lg:pt-8">
          <Outlet />
        </main>
        {showFooter && <Footer />}
      </div>
      <AIChatWidget />
    </div>
  )
}
