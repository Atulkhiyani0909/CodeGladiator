'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trophy, PlayCircle } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '@clerk/nextjs';


interface problemType {
    title: string,
    id: string,
    slug: string,
    description: string,
    difficulty: string
}

export default function ProblemList() {

    const [problems, setProblems] = useState<problemType[]>([]);
    const router = useRouter();
const { getToken, userId, isLoaded } = useAuth();

    useEffect(() => {
        
        const getAllProblems = async () => {
            try {
                const token = await getToken();
                const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}/problem/all`,{
                      headers: { Authorization: `Bearer ${token}` }
                });
                setProblems(res.data.data);
                console.log(res);
                
            } catch (error) {
                console.error("Error fetching problems:", error);
            }
        }
        getAllProblems();
    }, [])

   
    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty.toUpperCase()) {
            case 'EASY': return "text-green-400";
            case 'MEDIUM': return "text-yellow-400";
            case 'HARD': return "text-red-400";
            default: return "text-gray-400";
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-8">

        
            <div className="max-w-7xl mx-auto mb-10 pt-10">
                <h1 className="text-4xl font-extrabold tracking-tight mb-2">
                    <span className="text-white">Gladiator</span>
                    <span className="text-orange-500"> Arena</span>
                </h1>
                <p className="text-gray-400 text-lg">
                    Step into the arena. Prove your worth.
                </p>
            </div>

      
            <div className="max-w-7xl mx-auto">
                <div className="overflow-hidden rounded-lg border border-gray-800 bg-[#0f0f0f]">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-800 text-sm uppercase text-gray-500 bg-[#141414]">
                                <th className="p-4 font-medium w-16 text-center"></th>
                                <th className="p-4 font-medium">Title</th>
                                <th className="p-4 font-medium w-32">Difficulty</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {problems.map((problem, index) => (
                                <tr
                                    key={problem.id}
                                    onClick={() => router.push(`/problems/${problem.id}`)}
                                    className="group hover:bg-[#1a1a1a] transition-colors cursor-pointer"
                                >
                                   
                                    <td className="p-4 text-center">
                                      
                                    </td>

                                  
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <span className="text-gray-500 text-sm font-mono">
                                                {index + 1}.
                                            </span>
                                            <span className="text-white font-medium group-hover:text-orange-400 transition-colors text-base">
                                                {problem.title}
                                            </span>
                                        </div>
                                    </td>

                                   
                                    <td className={`p-4 font-medium text-sm ${getDifficultyColor(problem.difficulty)}`}>
                                        {problem.difficulty}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                
                {problems.length === 0 && (
                    <div className="text-center py-12 text-gray-500 border border-t-0 border-gray-800 rounded-b-lg bg-[#0f0f0f]">
                        No challenges found in the arena yet.
                    </div>
                )}
            </div>
        </div>
    );
}