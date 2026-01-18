import React from 'react';
import { CheckCircle2, XCircle, Clock, FileCode, ChevronRight, AlertTriangle } from 'lucide-react';


function SubmissionStatus({ submissions, setSelectedSubmission }: any) {

    const getRelativeTime = (dateString: any) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
        const intervals = { year: 31536000, month: 2592000, day: 86400, hour: 3600, minute: 60 };

        if (seconds < 60) return "Just now";
        for (const [key, value] of Object.entries(intervals)) {
            const count = Math.floor(seconds / value);
            // @ts-ignore
            if (count >= 1) return `${count} ${key}${count > 1 ? 's' : ''} ago`;
        }
        return "Just now";
    };

    const getStatusStyles = (status: any) => {
        switch (status) {
            case 'ACCEPTED':
            case 'SUCCESS':
                return {
                    icon: <CheckCircle2 className="w-5 h-5" />,
                    color: 'text-green-500',
                    bg: 'bg-green-500/10',
                    border: 'border-green-500/20',
                    label: 'ACCEPTED'
                };
            case 'WRONG':
                return {
                    icon: <XCircle className="w-5 h-5" />,
                    color: 'text-red-500',
                    bg: 'bg-red-500/10',
                    border: 'border-red-500/20',
                    label: 'WRONG ANSWER'
                };
            case 'PENDING':
                return {
                    icon: <Clock className="w-5 h-5 animate-pulse" />,
                    color: 'text-yellow-500',
                    bg: 'bg-yellow-500/10',
                    border: 'border-yellow-500/20',
                    label: 'PENDING'
                };
            case 'TIMEOUT':
                return {
                    icon: <AlertTriangle className="w-5 h-5" />,
                    color: 'text-orange-500',
                    bg: 'bg-orange-500/10',
                    border: 'border-orange-500/20',
                    label: 'EXECUTION FAILED'
                };
            default:
                return {
                    icon: <FileCode className="w-5 h-5" />,
                    color: 'text-gray-400',
                    bg: 'bg-gray-800',
                    border: 'border-gray-700',
                    label: status
                };
        }
    };

    const formatDate = (dateString: any) => {
        return new Date(dateString).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="w-full px-4 py-4 flex flex-col h-[85vh]">
            
            <div className="sticky top-0 z-10 bg-[#0f0f0f] pt-1 pb-4">
                <br />
                <h3 className="text-lg font-bold text-white border-l-4 border-orange-500 pl-3">
                    Submission History
                </h3>
            </div>

            <div className="flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar pb-10 flex-1">
                {submissions.length === 0 ? (
                    <div className="text-gray-500 text-sm italic py-4 text-center border border-dashed border-gray-800 rounded-lg">
                        No submissions yet.
                    </div>
                ) : (
                    submissions.map((sub: any) => {
                        const now = new Date();
                        const created = new Date(sub.createdAt);
                        // @ts-ignore
                        const diffInMinutes = (now - created) / 1000 / 60;

                        let effectiveStatus = sub.status;
                        if (sub.status === 'PENDING' && diffInMinutes > 2) {
                            effectiveStatus = 'TIMEOUT';
                        }

                        const style = getStatusStyles(effectiveStatus);

                        return (
                            <div
                                key={sub.id}
                                className={`
                                    relative flex items-center justify-between p-4 rounded-lg border brightness-10 cursor-pointer
                                    ${style.bg} ${style.border} transition-all hover:brightness-150 group shrink-0
                                `}
                                onClick={() => {
                                  
                                    if(setSelectedSubmission) {
                                        setSelectedSubmission(sub);
                                    }
                                }}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-full bg-black/40 ${style.color}`}>
                                        {style.icon}
                                    </div>

                                    <div className="flex flex-col">
                                        <span className={`font-bold tracking-wide ${style.color}`}>
                                            {style.label}
                                        </span>
                                        <span className="text-xs text-gray-400 font-mono mt-0.5">
                                            {formatDate(sub.createdAt)}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="flex flex-col items-end">
                                        <span className="text-xs text-gray-400 font-mono mt-0.5">
                                            {getRelativeTime(sub.createdAt)}
                                        </span>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}

export default SubmissionStatus;