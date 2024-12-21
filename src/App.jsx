import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth, AuthProvider } from "./AuthContext";
import ProtectedRoute from "./ProtectedRoute";
import "./index.css";
import "./App.css";
import SignIn from "./pages/SignIn";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import SignUp from "./pages/SignUp";
import TopNav from "./components/TopNav";
import Clients from "./pages/Clients";
import { UserProvider } from "./UserContext";
import ClientData from "./pages/ClientData";

function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <Router>
          <AppLayout />
        </Router>
      </UserProvider>
    </AuthProvider>
  );
}

function AppLayout() {
  const { isAuthenticated } = useAuth();

  return (
    <div>
      {/* Render TopNav only if user is authenticated */}
      {isAuthenticated && <TopNav />}

      {/* Main Content */}
      <div style={{ flex: 1 }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/clients"
            element={
              <ProtectedRoute>
                <Clients />
              </ProtectedRoute>
            }
          />

          <Route
            path="/clients/:id"
            element={
              <ProtectedRoute>
                <ClientData />
              </ProtectedRoute>
            }
          />

          {/* Redirect unknown routes */}
          <Route path="*" element={<Navigate to="/signin" />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
