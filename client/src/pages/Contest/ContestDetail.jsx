import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Trophy, Clock, Users, Code, Lock, Unlock, Hash, AlertTriangle, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import socketService from '../../services/socket';

const ContestDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [contest, setContest] = useState(null);
    const [problems, setProblems] = useState([]);
    const [leaderboard, setLeaderboard] = useState([]);
    const [activeTab, setActiveTab] = useState('problems');

    useEffect(() => {
        fetchContest();
        fetchProblems();
        fetchLeaderboard();

        socketService.connect();
        socketService.joinContest(id);

        socketService.onLeaderboardUpdate((data) => {
            setLeaderboard(data.leaderboard);
        });

        return () => {
            socketService.leaveContest(id);
        };
    }, [id]);

    const fetchContest = async () => {
        try {
            const response = await api.get(`/contests/${id}`);
            setContest(response.data.data.contest);
        } catch (error) {
            toast.error('Failed to fetch contest data');
        }
    };

    const fetchProblems = async () => {
        try {
            const response = await api.get(`/problems/contest/${id}`);
            setProblems(response.data.data.problems);
        } catch (error) {
            // problem fetch error
        }
    };

    const fetchLeaderboard = async () => {
        try {
            const response = await api.get(`/submissions/leaderboard/${id}`);
            setLeaderboard(response.data.data.leaderboard);
        } catch (error) {
            // leaderboard fetch error
        }
    };

    const handleJoinContest = async () => {
        try {
            await api.post(`/contests/${id}/join`);
            toast.success('ACCESS_GRANTED: Welcome to the Rift');
            fetchContest();
        } catch (error) {
            toast.error('ACCESS_DENIED: ' + (error.response?.data?.message || 'Unknown Error'));
        }
    };

    const getDifficultyColor = (difficulty) => {
        const colors = {
            easy: 'text-green-400 border-green-500/20 bg-green-500/10',
            medium: 'text-amber-400 border-amber-500/20 bg-amber-500/10',
            hard: 'text-red-500 border-red-500/20 bg-red-500/10',
        };
        return colors[difficulty] || 'text-gray-400 border-gray-500/20';
    };

    if (!contest) return <div className="min-h-screen flex items-center justify-center bg-rift-navy"><div className="spinner border-rift-teal"></div></div>;

    return (
        <div className="min-h-screen bg-rift-navy text-gray-300">
            <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none fixed"></div>

            <nav className="glass border-b border-white/5 relative z-50">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <button onClick={() => navigate('/contests')} className="flex items-center gap-2 text-rift-teal hover:text-white transition-colors font-mono text-sm group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> ABORT / BACK_TO_LIST
                    </button>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-6 py-10 relative z-10">
                {/* Contest Header HUD */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-[#0B0F1E] border border-rift-teal/20 rounded-sm p-8 mb-8 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-20">
                        <Trophy className="w-32 h-32 text-rift-teal" />
                    </div>

                    <div className="flex flex-col md:flex-row items-start justify-between relative z-10 gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className={`px-2 py-0.5 text-[10px] font-mono border border-rift-teal/50 text-rift-teal tracking-widest`}>CLASSIFIED</span>
                                <span className="text-xs font-mono text-gray-500">ID: {contest._id.slice(-6).toUpperCase()}</span>
                            </div>
                            <h1 className="text-4xl font-bold font-display text-white mb-2 tracking-wide uppercase">{contest.title}</h1>
                            <p className="text-gray-400 max-w-2xl font-sans">{contest.description}</p>
                        </div>
                        {contest.status === 'live' && (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleJoinContest}
                                className="bg-[#00F5D4] text-[#0A0E1A] hover:bg-white hover:text-[#0A0E1A] font-bold px-8 py-4 font-display tracking-wider rounded-sm transition-all duration-300 shadow-[0_0_15px_rgba(0,245,212,0.4)] hover:shadow-[0_0_25px_rgba(255,255,255,0.4)]"
                            >
                                ENGAGE_PROTOCOL
                            </motion.button>
                        )}
                        {contest.status !== 'live' && (
                            <div className="px-6 py-3 border border-white/10 bg-white/5 rounded-sm font-mono text-gray-400">
                                STATUS: {contest.status.toUpperCase()}
                            </div>
                        )}
                    </div>

                    <div className="flex gap-8 mt-8 pt-6 border-t border-white/5 font-mono text-sm">
                        <div className="flex items-center gap-2 text-rift-teal">
                            <Clock className="w-4 h-4" />
                            <span>{contest.settings.duration} MIN</span>
                        </div>
                        <div className="flex items-center gap-2 text-rift-violet">
                            <Users className="w-4 h-4" />
                            <span>{contest.participants?.length || 0} OPERATIVES</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                            <AlertTriangle className="w-4 h-4" />
                            <span>PENALTY: +{contest.settings.penaltyTime}M</span>
                        </div>
                    </div>
                </motion.div>

                {/* Navigation Tabs */}
                <div className="flex gap-2 mb-6 border-b border-white/10">
                    <button
                        onClick={() => setActiveTab('problems')}
                        className={`px-6 py-3 font-mono text-sm tracking-wider transition-all border-b-2 ${activeTab === 'problems' ? 'border-rift-teal text-rift-teal bg-rift-teal/5' : 'border-transparent text-gray-500 hover:text-gray-300'
                            }`}
                    >
                        MISSION_OBJECTIVES ({problems.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('leaderboard')}
                        className={`px-6 py-3 font-mono text-sm tracking-wider transition-all border-b-2 ${activeTab === 'leaderboard' ? 'border-rift-violet text-rift-violet bg-rift-violet/5' : 'border-transparent text-gray-500 hover:text-gray-300'
                            }`}
                    >
                        LIVE_RANKINGS
                    </button>
                </div>

                {/* Content Area */}
                <AnimatePresence mode="wait">
                    {activeTab === 'problems' && (
                        <motion.div
                            key="problems"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="space-y-4"
                        >
                            <div className="grid gap-4">
                                {problems.map((problem, idx) => (
                                    <motion.div
                                        key={problem._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        onClick={() => navigate(`/problem/${problem._id}`)}
                                        className="group flex items-center justify-between p-6 bg-[#0B0F1E] border border-white/5 hover:border-rift-teal rounded-sm cursor-pointer transition-all duration-300 relative overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-rift-teal/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                        <div className="flex items-center gap-6 relative z-10">
                                            <div className="w-12 h-12 flex items-center justify-center bg-white/5 rounded-sm font-mono text-xl font-bold text-gray-500 group-hover:text-rift-teal transition-colors">
                                                {String.fromCharCode(65 + idx)}
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold font-display text-white group-hover:text-rift-teal transition-colors mb-1">{problem.title}</h3>
                                                <div className="flex items-center gap-3 text-xs font-mono">
                                                    <span className={`px-2 py-0.5 rounded-sm border ${getDifficultyColor(problem.difficulty)} uppercase`}>
                                                        {problem.difficulty}
                                                    </span>
                                                    <span className="text-gray-500">TAGS: {problem.tags.join(', ') || 'N/A'}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-6 relative z-10">
                                            <div className="text-right">
                                                <div className="text-xl font-bold font-display text-white">{problem.points}</div>
                                                <div className="text-[10px] text-gray-500 uppercase tracking-widest">Points</div>
                                            </div>
                                            <div className="w-10 h-10 flex items-center justify-center rounded-full border border-white/10 group-hover:bg-rift-teal group-hover:text-rift-navy group-hover:border-rift-teal transition-all">
                                                <Unlock className="w-4 h-4" />
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'leaderboard' && (
                        <motion.div
                            key="leaderboard"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="bg-[#0B0F1E] border border-white/5 rounded-sm overflow-hidden"
                        >
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-white/5 border-b border-white/10 text-xs font-mono text-gray-400 uppercase tracking-widest">
                                        <th className="p-4 pl-6">Rank</th>
                                        <th className="p-4">Operative</th>
                                        <th className="p-4 text-center">Solved</th>
                                        <th className="p-4 text-center">Score</th>
                                        <th className="p-4 text-center">Penalty</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {leaderboard.map((entry, index) => (
                                        <motion.tr
                                            key={entry._id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: index * 0.05 }}
                                            className={`border-b border-white/5 hover:bg-white/5 transition-colors ${index === 0 ? 'bg-yellow-500/5' :
                                                index === 1 ? 'bg-gray-400/5' :
                                                    index === 2 ? 'bg-orange-700/5' : ''
                                                }`}
                                        >
                                            <td className="p-4 pl-6 font-mono font-bold text-lg">
                                                <div className={`w-8 h-8 flex items-center justify-center rounded-full ${index < 3 ? 'ring-2 ring-rift-teal/50 animate-pulse text-white' : 'text-gray-500'
                                                    }`}>
                                                    {index + 1}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rift-violet to-purple-900 border border-white/20 flex items-center justify-center text-xs font-bold">
                                                        {entry.userId?.username?.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className="font-display tracking-wide text-white">{entry.userId?.username}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-center font-mono text-rift-teal">{entry.problemsSolved}</td>
                                            <td className="p-4 text-center font-bold font-display text-white">{entry.totalPoints}</td>
                                            <td className="p-4 text-center font-mono text-gray-500">{entry.penaltyTime}</td>
                                        </motion.tr>
                                    ))}
                                    {leaderboard.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="p-12 text-center text-gray-500 font-mono">
                                                AWAITING_DATA_STREAM...
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ContestDetail;
