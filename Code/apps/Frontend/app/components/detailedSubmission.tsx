import React, { useEffect, useState, useRef } from 'react';
import { 
    Clock, CheckCircle, XCircle, Terminal, Code2, AlertTriangle, 
    Calendar, ArrowLeft, Loader2 
} from 'lucide-react';
import axios from 'axios';

function DetailedSubmission({ submissionId, onBack }: any) {
    
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const pollInterval = useRef<any>(null);

    const fetchDetails = async () => {
        try {
          
            const res = await axios.get(`http://localhost:8080/api/v1/submission/${submissionId}`);
           
            
            const submission = res.data.code;
            
            setData(submission);
            setLoading(false);

            
            if (submission.status !== "PENDING") {
                clearInterval(pollInterval.current);
            }

        } catch (err) {
            console.error("Error fetching submission details", err);
           
        }
    };

    useEffect(() => {
      
        fetchDetails();

       
        pollInterval.current = setInterval(fetchDetails, 2000);

       
        return () => clearInterval(pollInterval.current);
    }, [submissionId]);

 
    

    if (loading && !data) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-4">
                <Loader2 className="animate-spin text-orange-500" size={40} />
                <p>Initializing result...</p>
                <button onClick={onBack} className="text-sm underline hover:text-white">Cancel</button>
            </div>
        );
    }

  
    if (!data) return <div className="p-10 text-center">Failed to load submission.</div>;


    const { status, code, output, createdAt, languageId } = data;
    const isSuccess = status === "ACCEPTED" || status === "SUCCESS";
    const isPending = status === "PENDING";
    
    const statusColor = isSuccess ? "text-green-400" : isPending ? "text-yellow-400" : "text-red-400";
    const statusBg = isSuccess ? "bg-green-400/10 border-green-400/20" : isPending ? "bg-yellow-400/10 border-yellow-400/20" : "bg-red-400/10 border-red-400/20";
    const StatusIcon = isSuccess ? CheckCircle : isPending ? Clock : XCircle;

    return (
        <div className="w-full h-full bg-[#0a0a0a] text-gray-300 flex flex-col pt-3">
            
            
            <div className="sticky top-0 z-20 bg-[#0a0a0a] border-b border-gray-800 p-4 flex items-center justify-between">
                <button 
                    onClick={onBack}
                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                >
                    <ArrowLeft size={18} />
                    Back
                </button>
                
                <span className="text-xs font-mono text-gray-600">ID: {submissionId.split('-')[0]}...</span>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div className={`flex items-center gap-3 px-5 py-3 rounded-xl border ${statusBg}`}>
                        <StatusIcon size={24} className={`${statusColor} ${isPending ? 'animate-pulse' : ''}`} />
                        <span className={`text-xl font-bold tracking-wide ${statusColor}`}>
                            {status}
                        </span>
                    </div>
                    <div className="text-sm text-gray-500 flex items-center gap-2">
                        <Calendar size={14} />
                        {new Date(createdAt).toLocaleString()}
                    </div>
                </div>

               
                <div className="mb-8">
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <Terminal size={18} className="text-orange-500" />
                        Result
                    </h3>
                    <div className={`rounded-xl border p-4 font-mono text-sm leading-relaxed overflow-x-auto min-h-[100px]
                        ${isSuccess 
                            ? "bg-black border-green-900/30 text-green-300" 
                            : "bg-black border-red-900/30 text-red-300"
                        }`}
                    >
                         <pre className="whitespace-pre-wrap break-words">
                            {isPending ? "Waiting for worker..." : (output || "No output.")}
                        </pre>
                    </div>
                </div>

                
                <div className="mb-8">
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <Code2 size={18} className="text-orange-500" />
                        Submitted Code
                    </h3>
                    <div className="bg-[#111] rounded-xl border border-gray-800 overflow-hidden">
                        <div className="bg-[#1a1a1a] px-4 py-2 border-b border-gray-800 flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500/20"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500/20"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500/20"></div>
                        </div>
                        <div className="p-4 overflow-x-auto">
                            <pre className="font-mono text-sm text-gray-300">
                                <code>{code}</code>
                            </pre>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DetailedSubmission;