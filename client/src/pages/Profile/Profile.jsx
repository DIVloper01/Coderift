import { motion } from 'framer-motion';
import { User, Shield, Trophy, Activity, GitCommit, Award, Star, Cpu, CheckCircle } from 'lucide-react';
import { useSelector } from 'react-redux';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    // Mock data for UI demonstration
    const stats = {
        rank: 142,
        totalSolved: 45,
        winRate: '68%',
        currentStreak: 5
    };

    const badges = [
        { name: 'First Blood', icon: <Shield className="w-5 h-5" />, color: 'text-red-400 bg-red-500/10' },
        { name: 'Algorithmist', icon: <Cpu className="w-5 h-5" />, color: 'text-rift-teal bg-rift-teal/10' },
        { name: 'Night Owl', icon: <Star className="w-5 h-5" />, color: 'text-yellow-400 bg-yellow-500/10' },
    ];

    const recentMatches = [
        { id: 1, name: 'Weekly Sprint #42', rank: 12, score: 2400, change: '+15' },
        { id: 2, name: 'Global Challenge', rank: 45, score: 1850, change: '+8' },
        { id: 3, name: 'Night Coding', rank: 3, score: 3000, change: '+32' },
    ];

    return (
        <div className="min-h-screen bg-rift-navy text-gray-300 bg-grid-pattern">
            <nav className="glass border-b border-white/5 relative z-50">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <button onClick={() => navigate('/contests')} className="flex items-center gap-2 text-rift-teal hover:text-white transition-colors font-mono text-sm group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> BACK_TO_HUB
                    </button>
                </div>
            </nav>

            <div className="max-w-5xl mx-auto px-6 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid md:grid-cols-3 gap-8"
                >
                    {/* Left Column: Character Card */}
                    <div className="md:col-span-1">
                        <div className="glass-strong border border-rift-teal/20 p-8 text-center rounded-sm relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-b from-rift-teal/5 to-transparent opacity-50"></div>

                            <div className="relative z-10">
                                <div className="w-32 h-32 mx-auto rounded-full p-1 border-2 border-dashed border-rift-teal animate-slow-spin mb-6 relative">
                                    <div className="w-full h-full rounded-full bg-gradient-to-br from-rift-navy to-black flex items-center justify-center overflow-hidden border border-white/10">
                                        <span className="text-4xl font-bold font-display text-white">{user?.username?.charAt(0).toUpperCase()}</span>
                                    </div>
                                </div>

                                <h2 className="text-2xl font-bold font-display text-white mb-1">{user?.username}</h2>
                                <p className="text-rift-teal font-mono text-sm mb-6">{user?.role === 'admin' ? 'SYSTEM_ADMIN' : 'ELITE_OPERATIVE'}</p>

                                <div className="flex justify-center gap-2 mb-6">
                                    {badges.map((badge, i) => (
                                        <div key={i} className={`p-2 rounded-full border border-white/5 ${badge.color}`} title={badge.name}>
                                            {badge.icon}
                                        </div>
                                    ))}
                                </div>

                                <div className="text-left bg-black/40 p-4 rounded-sm border border-white/5 font-mono text-xs space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">UID</span>
                                        <span className="text-gray-300">{user?.id || '8472-AE3'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">JOINED</span>
                                        <span className="text-gray-300">2023.10.24</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">REGION</span>
                                        <span className="text-gray-300">GLOBAL_Server</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Stats & History */}
                    <div className="md:col-span-2 space-y-6">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <StatBox label="GLOBAL_RANK" value={`#${stats.rank}`} icon={<Trophy className="w-4 h-4 text-yellow-400" />} />
                            <StatBox label="SOLVED" value={stats.totalSolved} icon={<CheckCircle className="w-4 h-4 text-green-400" />} />
                            <StatBox label="WIN_RATE" value={stats.winRate} icon={<Activity className="w-4 h-4 text-rift-violet" />} />
                            <StatBox label="STREAK" value={stats.currentStreak} icon={<Award className="w-4 h-4 text-orange-400" />} />
                        </div>

                        {/* Recent Activity */}
                        <div className="glass border border-white/5 rounded-sm p-6">
                            <h3 className="font-display text-xl text-white mb-6 flex items-center gap-2">
                                <GitCommit className="w-5 h-5 text-rift-teal" /> MISSION_HISTORY
                            </h3>

                            <div className="space-y-4">
                                {recentMatches.map((match) => (
                                    <div key={match.id} className="flex items-center justify-between p-4 bg-white/5 border border-white/5 hover:border-rift-teal/30 transition-colors rounded-sm group">
                                        <div className="flex items-center gap-4">
                                            <div className="text-xs font-mono text-gray-500">#{match.id}</div>
                                            <div>
                                                <div className="text-gray-200 font-bold group-hover:text-rift-teal transition-colors">{match.name}</div>
                                                <div className="text-xs font-mono text-gray-500">RANK: {match.rank}</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-white font-mono">{match.score} PTS</div>
                                            <div className="text-xs font-mono text-green-400">{match.change} RP</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

const StatBox = ({ label, value, icon }) => (
    <div className="bg-[#0B0F1E] border border-white/10 p-4 rounded-sm hover:border-rift-teal/30 transition-colors">
        <div className="flex items-center gap-2 mb-2 text-gray-500 text-xs font-mono">
            {icon} {label}
        </div>
        <div className="text-2xl font-bold font-display text-white">{value}</div>
    </div>
);

export default Profile;
