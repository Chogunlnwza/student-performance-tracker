import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();
    const [role, setRole] = useState("student");
    const [studentName, setStudentName] = useState("");

    const handleLogin = () => {
        localStorage.setItem("role", role);
        if (role === "student") {
            if (!studentName.trim()) {
                alert("กรุณากรอกชื่อนักศึกษา");
                return;
            }
            localStorage.setItem("studentName", studentName.trim());
        } else {
            localStorage.removeItem("studentName");
        }
        navigate(role === "teacher" ? "/teacher" : "/student");
    };

    return (
        <div style={{ fontFamily: "'DM Sans', sans-serif" }} className="min-h-screen relative flex items-center justify-center px-4 overflow-hidden bg-slate-900">
            <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display&display=swap" rel="stylesheet" />

            {/* Dynamic Background */}
            <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 z-0"></div>
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none opacity-50">
                <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-[128px] animate-pulse"></div>
                <div className="absolute top-40 -right-20 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] animate-pulse" style={{ animationDelay: '2s' }}></div>
                <div className="absolute -bottom-40 left-1/2 w-96 h-96 bg-fuchsia-500 rounded-full mix-blend-multiply filter blur-[128px] animate-pulse" style={{ animationDelay: '4s' }}></div>
            </div>

            <div className="w-full max-w-md relative z-10 animate-slide-up">
                {/* Logo area */}
                <div className="text-center mb-10">
                    <div className="text-6xl mb-6 drop-shadow-lg">🎓</div>
                    <h1 style={{ fontFamily: "'DM Serif Display', serif" }} className="text-4xl text-white tracking-wide">
                        Performance Tracker
                    </h1>
                    <p className="text-indigo-200 text-sm mt-3 font-medium tracking-wide">ระบบติดตามผลการเรียนนักศึกษา</p>
                </div>

                {/* Card */}
                <div className="glass-dark rounded-3xl p-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] border border-white/10">
                    <h2 className="text-xl font-semibold text-white mb-8 text-center">เข้าสู่ระบบ</h2>

                    <div className="mb-6">
                        <label className="block text-xs font-semibold text-indigo-300 mb-3 uppercase tracking-wider">
                            เลือกบทบาทของคุณ
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { value: "student", label: "นักศึกษา", icon: "👨‍🎓" },
                                { value: "teacher", label: "อาจารย์",  icon: "👩‍🏫" },
                            ].map(opt => (
                                <button key={opt.value} type="button"
                                    onClick={() => setRole(opt.value)}
                                    className={`flex flex-col items-center py-5 rounded-2xl border-2 transition-all duration-300 font-medium text-sm
                                        ${role === opt.value
                                            ? "border-indigo-500 bg-indigo-500/20 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)] transform scale-105"
                                            : "border-slate-700/50 text-slate-400 hover:border-slate-500 hover:bg-slate-800/50"}`}>
                                    <span className="text-3xl mb-2">{opt.icon}</span>
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className={`transition-all duration-500 overflow-hidden ${role === "student" ? "max-h-32 opacity-100 mb-8" : "max-h-0 opacity-0 mb-0"}`}>
                        <label className="block text-xs font-semibold text-indigo-300 mb-2">
                            ชื่อ-นามสกุล นักศึกษา
                        </label>
                        <input 
                            type="text" 
                            value={studentName}
                            onChange={(e) => setStudentName(e.target.value)}
                            placeholder="As Pinlada pasitom"
                            className="w-full bg-slate-900/50 border border-slate-600 rounded-xl p-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all placeholder:text-slate-500"
                        />
                    </div>

                    <button onClick={handleLogin}
                        className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-4 rounded-xl font-bold text-sm shadow-lg hover:shadow-indigo-500/50 hover:scale-[1.02] active:scale-95 transition-all duration-300">
                        เข้าสู่ระบบ →
                    </button>
                </div>
            </div>
        </div>
    );
}
