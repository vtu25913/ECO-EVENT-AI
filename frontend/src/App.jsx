import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { AppProvider } from './context/AppContext.jsx'
import { AnalysisProvider } from './context/AnalysisContext.jsx'
import { SidebarProvider } from './context/SidebarContext.jsx'
import Layout from './components/layout/Layout.jsx'
import ProtectedRoute from './components/layout/ProtectedRoute.jsx'
import LoadingScreen from './components/common/LoadingScreen.jsx'

const Landing = lazy(() => import('./pages/Landing.jsx'))
const EventAnalyzer = lazy(() => import('./pages/EventAnalyzer.jsx'))
const Dashboard = lazy(() => import('./pages/Dashboard.jsx'))
const Advisor = lazy(() => import('./pages/Advisor.jsx'))
const Reports = lazy(() => import('./pages/Reports.jsx'))
const Leaderboard = lazy(() => import('./pages/Leaderboard.jsx'))
const SDGImpact = lazy(() => import('./pages/SDGImpact.jsx'))
const About = lazy(() => import('./pages/About.jsx'))
const Settings = lazy(() => import('./pages/Settings.jsx'))
const Login = lazy(() => import('./pages/Login.jsx'))
const Signup = lazy(() => import('./pages/Signup.jsx'))
const AuthCallback = lazy(() => import('./pages/AuthCallback.jsx'))

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <AppProvider>
            <AnalysisProvider>
              <SidebarProvider>
              <Suspense fallback={<LoadingScreen type="earth" message="Warming up EcoEvent AI..." />}>
                <Routes>
                  {/* Landing page (no layout) */}
                  <Route path="/" element={<Landing />} />

                  {/* Auth pages (no layout) */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/auth/callback" element={<AuthCallback />} />

                  {/* Main layout routes */}
                  <Route element={<Layout />}>
                    <Route path="/home" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/analyze" element={<EventAnalyzer />} />
                    <Route path="/dashboard" element={
                      <ProtectedRoute><Dashboard /></ProtectedRoute>
                    } />
                    <Route path="/advisor" element={<Advisor />} />
                    <Route path="/assistant" element={<Navigate to="/advisor" replace />} />
                    <Route path="/simulator" element={<Navigate to="/analyze" replace />} />
                    <Route path="/reports" element={
                      <ProtectedRoute><Reports /></ProtectedRoute>
                    } />
                    <Route path="/leaderboard" element={<Leaderboard />} />
                    <Route path="/sdg-impact" element={<SDGImpact />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/settings" element={<Settings />} />
                  </Route>
                </Routes>
              </Suspense>
              </SidebarProvider>
            </AnalysisProvider>
          </AppProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  )
}

export default App
