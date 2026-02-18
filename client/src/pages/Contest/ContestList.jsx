import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, Users, Trophy, LogOut, Terminal, Activity, Search, Code2 } from 'lucide-react';
import api from '../../services/api';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/authSlice';

const ContestList = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const [contests, setContests] = useState([]);
    const [activeTab, setActiveTab] = useState('active');

    useEffect(() => {
        const fetchContests = async () => {
            try {
                const { data } = await api.get('/contests');
                setContests(data);
            } catch (error) {
                console.error('Failed to fetch contests:', error);
            }
        };
        fetchContests();
    }, []);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const filteredContests = contests.filter(c => c.status === activeTab);

    return (
        <div className="min-h-screen bg-rift-navy text-gray-300 font-sans selection:bg-rift-teal selection:text-rift-navy">
            {/* Navbar */}
            <nav className="sticky top-0 z-40 bg-rift-navy/80 backdrop-blur-md border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2 cursor-pointer group" onClick={() => navigate('/')}>
                        <Code2 className="w-6 h-6 text-rift-teal group-hover:scale-110 transition-transform" />
                        <span className="text-xl font-bold font-display tracking-widest text-white">
                            CODE<span className="text-rift-teal">RIFT</span>
                        </span>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="bg-black/40 border border-white/10 px-4 py-1.5 rounded-full flex items-center gap-2 hidden md:flex">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                            <span className="text-xs font-mono text-gray-400">OPERATIVE_ID: <span className="text-white">{user?.username}</span></span>
                        </div>
                        <button onClick={handleLogout} className="text-gray-400 hover:text-white transition-colors">
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold font-display text-white mb-2">MISSION CONTROL</h1>
                        <p className="text-gray-400 font-mono text-sm max-w-xl">
                            Select an active operation to begin. Competitions are ranked globally.
                            Ensure your neural link is stable before initializing.
                        </p>
                    </div>

                    <div className="bg-black/40 p-1 rounded-sm border border-white/10 flex">
                        {['active', 'upcoming', 'ended'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-2 rounded-sm text-sm font-mono tracking-wider transition-all ${activeTab === tab
                                    ? 'bg-rift-teal/20 text-rift-teal border border-rift-teal/50 shadow-[0_0_15px_rgba(0,245,212,0.15)]'
                                    : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                                    }`}
                            >
                                {tab.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid gap-6">
                    {filteredContests.length > 0 ? (
                        filteredContests.map((contest) => (
                            <motion.div
                                key={contest._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="glass group hover:border-rift-teal/50 transition-all duration-300 rounded-sm overflow-hidden relative"
                            >
                                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-rift-teal to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
                                <div className="p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h2 className="text-2xl font-bold font-display text-white group-hover:text-rift-teal transition-colors">{contest.title}</h2>
                                            <span className={`px-3 py-0.5 rounded-full text-xs font-bold tracking-wider uppercase ${contest.status === 'active' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                                                contest.status === 'upcoming' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                                                    'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                                                }`}>
                                                {contest.status}
                                            </span>
                                        </div>
                                        <p className="text-gray-400 mb-6 font-light max-w-2xl">{contest.description}</p>

                                        <div className="flex flex-wrap gap-6 text-sm font-mono text-gray-500">
                                            <div className="flex items-center gap-2 bg-black/30 px-3 py-1.5 rounded-sm border border-white/5">
                                                <Calendar className="w-4 h-4 text-rift-violet" />
                                                <span>{new Date(contest.startTime).toLocaleString()}</span>
                                            </div>
                                            <div className="flex items-center gap-2 bg-black/30 px-3 py-1.5 rounded-sm border border-white/5">
                                                <Clock className="w-4 h-4 text-rift-teal" />
                                                <span>{contest.settings.duration} MIN</span>
                                            </div>
                                            <div className="flex items-center gap-2 bg-black/30 px-3 py-1.5 rounded-sm border border-white/5">
                                                <Users className="w-4 h-4 text-blue-400" />
                                                <span>{contest.participants?.length || 0} ENROLLED</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <button
                                            onClick={() => navigate(`/contest/${contest._id}`)}
                                            className="px-6 py-2 bg-[#00F5D4]/20 text-[#00F5D4] font-display tracking-wider font-semibold rounded-sm border border-[#00F5D4]/50 hover:bg-[#00F5D4] hover:text-[#0A0E1A] transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(0,245,212,0.2)]"
                                        >
                                            <span className="flex items-center gap-2">
                                                {contest.status === 'active' ? 'JOIN_OPERATION' : 'VIEW_INTEL'}
                                                <Terminal className="w-4 h-4" />
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="text-center py-20 border border-dashed border-white/10 rounded-sm">
                            <Activity className="w-12 h-12 text-gray-600 mx-auto mb-4 opacity-50" />
                            <h3 className="text-xl font-display text-gray-500">NO_OPERATIONS_FOUND</h3>
                            <p className="text-gray-600 font-mono text-sm mt-2">Systems are currently clear. Check back later.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ContestList;
