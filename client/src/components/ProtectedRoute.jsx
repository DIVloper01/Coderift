import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
    const { isAuthenticated, user } = useSelector((state) => state.auth);

    if (!isAuthenticated) {
        // Relaxed for development/demo purposes as requested
        // return <Navigate to="/login" replace />;
        console.warn('ProtectedRoute: Allow access without authentication (Dev Mode)');
    }

    if (requireAdmin && user?.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
