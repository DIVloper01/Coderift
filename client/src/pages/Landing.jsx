import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Code2, Trophy, Zap, Users, ArrowRight, Terminal, Activity } from 'lucide-react';

const Landing = () => {
    return (
        <div className="min-h-screen relative overflow-x-hidden bg-rift-navy text-rift-teal selection:bg-rift-teal selection:text-rift-navy font-sans">
            {/* Animated background grid */}
            <div className="fixed inset-0 bg-grid-pattern opacity-10 animate-grid pointer-events-none z-0"></div>

            {/* Floating ambient glows */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <motion.div
                    className="absolute top-[-10%] left-[-10%] w-[30rem] h-[30rem] md:w-[40rem] md:h-[40rem] bg-rift-teal/10 rounded-full blur-[100px]"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.1, 0.2, 0.1],
                    }}
                    transition={{ duration: 10, repeat: Infinity }}
                />
                <motion.div
                    className="absolute bottom-[-10%] right-[-10%] w-[30rem] h-[30rem] md:w-[40rem] md:h-[40rem] bg-rift-violet/10 rounded-full blur-[100px]"
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.1, 0.2, 0.1],
                    }}
                    transition={{ duration: 12, repeat: Infinity, delay: 2 }}
                />
            </div>

            {/* Navbar - Fixed & Blurred */}
            <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-rift-navy/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="relative">
                            <div className="absolute inset-0 bg-rift-teal/50 blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <Code2 className="w-8 h-8 text-rift-teal relative z-10" />
                        </div>
                        <span className="text-2xl font-bold font-display tracking-widest text-white">
                            CODE<span className="text-rift-teal">RIFT</span>
                        </span>
                    </Link>
                    <div className="flex gap-6 items-center">
                        <Link to="/login" className="text-sm font-mono text-gray-400 hover:text-white transition-colors tracking-wider hidden md:block">
                            // LOGIN_TERMINAL
                        </Link>
                        <Link to="/register">
                            <button className="px-6 py-2.5 bg-[#00F5D4]/10 text-[#00F5D4] font-display tracking-wider font-semibold rounded-sm border border-[#00F5D4]/50 hover:bg-[#00F5D4] hover:text-[#0A0E1A] transition-all duration-300 relative overflow-hidden text-sm uppercase">
                                INITIALIZE_SEQUENCE
                            </button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20 md:pt-48 md:pb-32 flex flex-col items-center text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="max-w-4xl mx-auto"
                >
                    <div className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 border border-rift-teal/20 rounded-full bg-rift-teal/5 backdrop-blur-sm">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-rift-teal font-mono text-xs tracking-widest">SYSTEM_STATUS: ONLINE</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold font-display mb-8 leading-tight text-white tracking-tight">
                        COMPETE. CODE.<br />
                        <span className="bg-gradient-to-r from-rift-teal to-rift-violet bg-clip-text text-transparent">CONQUER.</span>
                    </h1>

                    <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
                        Enter the Rift. The ultimate competitive coding battleground.
                        Real-time execution, live HUD leaderboards, and a global ranking system.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full">
                        <Link to="/register" className="w-full sm:w-auto block">
                            <button className="w-full sm:w-auto px-8 py-4 bg-[#00F5D4]/20 text-[#00F5D4] font-display tracking-wider font-semibold rounded-sm border border-[#00F5D4]/50 hover:bg-[#00F5D4] hover:text-[#0A0E1A] transition-all duration-300 flex items-center justify-center gap-2 group text-lg uppercase">
                                ENTER_RIFT <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </Link>
                        <Link to="/contests" className="w-full sm:w-auto block">
                            <button className="w-full sm:w-auto px-8 py-4 bg-[#7B2FBE]/20 text-[#7B2FBE] font-display tracking-wider font-semibold rounded-sm border border-[#7B2FBE]/50 hover:bg-[#7B2FBE] hover:text-white transition-all duration-300 flex items-center justify-center gap-2 text-lg uppercase">
                                <Terminal className="w-5 h-5" /> VIEW_CONTESTS
                            </button>
                        </Link>
                    </div>
                </motion.div>

                {/* Stats HUD */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="w-full mt-24"
                >
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 border-y border-white/5 py-8 bg-black/20 backdrop-blur-sm">
                        <StatItem label="ACTIVE_USERS" value="1,248" color="text-white" subColor="text-rift-teal" />
                        <StatItem label="SUBMISSIONS" value="84.5K" color="text-white" subColor="text-rift-violet" />
                        <StatItem label="EXECUTION_RATE" value="0.4s" color="text-white" subColor="text-rift-teal" />
                        <StatItem label="SERVER_UPTIME" value="99.9%" color="text-white" subColor="text-rift-violet" />
                    </div>
                </motion.div>

                {/* Features */}
                <div className="grid md:grid-cols-3 gap-6 md:gap-8 mt-24 text-left">
                    <FeatureCard
                        icon={<Zap className="w-8 h-8 text-rift-teal" />}
                        title="INSTANT_JUDGING"
                        description="High-performance execution engine. Get verdicts in milliseconds with detailed runtime analysis."
                    />
                    <FeatureCard
                        icon={<Trophy className="w-8 h-8 text-rift-violet" />}
                        title="LIVE_RANKINGS"
                        description="Dynamic glassmorphism leaderboards that pulse in real-time as competitors submit solutions."
                    />
                    <FeatureCard
                        icon={<Activity className="w-8 h-8 text-rift-teal" />}
                        title="GLOBAL_LEAGUES"
                        description="Climb the tiers from Novice to Grandmaster. Seasonal rewards and profile badges."
                    />
                </div>
            </div>

            {/* Footer mockup */}
            <footer className="border-t border-white/5 bg-black/40 py-12 text-center text-gray-500 text-sm font-mono">
                <p>&copy; 2024 CODERIFT SYSTEMS. ALL RIGHTS RESERVED.</p>
            </footer>
        </div>
    );
};

const StatItem = ({ label, value, color, subColor }) => (
    <div className="text-center group cursor-default">
        <div className={`text-3xl md:text-5xl font-bold font-display ${color} mb-2 group-hover:scale-105 transition-transform duration-300`}>{value}</div>
        <div className={`text-xs md:text-sm font-mono tracking-[0.2em] ${subColor} opacity-80`}>{label}</div>
    </div>
);

const FeatureCard = ({ icon, title, description }) => {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="glass p-8 rounded-sm border border-white/5 hover:border-rift-teal/30 transition-colors group relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                {icon}
            </div>
            <div className="mb-6 relative z-10">
                <div className="w-14 h-14 rounded-sm bg-white/5 flex items-center justify-center group-hover:bg-rift-teal/10 transition-colors border border-white/10 group-hover:border-rift-teal/30">
                    {icon}
                </div>
            </div>
            <h3 className="text-xl font-bold font-display mb-3 text-white group-hover:text-rift-teal transition-colors tracking-wide">{title}</h3>
            <p className="text-gray-400 font-sans leading-relaxed text-sm">{description}</p>
        </motion.div>
    );
};

export default Landing;
