import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../App';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login page with the current path as the redirect target
    return (
      <Navigate 
        to={`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`} 
        replace
      />
    );
  }
  return children;
};

export default ProtectedRoute;