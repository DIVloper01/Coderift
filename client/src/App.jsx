import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from './store/store';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ContestList from './pages/Contest/ContestList';
import ContestDetail from './pages/Contest/ContestDetail';
import ProblemSolve from './pages/Problem/ProblemSolve';
import AdminDashboard from './pages/Dashboard/AdminDashboard';
import Profile from './pages/Profile/Profile';
import './styles/globals.css';

function App() {
    return (
        <Provider store={store}>
            <Router>
                <Toaster
                    position="bottom-center"
                    toastOptions={{
                        duration: 4000,
                        style: {
                            background: '#0B0F1E',
                            color: '#fff',
                            border: '1px solid rgba(0, 245, 212, 0.2)',
                            fontFamily: 'JetBrains Mono, monospace',
                            fontSize: '12px',
                        },
                        success: {
                            iconTheme: {
                                primary: '#00F5D4',
                                secondary: '#0A0E1A',
                            },
                        },
                        error: {
                            iconTheme: {
                                primary: '#ef4444',
                                secondary: '#0A0E1A',
                            },
                        },
                    }}
                />
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    <Route
                        path="/contests"
                        element={
                            <ProtectedRoute>
                                <ContestList />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/contest/:id"
                        element={
                            <ProtectedRoute>
                                <ContestDetail />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/problem/:id"
                        element={
                            <ProtectedRoute>
                                <ProblemSolve />
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
                        path="/admin"
                        element={
                            <ProtectedRoute requireAdmin>
                                <AdminDashboard />
                            </ProtectedRoute>
                        }
                    />

                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Router>
        </Provider>
    );
}

export default App;
