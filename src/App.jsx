import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { LanguageProvider, useLanguage } from './context/LanguageContext'
import { useProfile } from './hooks/useProfile'
import ProtectedRoute from './components/layout/ProtectedRoute'
import Navbar        from './components/layout/Navbar'
import LoginPage     from './pages/LoginPage'
import RegisterPage  from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import EntriesPage   from './pages/EntriesPage'
import DiaryPage     from './pages/DiaryPage'
import ProfilePage   from './pages/ProfilePage'

// Syncs language from Firestore profile → context (cross-device support)
function LanguageSync() {
  const { profile } = useProfile()
  const { language, setLanguage } = useLanguage()
  useEffect(() => {
    if (profile?.language && profile.language !== language) {
      setLanguage(profile.language)
    }
  }, [profile?.language]) // eslint-disable-line react-hooks/exhaustive-deps
  return null
}

function ProtectedLayout() {
  return (
    <ProtectedRoute>
      <div className="app-layout">
        <Navbar />
        <main className="app-content">
          <LanguageSync />
          <Outlet />
        </main>
      </div>
    </ProtectedRoute>
  )
}

function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <Routes>
            <Route path="/login"    element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route element={<ProtectedLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/entries"   element={<EntriesPage />} />
              <Route path="/feeding"   element={<Navigate to="/entries" replace />} />
              <Route path="/diaper"    element={<Navigate to="/entries" replace />} />
              <Route path="/sleep"     element={<Navigate to="/entries" replace />} />
              <Route path="/diary"     element={<DiaryPage />} />
              <Route path="/profile"   element={<ProfilePage />} />
            </Route>
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  )
}

export default App
