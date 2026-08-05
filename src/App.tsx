import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PublicLayout from './routes/public/PublicLayout';
import Landing from './routes/public/Landing';
import Download from './routes/public/Download';
import Faq from './routes/public/Faq';
import Contact from './routes/public/Contact';
import Activate from './routes/public/Activate';
import Legal from './routes/public/Legal';
import Terms from './routes/public/Terms';
import Privacy from './routes/public/Privacy';
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
import MobileSign from './routes/app/MobileSign';
import Share from './routes/app/Share';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Landing />} />
            <Route path="/download" element={<Download />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/activate" element={<Activate />} />
            <Route path="/legal" element={<Legal />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
          </Route>

          <Route
            path="/admin/*"
            element={
              <AdminGate>
                <AdminApp />
              </AdminGate>
            }
          />

          <Route path="/app/login" element={<Login />} />
          <Route path="/app/mobile-sign/:sessionId" element={<MobileSign />} />
          <Route path="/app/share" element={<Share />} />
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
