import React from 'react';
import { FileText, AlertCircle } from 'lucide-react';

export function ProblemSection({ problemData }: any) {
    
   
    const defaultProblem = {
        title: "Loading...",
        difficulty: "Easy",
        description: "Please wait while we fetch the problem.",
        testCases: [],
        constraints: []
    };

    const problem = problemData || defaultProblem;

    
    const formatInput = (input: any) => {
        if (typeof input === 'object' && input !== null) {
            return Object.entries(input)
                .map(([key, value]) => {
                    const valStr = Array.isArray(value) 
                        ? `[${value.join(', ')}]` 
                        : JSON.stringify(value);
                    return `${key} = ${valStr}`;
                })
                .join(', ');
        }
        return JSON.stringify(input);
    };

    const getDifficultyStyle = (difficulty: any) => {
        switch (difficulty) {
            case 'EASY': return "text-green-400 bg-green-400/10 border-green-400/20";
            case 'MEDIUM': return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
            case 'HARD': return "text-red-400 bg-red-400/10 border-red-400/20";
            default: return "text-gray-400 bg-gray-400/10 border-gray-400/20";
        }
    };

    return (
        <div className="w-full h-full bg-[#0a0a0a] text-gray-300 overflow-y-auto custom-scrollbar p-6 pb-20">
            
            {/* --- HEADER --- */}
            <div className="mb-6 border-b border-gray-800 pb-6">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                        <FileText className="text-orange-500" size={28} />
                        {problem.title}
                    </h1>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyStyle(problem.difficulty)}`}>
                        {problem.difficulty}
                    </span>
                </div>
            </div>

            {/* --- BODY: Description --- */}
            <div className="mb-8 space-y-4">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <span className="w-1 h-6 bg-orange-500 rounded-full"></span>
                    Description
                </h2>
                <div className="text-sm leading-7 text-gray-400 whitespace-pre-line">
                    {problem.description}
                </div>
            </div>

            {/* --- EXAMPLES (Mapped from testCases) --- */}
            <div className="mb-8 space-y-6">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <span className="w-1 h-6 bg-orange-500 rounded-full"></span>
                    Examples
                </h2>

                {problem.testCases && problem.testCases.map((ex: any, index: number) => (
                    <div key={index} className="bg-[#161616] border border-gray-800 rounded-lg p-4 transition-all hover:border-gray-700">
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                            Example {index + 1}
                        </h3>
                        
                        <div className="space-y-3 font-mono text-sm">
                            {/* Input */}
                            <div className="flex flex-col gap-1">
                                <span className="text-gray-500 select-none">Input:</span>
                                <code className="bg-[#0f0f0f] px-3 py-2 rounded text-blue-300 block border border-gray-800/50 break-words whitespace-pre-wrap">
                                    {formatInput(ex.input)}
                                </code>
                            </div>
                            
                            {/* Output */}
                            <div className="flex flex-col gap-1">
                                <span className="text-gray-500 select-none">Output:</span>
                                <code className="bg-[#0f0f0f] px-3 py-2 rounded text-green-400 block border border-gray-800/50">
                                    {JSON.stringify(ex.output)}
                                </code>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* --- CONSTRAINTS (Only show if data exists) --- */}
            {problem.constraints && problem.constraints.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                        <AlertCircle size={18} className="text-orange-500" />
                        Constraints
                    </h2>
                    <ul className="list-disc list-inside space-y-2 text-sm text-gray-400 bg-[#161616] p-4 rounded-lg border border-gray-800">
                        {problem.constraints.map((constraint: string, index: number) => (
                            <li key={index} className="font-mono">
                                {constraint}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

        </div>
    );
}

export default ProblemSection;