import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import RedirigirRelato from '@/components/RedirigirRelato';
// Add page imports here
import Home from '@/pages/Home';
import Relatos from '@/pages/Relatos';
import RelatoDetalle from '@/pages/RelatoDetalle';
import Preguntas from '@/pages/Preguntas';
import Servicios from '@/pages/Servicios';
import Contacto from '@/pages/Contacto';
import Legal from '@/pages/Legal';
import Admin from '@/pages/Admin';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-fondo">
        <div className="w-8 h-8 border-4 border-verde/20 border-t-turquesa rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/historias" element={<Relatos />} />
        <Route path="/historias/:slug" element={<RelatoDetalle />} />
        <Route path="/preguntas-frecuentes" element={<Preguntas />} />
        <Route path="/servicios" element={<Servicios />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/aviso-legal" element={<Legal tipo="aviso-legal" />} />
        <Route path="/privacidad" element={<Legal tipo="privacidad" />} />
        <Route path="/cookies" element={<Legal tipo="cookies" />} />
        <Route path="/relatos" element={<RedirigirRelato />} />
        <Route path="/relatos/:slug" element={<RedirigirRelato />} />
        <Route path="/preguntas" element={<Navigate to="/preguntas-frecuentes" replace />} />
        <Route
          element={
            <ProtectedRoute unauthenticatedElement={<Navigate to="/login" replace />} />
          }
        >
          <Route path="/admin" element={<Admin />} />
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

    </Routes>
  );
};

function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App