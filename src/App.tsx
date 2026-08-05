import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './routes/Landing';
import AdminApp from './routes/admin/AdminApp';
import AdminGate from './routes/admin/AdminGate';
import { AuthProvider } from './routes/app/AuthContext';
import ProtectedRoute from './routes/app/ProtectedRoute';
import AppShell from './routes/app/AppShell';
import Login from './routes/app/Login';
import Dashboard from './routes/app/Dashboard';
import Documents from './routes/app/Documents';
import Templates from './routes/app/Templates';
import Upload from './routes/app/Upload';
import Workspace from './routes/app/Workspace';
import SettingsPage from './routes/app/SettingsPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route
            path="/admin/*"
            element={
              <AdminGate>
                <AdminApp />
              </AdminGate>
            }
          />

          <Route path="/app/login" element={<Login />} />
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <AppShell />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="documents" element={<Documents />} />
            <Route path="templates" element={<Templates />} />
            <Route path="upload" element={<Upload />} />
            <Route path="workspace/:docId" element={<Workspace />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
