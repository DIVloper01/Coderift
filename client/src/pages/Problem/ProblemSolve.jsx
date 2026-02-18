import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Editor from '@monaco-editor/react';
import { ArrowLeft, Play, CheckCircle, XCircle, Clock, Terminal, ChevronRight, Save, Cpu } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

const ProblemSolve = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [problem, setProblem] = useState(null);
    const [code, setCode] = useState('// Write your code here\n');
    const [language, setLanguage] = useState('cpp');
    const [submitting, setSubmitting] = useState(false);
    const [submission, setSubmission] = useState(null);
    const [outputConsole, setOutputConsole] = useState(['> System Ready...']);

    const languageMap = {
        cpp: { label: 'C++ (GCC)', default: '// Write your C++ code here\n#include <iostream>\nusing namespace std;\n\nint main() {\n    return 0;\n}' },
        python: { label: 'Python 3', default: '# Write your Python code here\n' },
        java: { label: 'Java (OpenJDK)', default: '// Write your Java code here\npublic class Main {\n    public static void main(String[] args) {\n        \n    }\n}' },
        javascript: { label: 'Node.js', default: '// Write your JavaScript code here\n' },
    };

    useEffect(() => {
        fetchProblem();
    }, [id]);

    const fetchProblem = async () => {
        try {
            const response = await api.get(`/problems/${id}`);
            setProblem(response.data.data.problem);
        } catch (error) {
            toast.error('Failed to fetch problem data');
        }
    };

    const addToConsole = (msg) => {
        setOutputConsole(prev => [...prev, `> ${msg}`]);
    };

    const handleSubmit = async () => {
        if (!code.trim()) {
            toast.error('Source code empty');
            return;
        }

        setSubmitting(true);
        addToConsole('Initiating compilation sequence...');

        try {
            const response = await api.post('/submissions', {
                problemId: id,
                contestId: problem.contestId,
                code,
                language,
            });

            const submissionId = response.data.data.submissionId;
            addToConsole(`Submission ID: ${submissionId}`);
            addToConsole('Sending to Judge0 execution environmnt...');

            pollSubmissionResult(submissionId);
        } catch (error) {
            addToConsole(`ERROR: ${error.response?.data?.message || 'Submission failed'}`);
            setSubmitting(false);
        }
    };

    const pollSubmissionResult = async (submissionId) => {
        const maxAttempts = 20;
        let attempts = 0;

        const interval = setInterval(async () => {
            try {
                const response = await api.get(`/submissions/${submissionId}`);
                const sub = response.data.data.submission;

                if (sub.status === 'completed' || sub.status === 'error') {
                    clearInterval(interval);
                    setSubmission(sub);
                    setSubmitting(false);

                    addToConsole(`Execution completed in ${sub.executionTime?.toFixed(2)}ms`);
                    addToConsole(`Verdict: ${sub.verdict}`);

                    if (sub.verdict === 'Accepted') {
                        toast.success('VERDICT: ACCEPTED');
                    } else {
                        toast.error(`VERDICT: ${sub.verdict.toUpperCase()}`);
                    }
                } else {
                    if (attempts % 3 === 0) addToConsole('Processing...');
                }

                attempts++;
                if (attempts >= maxAttempts) {
                    clearInterval(interval);
                    setSubmitting(false);
                    addToConsole('TIMEOUT: Judge0 did not respond in time.');
                }
            } catch (error) {
                clearInterval(interval);
                setSubmitting(false);
            }
        }, 2000);
    };

    if (!problem) return <div className="min-h-screen flex items-center justify-center bg-rift-navy"><div className="spinner border-rift-teal"></div></div>;

    return (
        <div className="h-screen flex flex-col bg-rift-navy overflow-hidden">
            {/* Header */}
            <nav className="h-14 border-b border-white/5 flex items-center justify-between px-6 bg-[#0B0F1E]">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div className="w-px h-6 bg-white/10 mx-2"></div>
                    <h1 className="font-bold font-display text-lg text-white truncate max-w-md">{problem.title}</h1>
                    <span className="px-2 py-0.5 text-xs font-mono border border-rift-teal/30 text-rift-teal rounded-sm">{problem.difficulty.toUpperCase()}</span>
                </div>

                <div className="flex items-center gap-4">
                    {/* Language Selector */}
                    <div className="relative">
                        <select
                            value={language}
                            onChange={(e) => {
                                setLanguage(e.target.value);
                                setCode(languageMap[e.target.value].default);
                            }}
                            className="bg-black/30 border border-white/10 text-gray-300 text-sm rounded-sm px-3 py-1.5 focus:border-rift-teal focus:outline-none font-mono"
                        >
                            {Object.entries(languageMap).map(([key, { label }]) => (
                                <option key={key} value={key}>{label}</option>
                            ))}
                        </select>
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className={`flex items-center gap-2 px-6 py-1.5 font-bold font-display tracking-wide rounded-sm transition-all ${submitting
                                ? 'bg-rift-teal/10 text-rift-teal cursor-wait'
                                : 'bg-rift-teal text-rift-navy hover:bg-white hover:shadow-[0_0_15px_rgba(0,245,212,0.4)]'
                            }`}
                    >
                        {submitting ? <Cpu className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                        {submitting ? 'EXECUTING...' : 'RUN_CODE'}
                    </button>
                </div>
            </nav>

            {/* Main Split Pane */}
            <div className="flex-1 flex overflow-hidden">

                {/* Left: Problem Description */}
                <div className="w-[40%] flex flex-col border-r border-white/5 bg-[#0A0E1A]">
                    <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                        <div className="prose prose-invert max-w-none prose-headings:font-display prose-headings:text-white prose-p:text-gray-400 prose-code:text-rift-teal prose-code:bg-white/5 prose-code:px-1 prose-code:rounded-sm">
                            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                <Terminal className="w-6 h-6 text-rift-violet" /> Mission Brief
                            </h2>
                            <p>{problem.description}</p>

                            <div className="my-6 p-4 bg-white/5 border border-white/5 rounded-sm">
                                <h3 className="text-lg font-bold mb-3 text-rift-teal">IO_SPECIFICATIONS</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <strong className="block text-xs font-mono text-gray-500 mb-1">INPUT</strong>
                                        <p className="text-sm font-mono">{problem.inputFormat}</p>
                                    </div>
                                    <div>
                                        <strong className="block text-xs font-mono text-gray-500 mb-1">OUTPUT</strong>
                                        <p className="text-sm font-mono">{problem.outputFormat}</p>
                                    </div>
                                </div>
                            </div>

                            <h3>Constraints</h3>
                            <p className="font-mono text-sm">{problem.constraints}</p>

                            {problem.sampleTestCases?.length > 0 && (
                                <div className="mt-8 space-y-4">
                                    <h3 className="text-white">Sample Cases</h3>
                                    {problem.sampleTestCases.map((tc, idx) => (
                                        <div key={idx} className="bg-black/30 border border-white/10 rounded-sm overflow-hidden">
                                            <div className="bg-white/5 px-4 py-2 text-xs font-mono text-gray-500 border-b border-white/5">CASE_{idx + 1}</div>
                                            <div className="p-4 grid grid-cols-2 gap-4">
                                                <div>
                                                    <div className="text-[10px] text-gray-600 mb-1">INPUT</div>
                                                    <pre className="text-sm text-gray-300 font-mono">{tc.input}</pre>
                                                </div>
                                                <div>
                                                    <div className="text-[10px] text-gray-600 mb-1">EXPECTED_OUTPUT</div>
                                                    <pre className="text-sm text-rift-teal font-mono">{tc.expectedOutput}</pre>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right: Code & Terminal */}
                <div className="w-[60%] flex flex-col bg-[#060810]">
                    {/* Monaco Editor */}
                    <div className="flex-1 relative">
                        <Editor
                            height="100%"
                            language={language === 'cpp' ? 'cpp' : language}
                            value={code}
                            onChange={(value) => setCode(value || '')}
                            theme="vs-dark"
                            options={{
                                fontSize: 14,
                                fontFamily: '"JetBrains Mono", monospace',
                                minimap: { enabled: false },
                                scrollBeyondLastLine: false,
                                cursorBlinking: 'smooth',
                                smoothScrolling: true,
                                padding: { top: 20 },
                                lineNumbersMinChars: 4,
                                renderLineHighlight: 'line',
                                contextmenu: false,
                            }}
                        />
                    </div>

                    {/* Terminal Output */}
                    <div className="h-64 bg-black border-t border-rift-teal/20 flex flex-col">
                        <div className="px-4 py-2 bg-white/5 border-b border-white/5 flex items-center justify-between">
                            <span className="text-xs font-mono text-gray-400 flex items-center gap-2">
                                <Terminal className="w-3 h-3" /> CONSOLE_OUTPUT
                            </span>
                            {submission && (
                                <span className={`text-xs font-mono px-2 py-0.5 rounded-sm ${submission.verdict === 'Accepted' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                                    }`}>
                                    VERDICT: {submission.verdict.toUpperCase()}
                                </span>
                            )}
                        </div>
                        <div className="flex-1 p-4 overflow-y-auto font-mono text-sm space-y-1 custom-scrollbar">
                            {outputConsole.map((line, idx) => (
                                <div key={idx} className={`${line.includes('ERROR') || line.includes('❌') ? 'text-red-400' : line.includes('Accepted') ? 'text-green-400' : 'text-gray-400'}`}>
                                    {line}
                                </div>
                            ))}
                            <div className="w-2 h-4 bg-rift-teal animate-pulse inline-block align-middle ml-1"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProblemSolve;
