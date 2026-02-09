import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';
import { AdminLogin } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { ServiceRequests } from './pages/ServiceRequests';
import { Escalations } from './pages/Escalations';
import { Disputes } from './pages/Disputes';
import { Cancellations } from './pages/Cancellations';
import { Users } from './pages/Users';
import { Drivers } from './pages/Drivers';
import { Vehicles } from './pages/Vehicles';
import { Analytics } from './pages/Analytics';
import { Rides } from './pages/Rides';
import { Settings } from './pages/Settings';
import { Finances } from './pages/Finances';
import { Applications } from './pages/Applications';

export function AdminRoutes() {
  return (
    <Routes>
      {/* Public route - login page */}
      <Route path="login" element={<AdminLogin />} />
      
      {/* Root /admin redirects to login */}
      <Route path="" element={<Navigate to="/admin/login" replace />} />
      
      {/* Protected routes - all require auth */}
      <Route
        path="*"
        element={
          <ProtectedRoute>
            <Layout>
              <Routes>
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="service-requests" element={<ServiceRequests />} />
                <Route path="service-requests/:id" element={<ServiceRequests />} />
                <Route path="escalations" element={<Escalations />} />
                <Route path="escalations/:id" element={<Escalations />} />
                <Route path="disputes" element={<Disputes />} />
                <Route path="disputes/:id" element={<Disputes />} />
                <Route path="cancellations" element={<Cancellations />} />
                <Route path="users" element={<Users />} />
                <Route path="drivers" element={<Drivers />} />
                <Route path="vehicles" element={<Vehicles />} />
                <Route path="rides" element={<Rides />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="finances" element={<Finances />} />
                <Route path="applications" element={<Applications />} />
                <Route path="settings" element={<Settings />} />
                <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

