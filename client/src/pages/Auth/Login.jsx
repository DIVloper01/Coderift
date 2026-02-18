import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { Mail, Lock, Code2, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { loginSuccess } from '../../features/authSlice';

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await api.post('/auth/login', formData);
            dispatch(loginSuccess(response.data.data));
            toast.success('ACCESS_GRANTED: Welcome back, Operative.');
            navigate('/contests');
        } catch (error) {
            toast.error('ACCESS_DENIED: ' + (error.response?.data?.message || 'Invalid Credentials'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-rift-navy selection:bg-rift-teal selection:text-rift-navy">
            {/* Animated background */}
            <div className="absolute inset-0 bg-grid-pattern opacity-20 animate-grid"></div>

            {/* Floating orbs */}
            <motion.div
                className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-rift-teal/20 rounded-full blur-[120px]"
                animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.3, 0.1] }}
                transition={{ duration: 10, repeat: Infinity }}
            />
            <motion.div
                className="absolute bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-rift-violet/20 rounded-full blur-[120px]"
                animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
                transition={{ duration: 12, repeat: Infinity }}
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="bg-[#0B0F1E]/80 backdrop-blur-xl border border-white/10 p-8 rounded-sm shadow-2xl relative overflow-hidden group">
                    {/* Edge Accents */}
                    <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-rift-teal"></div>
                    <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-rift-teal"></div>
                    <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-rift-teal"></div>
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-rift-teal"></div>

                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-sm bg-rift-teal/10 text-rift-teal mb-4 border border-rift-teal/20">
                            <Code2 className="w-6 h-6" />
                        </div>
                        <h1 className="text-3xl font-bold font-display text-white tracking-widest">
                            CODE<span className="text-rift-teal">RIFT</span>
                        </h1>
                        <p className="text-gray-500 font-mono text-sm mt-2">SECURE_LOGIN_TERMINAL</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-1">
                            <label className="text-xs font-mono text-rift-teal uppercase tracking-wider">Operative ID / Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-rift-teal transition-colors" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full bg-black/40 border border-white/10 rounded-sm py-2.5 pl-10 pr-4 text-gray-300 focus:outline-none focus:border-rift-teal/50 focus:bg-black/60 transition-all font-mono text-sm"
                                    placeholder="enter_email_address"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-mono text-rift-teal uppercase tracking-wider">Access Key</label>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-rift-teal transition-colors" />
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full bg-black/40 border border-white/10 rounded-sm py-2.5 pl-10 pr-4 text-gray-300 focus:outline-none focus:border-rift-teal/50 focus:bg-black/60 transition-all font-mono text-sm"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <motion.button
                            type="submit"
                            disabled={loading}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full px-6 py-3 bg-[#00F5D4]/20 text-[#00F5D4] font-display tracking-wider font-semibold rounded-sm border border-[#00F5D4]/50 hover:bg-[#00F5D4] hover:text-[#0A0E1A] transition-all duration-300 flex items-center justify-center gap-2 group"
                        >
                            {loading ? 'AUTHENTICATING...' : <><span className="tracking-widest">AUTHENTICATE</span> <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>}
                        </motion.button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-gray-500 text-sm font-sans">
                            New recruit?{' '}
                            <Link to="/register" className="text-rift-teal hover:text-white font-bold transition-colors">
                                INITIALIZE_REGISTRATION
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
