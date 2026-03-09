import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/layout/ProtectedRoute'
import Navbar from './components/layout/Navbar'
import LoginPage    from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import FeedingPage  from './pages/FeedingPage'
import DiaperPage   from './pages/DiaperPage'
import SleepPage    from './pages/SleepPage'
import DiaryPage    from './pages/DiaryPage'
import ProfilePage  from './pages/ProfilePage'

function ProtectedLayout() {
  return (
    <ProtectedRoute>
      <div className="app-layout">
        <Navbar />
        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </ProtectedRoute>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login"    element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route element={<ProtectedLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/feeding"   element={<FeedingPage />} />
            <Route path="/diaper"    element={<DiaperPage />} />
            <Route path="/sleep"     element={<SleepPage />} />
            <Route path="/diary"     element={<DiaryPage />} />
            <Route path="/profile"   element={<ProfilePage />} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
