'use client';

import { useEffect, useState } from 'react';
import CodeEditor from '../../components/CodeEditor';
import ProblemSection from '../../components/ProblemSection';
import { Play } from 'lucide-react';
import axios from 'axios';
import SubmissionStatus from '../../components/SubmissionStatus';
import { useParams } from 'next/navigation';

export default function Page() {

    const [languages, setLanguages] = useState([]);


    const [theme, setTheme] = useState("vs-dark");
    const [fontSize, setFontSize] = useState(16);


    const [selectedLang, setSelectedLang] = useState("javascript");
    const [selectedLangId, setSelectedLangId] = useState("");

    const [currcode, setCode] = useState('');
    const [submission, setSubmission] = useState(false);
    const [allsubmissions, setSubmissions] = useState([]);
    const [submmisionCodeValue, setSubmissionCode] = useState("");
    const [problemData, setProblemData] = useState({});

    const { problemID } = useParams();


    useEffect(() => {
        const getLanguage = async () => {
            try {
                const res = await axios.get('http://localhost:8080/api/v1/language/all-languages');
                const fetchedLanguages = res.data.data;
                setLanguages(fetchedLanguages);


                const defaultLang = fetchedLanguages.find(lang => lang.name.toLowerCase() === "javascript");


                if (defaultLang) {
                    setSelectedLangId(defaultLang.id);
                } else if (fetchedLanguages.length > 0) {
                    setSelectedLang("javascript");
                    setSelectedLangId(fetchedLanguages[0].id);
                }
            } catch (err) {
                console.error("Error fetching languages", err);
            }
        }

        const getProblemData = async () => {
            try {
                const res = await axios.get(`http://localhost:8080/api/v1/problem/${problemID}`);
                setProblemData(res.data.res);
            } catch (err) {
                console.error("Error fetching problem", err);
            }
        }

        getProblemData();
        getLanguage();

    }, [problemID]);


    useEffect(() => {

        if (!problemData.slug || !selectedLang) return;

        const getBoilerPlateCode = async () => {
            try {

                const res = await axios.get(`http://localhost:3000/boilerplate/${problemData.slug}/${selectedLang}`);

                setSubmissionCode(res.data.code);

            } catch (err) {
                console.error("Error getting boilerplate", err);
            }
        }

        getBoilerPlateCode();
    }, [selectedLang, problemID, problemData]);



    const handleLanguageChange = (e) => {
        const newName = e.target.value;
        setSelectedLang(newName);


        const langObject = languages.find(lang => lang.name === newName);
        if (langObject) {
            setSelectedLangId(langObject.id);
            console.log("Selected Language ID:", langObject.id);
        }
    };


    const handleSubmit = async () => {
        if (!selectedLangId) {
            alert("Please select a language first");
            return;
        }

        let data = {
            code: currcode,
            languageId: selectedLangId,
            userId: "cd0c4fd5-0a65-4125-a824-00a3b35097a0",
            problemId: problemID
        };

        try {
            await axios.post('http://localhost:8080/api/v1/code-execution/execute', data);
            setSubmission(true);
        } catch (error) {
            console.error("Execution failed", error);
        }
    };

    const submissions = async () => {
        let data = {
            userId: "cd0c4fd5-0a65-4125-a824-00a3b35097a0"
        };
        try {
            let res = await axios.post(`http://localhost:8080/api/v1/submission/status/${problemID}`, data);
            setSubmissions(res.data.data);
        } catch (e) {
            console.error("Fetch error", e);
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            submissions();
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    function handleEditorChange(value) {
        setCode(value);
    }

    function submmisionCode(value) {
        setSubmissionCode(value);
    }

    return (
        <div className="h-screen w-full bg-black text-white overflow-hidden flex flex-col">

            <div className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-orange-500/30 h-16 flex items-center justify-center">
                <div className="flex justify-center gap-4">
                    <button
                        onClick={() => setSubmission(true)}
                        className={`px-6 py-2 rounded-full font-medium transition text-sm ${submission ? "bg-yellow-400 text-black shadow-lg" : "bg-zinc-900 text-white border border-orange-500/40 hover:bg-zinc-800"}`}
                    >
                        Submissions
                    </button>

                    <button
                        onClick={() => setSubmission(false)}
                        className={`px-6 py-2 rounded-full font-medium transition text-sm ${!submission ? "bg-yellow-400 text-black shadow-lg" : "bg-zinc-900 text-white border border-orange-500/40 hover:bg-zinc-800"}`}
                    >
                        Problem
                    </button>
                </div>
            </div>

            <div className="flex flex-1 pt-16 h-full">

                <div className="w-1/2 h-full overflow-y-auto custom-scrollbar border-r border-orange-500/20">
                    {submission ? (
                        <SubmissionStatus submissions={allsubmissions} onCode={submmisionCode} />
                    ) : (
                        <ProblemSection problemData={problemData} />
                    )}
                </div>

                <div className="w-1/2 h-full flex flex-col bg-[#0f0f0f] relative border-l border-orange-500/30">

                    <div className="flex items-center justify-between px-4 py-3 border-b border-orange-500/20 bg-black shrink-0">


                        <select
                            value={selectedLang}
                            onChange={handleLanguageChange}
                            className="bg-black text-white border border-orange-500/40 rounded px-3 py-1 outline-none focus:border-orange-500 transition-colors"
                        >
                            {languages.map((lang) => (
                                <option key={lang.id} value={lang.name}>
                                    {lang.name.toUpperCase()}
                                </option>
                            ))}
                        </select>

                        <div className="flex items-center gap-4">
                            <select
                                value={fontSize}
                                onChange={(e) => setFontSize(Number(e.target.value))}
                                className="bg-black text-white border border-orange-500/40 rounded px-3 py-1 outline-none"
                            >
                                {[14, 16, 18, 20, 22].map(size => (
                                    <option key={size} value={size}>
                                        {size}px
                                    </option>
                                ))}
                            </select>

                            <button
                                onClick={() => setTheme(theme === "vs-dark" ? "light" : "vs-dark")}
                                className="border border-orange-500/40 px-3 py-1 rounded hover:bg-orange-500 hover:text-black transition"
                            >
                                {theme === "vs-dark" ? "Light" : "Dark"}
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 relative overflow-hidden">
                        <CodeEditor
                            language={selectedLang}
                            theme={theme}
                            fontSize={fontSize}
                            functionEditorValue={handleEditorChange}
                            submissionCode={submmisionCodeValue}
                        />
                    </div>

                    <button
                        onClick={handleSubmit}
                        className="absolute bottom-8 right-8 bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-4 rounded-full shadow-[0_0_20px_rgba(250,204,21,0.5)] transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2 z-20"
                    >
                        <Play size={20} />
                        Submit Code
                    </button>
                </div>
            </div>
        </div>
    );
}