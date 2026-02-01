'use client';

import { useEffect, useState, useCallback } from 'react';
import CodeEditor from '../../components/CodeEditor';
import ProblemSection from '../../components/ProblemSection';
import { Loader2, Play, Swords, Timer, ArrowRight, AlertTriangle, Trophy, XCircle } from 'lucide-react';
import axios from 'axios';
import SubmissionStatus from '../../components/SubmissionStatus';
import DetailedSubmission from '../../components/detailedSubmission';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { useSocket } from '../../store/index';
import { useBattleStore } from '../../store/battleStore';

const GameTimer = ({ startTime, duration , socket ,battleId}) => {
    const [timeLeft, setTimeLeft] = useState("00:00");

    useEffect(() => {
        if (!startTime || !duration) return;

        const endTime = new Date(startTime).getTime() + (duration * 60 * 1000);

        const interval = setInterval(() => {
            const now = Date.now();
            const diff = endTime - now;

            if (diff <= 0) {
                setTimeLeft("00:00");
                clearInterval(interval);
                alert('time Over');
                socket.send(JSON.stringify({msg:'TIME_OVER',data:battleId}));
                
            } else {
                const m = Math.floor(diff / 60000);
                const s = Math.floor((diff % 60000) / 1000);
                setTimeLeft(`${m}:${s < 10 ? '0' : ''}${s}`);
            }
        }, 1000);

 
        return () => clearInterval(interval);
    }, [startTime, duration]);

    return <span className="text-orange-500 font-mono font-bold text-sm">{timeLeft}</span>;
};

const BattleProgress = ({ label, problems, userProgress, align = 'left' }) => {
    return (
        <div className={`flex flex-col ${align === 'right' ? 'items-end' : 'items-start'} gap-1`}>
            <span className="text-[10px] font-bold text-orange-500/80 uppercase tracking-wider flex items-center gap-1">
                {label}
            </span>
            <div className="flex gap-1.5">
                {problems.map((probId, idx) => {
                    const status = userProgress?.[probId];
                    let style = "bg-zinc-900 border-zinc-800 text-zinc-600";

                    if (status === "SOLVED") {
                        style = "bg-green-500/20 border-green-500 text-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]";
                    } else if (status === "FAILED") {
                        style = "bg-red-500/20 border-red-500 text-red-500";
                    }

                    return (
                        <div key={idx} className={`w-6 h-6 rounded-md border flex items-center justify-center text-xs font-bold transition-all duration-500 ${style}`}>
                            {status === "SOLVED" ? "✓" : status === "FAILED" ? "✗" : idx + 1}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default function Page() {
    const { getToken, userId, isLoaded } = useAuth();
    const { problemID } = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    const { socket } = useSocket();
    const { problems, setProblems } = useBattleStore();

    const battleId = searchParams.get('battleId');
    const isBattleMode = !!battleId;

    const [roomUsers, setRoomUsers] = useState([]);
    const [languages, setLanguages] = useState([]);
    const [problemData, setProblemData] = useState({});
    const [allsubmissions, setSubmissions] = useState([]);
    const [disabled, setDisabled] = useState(false);
    const [theme, setTheme] = useState("vs-dark");
    const [fontSize, setFontSize] = useState(16);
    const [submissionTab, setSubmissionTab] = useState(false);
    const [selectedSubmissionId, setSelectedSubmissionId] = useState(null);
    const [selectedLang, setSelectedLang] = useState("javascript");
    const [selectedLangId, setSelectedLangId] = useState("");
    const [currcode, setCode] = useState('');
    const [submissionCodeValue, setSubmissionCode] = useState("");
    const [showLeaveModal, setShowLeaveModal] = useState(false);

    const myProfile = roomUsers.find(u => u.id === userId);
    const opponentProfile = roomUsers.find(u => u.id !== userId);
    const problemIds = problems.map(p => typeof p === 'string' ? p : p.id);
    const [gameOverData, setGameOverData] = useState(null);
    const [startTime, setStartTime] = useState();
    const [duration, setDuration] = useState();

    const handleLeaveClick = () => {
        setShowLeaveModal(true);
    };

    
    const confirmLeave = () => {
        if (socket) {
            socket.send(JSON.stringify({
                msg: "OPPONENT_LEAVING",
                roomId: battleId,
                userId: userId
            }));
        }
        setShowLeaveModal(false);
    };

    const handleNextProblem = () => {
        if (!problems || problems.length === 0) return;

        setSubmissionTab(false);
        setSelectedSubmissionId(null);

        let currentIndex = problems.findIndex(p => (typeof p === 'string' ? p : p.id) === problemID);

        let nextProblem;
        if (currentIndex !== -1 && currentIndex < problems.length - 1) {
            nextProblem = problems[currentIndex + 1];
        } else {
            nextProblem = problems[0];
        }

        const nextId = typeof nextProblem === 'string' ? nextProblem : nextProblem.id;
        router.push(`/problems/${nextId}?battleId=${battleId}`);
    };

    useEffect(() => {
        if (!isBattleMode) return;
        const handleBeforeUnload = (e) => {
            e.preventDefault();
            e.returnValue = '';
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [isBattleMode]);

    useEffect(() => {
        if (!isBattleMode || !socket || !userId) return;

        const handleBattleState = (event) => {
            const data = JSON.parse(event.data);

            switch (data.msg) {
                case "GAME_STARTED":
                    if (data.data.problems) {
                     
                        
                        setProblems(data.data.problems);
                        setStartTime(data.data.startTime);
                        console.log(data.data.durationMins);
                        setDuration(data.data.durationMins);
                    }
                    break;

                case "GAME_OVER_WINNER":
                    const winnerID = data.data.winner;
                    const isWinner = winnerID === userId;

                    setGameOverData({
                        isWinner,
                        message: isWinner ? "You Won! Opponent Forfeited." : "Opponent Won the Battle."
                    });
                    break;

                case "ROOM_CURRENT_STATUS":
                    if (data.data && Array.isArray(data.data)) {
                        setRoomUsers(data.data);
                        setDuration(data.duration);
                        setStartTime(data.startTime);
                        console.log(data , "CURRENT STATUS");
                        
                    }
                    break;

                case "SUBMISSION_ID":
                    setSubmissionTab(true);
                    if (data.submissionID) setSelectedSubmissionId(data.submissionID);
                    setDisabled(false);
                    break;
            }
        };

        const handleRejoin = () => {
            socket.send(JSON.stringify({
                msg: "JOIN",
                roomID: battleId,
                userID: userId
            }));
        };

        socket.addEventListener('message', handleBattleState);

        if (socket.readyState === WebSocket.OPEN) {
            handleRejoin();
        } else {
            socket.addEventListener('open', handleRejoin);
        }

        return () => {
            socket.removeEventListener('message', handleBattleState);
            socket.removeEventListener('open', handleRejoin);
        };
    }, [isBattleMode, socket, userId, battleId, setProblems, router]);

    useEffect(() => {
        if (!socket || socket.readyState !== WebSocket.OPEN) return;

        socket.send(JSON.stringify({
            msg: "ROOM_CURRENT_STATUS",
            roomID: battleId
        }));
    }, [problemID, battleId, socket]);

    useEffect(() => {
        const fetchData = async () => {
            try {
               
                
                const langRes = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}/language/all-languages`);
                setLanguages(langRes.data.data);

                const defaultLang = langRes.data.data.find((lang) => lang.name.toLowerCase() === "javascript");
                if (defaultLang) {
                    setSelectedLangId(defaultLang.id);
                } else if (langRes.data.data.length > 0) {
                    setSelectedLang("javascript");
                    setSelectedLangId(langRes.data.data[0].id);
                }

                const probRes = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}/problem/${problemID}`);
                setProblemData(probRes.data.res);
            } catch (err) {
                console.error("Initialization Error", err);
            }
        };
        if (problemID) fetchData();
    }, [problemID]);

    useEffect(() => {
        if (!problemData.slug || !selectedLang) return;
        const getBoilerPlateCode = async () => {
            let extension ;
            try {
                switch(selectedLang){
                    case "python":
                        extension="py"
                        break;

                    case "java":
                        extension="java"
                        break;
                        
                    case "cpp":
                        extension="cpp"
                        break;
                        
                    case "javascript":
                        extension="js"    
                        break;
                    default:
                        alert("Error Wrong Language")
                        break;    
                }
                const res = await axios.get(`https://raw.githubusercontent.com/Atulkhiyani0909/CodeGladiator/main/Code/apps/problems_directory/problems/${problemData.slug}/boilerplate/function.${extension}`);
              
               
                setSubmissionCode(res.data);
            } catch (err) {
                console.error("Error getting boilerplate", err);
            }
        }
        getBoilerPlateCode();
    }, [selectedLang, problemData]);

    const fetchSubmissionsList = useCallback(async () => {
        if (!userId || isBattleMode) return;
        try {
            const token = await getToken();
            const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}/submission/status/${problemID}`, { userId: userId }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.data) setSubmissions(res.data.data);
        } catch (e) { console.error("Fetch error", e); }
    }, [userId, problemID, getToken, isBattleMode]);

    useEffect(() => {
        fetchSubmissionsList();
        if (!isBattleMode) {
            const interval = setInterval(fetchSubmissionsList, 10000);
            return () => clearInterval(interval);
        }
    }, [fetchSubmissionsList, isBattleMode]);

    const handleLanguageChange = (e) => {
        const newName = e.target.value;
        setSelectedLang(newName);
        const langObject = languages.find((lang) => lang.name === newName);
        if (langObject) setSelectedLangId(langObject.id);
    };

    const handleEditorChange = (value) => setCode(value);

    const handleSubmit = async () => {
        if (!userId) return alert("Please login to submit");
        if (!selectedLangId) return alert("Please select a language first");

        setDisabled(true);

        if (isBattleMode) {
            if (socket.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify({
                    msg: 'SUBMIT_CODE',
                    data: {
                        userId: userId,
                        problemId: problemID,
                        roomID: battleId,
                        code: currcode,
                        languageId: selectedLangId
                    }
                }));
            } else {
                alert("Connection lost. Please refresh.");
                setDisabled(false);
            }
        } else {
            try {
                const token = await getToken();
                const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}/code-execution/execute`, {
                    code: currcode,
                    languageId: selectedLangId,
                    userId: userId,
                    problemId: problemID
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setSubmissionTab(true);
                const newSubmissionId = res.data.data?.id || res.data.result?.id;
                if (newSubmissionId) setSelectedSubmissionId(newSubmissionId);
                fetchSubmissionsList();
            } catch (error) {
                console.error("Execution failed", error);
                alert("Submission failed. Please try again.");
            } finally {
                setDisabled(false);
            }
        }
    };

    if (!isLoaded) return <div className="h-screen w-full bg-black flex items-center justify-center text-white">Loading...</div>;

    return (
        <div className="h-screen w-full bg-black text-white overflow-hidden flex flex-col">
            <div className={`fixed top-0 left-0 right-0 z-50 border-b h-16 flex items-center justify-center transition-colors
                ${isBattleMode ? 'bg-zinc-950/20 border-orange-500/30' : 'bg-black border-orange-500/30'}`}>

                {isBattleMode ? (
                    <div className="flex items-center gap-8 bg-black/40 px-6 py-2 rounded-full border border-white/5 backdrop-blur-sm">
                        <BattleProgress label="YOU" problems={problemIds} userProgress={myProfile?.progress} align="right" />
                        <div className="flex flex-col items-center px-4 border-x border-white/10">
                            <span className="text-zinc-500 text-[10px] font-bold">VS</span>
                            <div className="flex items-center gap-1 mt-1">
                                <Timer size={14} className="text-orange-500" />
                                <GameTimer startTime={startTime} duration={duration} socket={socket} battleId={battleId}/>
                            </div>
                        </div>
                        <BattleProgress label="OPPONENT" problems={problemIds} userProgress={opponentProfile?.progress} align="left" />

                        <button onClick={() => setSubmissionTab(false)} className={`px-6 py-2 rounded-full font-medium transition text-sm ${!submissionTab ? "bg-yellow-400 text-black shadow-lg" : "bg-zinc-900 text-white border border-orange-500/40 hover:bg-zinc-800"}`}>
                            Problem
                        </button>

                        <div className="top-4 right-4 z-50">
                            <button onClick={handleLeaveClick} className="bg-red-500/20 hover:bg-red-500/40 text-red-500 border border-red-500 px-4 py-2 rounded-full font-bold text-sm transition-all">
                                Leave Game
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex justify-center gap-4">
                        <button onClick={() => { setSubmissionTab(true); setSelectedSubmissionId(null); }} className={`px-6 py-2 rounded-full font-medium transition text-sm ${submissionTab ? "bg-yellow-400 text-black shadow-lg" : "bg-zinc-900 text-white border border-orange-500/40 hover:bg-zinc-800"}`}>
                            Submissions
                        </button>
                        <button onClick={() => setSubmissionTab(false)} className={`px-6 py-2 rounded-full font-medium transition text-sm ${!submissionTab ? "bg-yellow-400 text-black shadow-lg" : "bg-zinc-900 text-white border border-orange-500/40 hover:bg-zinc-800"}`}>
                            Problem
                        </button>
                    </div>
                )}
            </div>

            <div className="flex flex-1 pt-16 h-full">
                <div className="w-1/2 h-full overflow-y-auto custom-scrollbar border-r border-orange-500/20">
                    {!submissionTab && <ProblemSection problemData={problemData} />}
                    {submissionTab && (
                        selectedSubmissionId ? (
                            <DetailedSubmission submissionId={selectedSubmissionId} onBack={() => setSelectedSubmissionId(null)} />
                        ) : (
                            <SubmissionStatus submissions={allsubmissions} setSelectedSubmission={(sub) => setSelectedSubmissionId(sub.id)} />
                        )
                    )}
                </div>

                <div className="w-1/2 h-full flex flex-col bg-[#0f0f0f] relative border-l border-orange-500/30">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-orange-500/20 bg-black shrink-0">
                        <select value={selectedLang} onChange={handleLanguageChange} className="bg-black text-white border border-orange-500/40 rounded px-3 py-1 outline-none focus:border-orange-500 transition-colors">
                            {languages.map((lang) => <option key={lang.id} value={lang.name}>{lang.name.toUpperCase()}</option>)}
                        </select>
                        <div className="flex items-center gap-4">
                            <select value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} className="bg-black text-white border border-orange-500/40 rounded px-3 py-1 outline-none">
                                {[14, 16, 18, 20, 22].map(size => <option key={size} value={size}>{size}px</option>)}
                            </select>
                            <button onClick={() => setTheme(theme === "vs-dark" ? "light" : "vs-dark")} className="border border-orange-500/40 px-3 py-1 rounded hover:bg-orange-500 hover:text-black transition">
                                {theme === "vs-dark" ? "Light" : "Dark"}
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 relative overflow-hidden">
                        <CodeEditor language={selectedLang} theme={theme} fontSize={fontSize} functionEditorValue={handleEditorChange} submissionCode={submissionCodeValue} />
                    </div>

                    {userId ? (
                        <button disabled={disabled} onClick={handleSubmit} className={`absolute bottom-8 right-8 font-bold py-3 px-4 rounded-full flex items-center gap-2 z-20 transition-all ${disabled ? "bg-yellow-200 text-black/50 cursor-not-allowed shadow-none" : isBattleMode ? "bg-orange-600 text-white hover:bg-orange-500 shadow-[0_0_20px_rgba(234,88,12,0.5)]" : "bg-yellow-400 text-black hover:bg-yellow-500 shadow-[0_0_20px_rgba(250,204,21,0.5)]"} transform hover:scale-105 active:scale-95`}>
                            {disabled ? <Loader2 className="animate-spin" size={20} /> : <Play size={20} />}
                            {disabled ? "Running..." : isBattleMode ? "Submit Battle Code" : "Submit Code"}
                        </button>
                    ) : (
                        <div className="absolute bottom-8 right-8 bg-zinc-800 text-white px-4 py-2 rounded-full text-sm">Login to Submit</div>
                    )}
                </div>
            </div>

            {showLeaveModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-zinc-900 border border-red-500/30 rounded-xl p-6 max-w-sm w-full shadow-[0_0_30px_rgba(220,38,38,0.2)]">
                        <div className="flex flex-col items-center text-center gap-4">
                            <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mb-2">
                                <AlertTriangle size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-white">Leave the Battle?</h3>
                            <p className="text-zinc-400 text-sm">If you leave now, you will forfeit the game and your opponent will be declared the winner.</p>
                            <div className="flex gap-3 w-full mt-4">
                                <button onClick={() => setShowLeaveModal(false)} className="flex-1 px-4 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-lg font-semibold transition-colors">Cancel</button>
                                <button onClick={confirmLeave} className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition-colors shadow-lg shadow-red-900/20">Yes, Forfeit</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {isBattleMode && problems.length > 0 && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
                    <button onClick={handleNextProblem} className="flex items-center gap-2 px-6 py-3 bg-zinc-900 border border-orange-500/50 hover:bg-zinc-800 text-orange-500 rounded-full font-bold shadow-[0_0_15px_rgba(234,88,12,0.3)] transition-all transform hover:scale-105">
                        Next Problem <ArrowRight size={18} />
                    </button>
                </div>
            )}

            {gameOverData && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-300">
                    <div className={`bg-zinc-900 border-2 rounded-2xl p-8 max-w-md w-full shadow-2xl flex flex-col items-center text-center gap-6 
                        ${gameOverData.isWinner ? "border-green-500 shadow-green-500/20" : "border-red-500 shadow-red-500/20"}`}>

                        <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-2 
                            ${gameOverData.isWinner ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}>
                            {gameOverData.isWinner ? <Trophy size={40} /> : <XCircle size={40} />}
                        </div>

                        <div>
                            <h2 className="text-3xl font-black italic tracking-tighter text-white mb-2">
                                {gameOverData.isWinner ? "VICTORY!" : "DEFEAT"}
                            </h2>
                            <p className="text-zinc-400 font-medium">
                                {gameOverData.message}
                            </p>
                        </div>

                        <button
                            onClick={() => router.push('/')}
                            className={`w-full py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]
                            ${gameOverData.isWinner ? "bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-900/40" : "bg-zinc-800 hover:bg-zinc-700 text-white"}`}
                        >
                            Return to Home
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}