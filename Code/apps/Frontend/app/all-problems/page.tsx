'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trophy, ArrowRight, Activity } from 'lucide-react';
import axios from 'axios';

interface problemType {
    title:string,
    id:string,
    slug:string,
    description:string,
    difficulty:string
}
export default function ProblemList() {

    const [problems, setProblems] = useState([]);

    const router = useRouter();

    useEffect(() => {
        const getAllProblems = async () => {
            const res = await axios.get('http://localhost:8080/api/v1/problem/all');
            setProblems(res.data.data);
        }

        getAllProblems();
    }, [])

    const data = problems;


    const getDifficultyColor = (difficulty:string) => {
        switch (difficulty) {
            case 'EASY': return "text-green-400 border-green-400/20 bg-green-400/10";
            case 'MEDIUM': return "text-yellow-400 border-yellow-400/20 bg-yellow-400/10";
            case 'HARD': return "text-red-400 border-red-400/20 bg-red-400/10";
            default: return "text-gray-400 border-gray-400/20 bg-gray-400/10";
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-8">


            <div className="max-w-7xl mx-auto mb-12 text-center pt-10">
                <h1 className="text-5xl font-extrabold tracking-tight mb-4">
                    <span className="text-white">Gladiator</span>
                    <span className="text-orange-500"> Arena</span>
                </h1>
                <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                    Choose your battle. Solve algorithms, master data structures, and climb the ranks of the coding elite.
                </p>
            </div>


            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.map((problem:problemType) => (
                    <div
                        key={problem.id}
                        onClick={() => router.push(`/problems/${problem.id}`)} 
                        className="group relative bg-[#0f0f0f] border border-gray-800 rounded-xl p-6 hover:border-orange-500/50 hover:bg-[#141414] transition-all duration-300 cursor-pointer overflow-hidden"
                    >
                        
                        <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 blur-2xl rounded-full -mr-10 -mt-10 transition-opacity opacity-0 group-hover:opacity-100" />

                        
                        <div className="flex justify-between items-start mb-4">
                            <div className={`px-3 py-1 rounded-full text-xs font-bold border ${getDifficultyColor(problem.difficulty)}`}>
                                {problem.difficulty}
                            </div>
                            <Trophy className="text-gray-600 group-hover:text-orange-500 transition-colors" size={20} />
                        </div>

                        
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange-400 transition-colors">
                            {problem.title}
                        </h3>
                        <p className="text-sm text-gray-500 line-clamp-2 mb-6">
                            {problem.description}
                        </p>

                        
                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-800 group-hover:border-orange-500/20">
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                            </div>
                            <span className="flex items-center gap-1 text-sm font-medium text-orange-500 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                Solve Now <ArrowRight size={16} />
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}