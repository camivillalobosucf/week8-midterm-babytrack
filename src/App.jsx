import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/layout/ProtectedRoute'
import Navbar from './components/layout/Navbar'
import LoginPage    from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import EntriesPage  from './pages/EntriesPage'
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
    </BrowserRouter>
  )
}

export default App
