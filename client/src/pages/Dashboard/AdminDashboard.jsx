import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Shield, Activity, Calendar, Clock, AlertTriangle, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [showContestForm, setShowContestForm] = useState(false);
    const [contestData, setContestData] = useState({
        title: '',
        description: '',
        startTime: '',
        endTime: '',
        duration: 120,
        penaltyTime: 10,
    });

    const handleCreateContest = async (e) => {
        e.preventDefault();

        try {
            await api.post('/contests', {
                ...contestData,
                settings: {
                    duration: parseInt(contestData.duration),
                    penaltyTime: parseInt(contestData.penaltyTime),
                },
            });

            toast.success('DASHBOARD_UPDATE: Contest initialized successfully.');
            setShowContestForm(false);
            setContestData({
                title: '',
                description: '',
                startTime: '',
                endTime: '',
                duration: 120,
                penaltyTime: 10,
            });
        } catch (error) {
            toast.error('SYSTEM_ERROR: ' + (error.response?.data?.message || 'Failed to create contest'));
        }
    };

    return (
        <div className="min-h-screen bg-rift-navy text-gray-300 bg-grid-pattern selection:bg-rift-teal selection:text-rift-navy">
            <nav className="glass border-b border-white/5 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <button onClick={() => navigate('/contests')} className="flex items-center gap-2 text-rift-teal hover:text-white transition-colors font-mono text-sm group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> BACK_TO_HUB
                    </button>
                    <div className="flex items-center gap-2 text-xs font-mono text-gray-500">
                        <Shield className="w-4 h-4 text-rift-violet" />
                        SYSTEM_ADMIN_ACCESS_GRANTED
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-bold font-display text-white mb-2 tracking-wide">COMMAND <span className="text-rift-violet">CENTER</span></h1>
                        <p className="text-gray-500 font-mono text-sm">MANAGE_OPERATIONS_AND_DEPLOYMENTS</p>
                    </div>
                    <button
                        onClick={() => setShowContestForm(!showContestForm)}
                        className="px-6 py-3 bg-[#00F5D4]/20 text-[#00F5D4] font-display tracking-wider font-semibold rounded-sm border border-[#00F5D4]/50 hover:bg-[#00F5D4] hover:text-[#0A0E1A] transition-all duration-300 flex items-center gap-2 group"
                    >
                        <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" /> <span className="tracking-widest">INIT_CONTEST</span>
                    </button>
                </div>

                {showContestForm && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="glass-strong border border-rift-violet/30 p-8 mb-8 rounded-sm relative overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rift-violet to-transparent"></div>
                        <h2 className="text-xl font-display text-white mb-6 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-rift-teal" /> CONTEST_PARAMETERS
                        </h2>

                        <form onSubmit={handleCreateContest} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <label className="text-xs font-mono text-rift-teal uppercase">Operation Name</label>
                                    <input
                                        type="text"
                                        value={contestData.title}
                                        onChange={(e) => setContestData({ ...contestData, title: e.target.value })}
                                        className="w-full bg-black/40 border border-white/10 rounded-sm py-2 px-4 text-gray-300 focus:outline-none focus:border-rift-violet/50 focus:bg-black/60 transition-all font-mono text-sm"
                                        placeholder="enter_mission_title"
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-mono text-rift-teal uppercase">Mission Brief</label>
                                    <input
                                        type="text"
                                        value={contestData.description}
                                        onChange={(e) => setContestData({ ...contestData, description: e.target.value })}
                                        className="w-full bg-black/40 border border-white/10 rounded-sm py-2 px-4 text-gray-300 focus:outline-none focus:border-rift-violet/50 focus:bg-black/60 transition-all font-mono text-sm"
                                        placeholder="enter_brief_description"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <label className="text-xs font-mono text-rift-teal uppercase flex items-center gap-2"><Calendar className="w-3 h-3" /> Start Sequence</label>
                                    <input
                                        type="datetime-local"
                                        value={contestData.startTime}
                                        onChange={(e) => setContestData({ ...contestData, startTime: e.target.value })}
                                        className="w-full bg-black/40 border border-white/10 rounded-sm py-2 px-4 text-gray-300 focus:outline-none focus:border-rift-violet/50 focus:bg-black/60 transition-all font-mono text-sm"
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-mono text-rift-teal uppercase flex items-center gap-2"><Calendar className="w-3 h-3" /> End Sequence</label>
                                    <input
                                        type="datetime-local"
                                        value={contestData.endTime}
                                        onChange={(e) => setContestData({ ...contestData, endTime: e.target.value })}
                                        className="w-full bg-black/40 border border-white/10 rounded-sm py-2 px-4 text-gray-300 focus:outline-none focus:border-rift-violet/50 focus:bg-black/60 transition-all font-mono text-sm"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <label className="text-xs font-mono text-rift-teal uppercase flex items-center gap-2"><Clock className="w-3 h-3" /> Duration (MIN)</label>
                                    <input
                                        type="number"
                                        value={contestData.duration}
                                        onChange={(e) => setContestData({ ...contestData, duration: e.target.value })}
                                        className="w-full bg-black/40 border border-white/10 rounded-sm py-2 px-4 text-gray-300 focus:outline-none focus:border-rift-violet/50 focus:bg-black/60 transition-all font-mono text-sm"
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-mono text-rift-teal uppercase flex items-center gap-2"><AlertTriangle className="w-3 h-3" /> Penalty (MIN)</label>
                                    <input
                                        type="number"
                                        value={contestData.penaltyTime}
                                        onChange={(e) => setContestData({ ...contestData, penaltyTime: e.target.value })}
                                        className="w-full bg-black/40 border border-white/10 rounded-sm py-2 px-4 text-gray-300 focus:outline-none focus:border-rift-violet/50 focus:bg-black/60 transition-all font-mono text-sm"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button type="submit" className="btn-rift-primary flex items-center gap-2">
                                    <Save className="w-4 h-4" /> INITIATE_DEPLOYMENT
                                </button>
                                <button type="button" onClick={() => setShowContestForm(false)} className="px-6 py-2 border border-white/10 hover:bg-white/5 text-gray-400 hover:text-white rounded-sm font-mono text-sm transition-colors flex items-center gap-2">
                                    <X className="w-4 h-4" /> ABORT
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}

                <div className="grid md:grid-cols-3 gap-6">
                    <div className="glass border border-white/5 p-6 rounded-sm hover:border-rift-violet/30 transition-colors group">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-rift-violet/10 rounded-sm text-rift-violet group-hover:bg-rift-violet/20 transition-colors">
                                <Activity className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-display text-white">SYSTEM_STATUS</h3>
                                <p className="text-xs font-mono text-green-400">ONLINE_NOMINAL</p>
                            </div>
                        </div>
                        <p className="text-gray-500 text-sm">All systems functioning within normal parameters. No intrusions detected.</p>
                    </div>

                    <div className="glass border border-white/5 p-6 rounded-sm hover:border-rift-teal/30 transition-colors group">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-rift-teal/10 rounded-sm text-rift-teal group-hover:bg-rift-teal/20 transition-colors">
                                <Shield className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-display text-white">USER_DB</h3>
                                <p className="text-xs font-mono text-rift-teal">SECURE_ENCRYPTED</p>
                            </div>
                        </div>
                        <p className="text-gray-500 text-sm">Manage operative permissions and access levels through the legacy console.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
