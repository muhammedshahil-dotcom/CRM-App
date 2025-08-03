import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CustomerList from './pages/CustomerList';
import { useAuth } from './context/AuthContext';

const App = () => {
  const { token, user } = useAuth();

  // Admin route: redirect non-admins to /dashboard
  const AdminRoute = ({ children }) => {
    if (!token) return <Login />;
    if (user?.role !== 'admin') return <Navigate to="/dashboard" replace />;
    return children;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={token ? <Dashboard /> : <Login />} />
        <Route
          path="/customers"
          element={
            <AdminRoute>
              <CustomerList />
            </AdminRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;