import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();
    const [role, setRole] = useState("student");

    const handleLogin = () => {
        localStorage.setItem("role", role);
        navigate(role === "teacher" ? "/teacher" : "/student");
    };

    return (
        <div style={{ fontFamily: "'DM Sans', sans-serif" }} className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
            <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display&display=swap" rel="stylesheet" />

            <div className="w-full max-w-sm">
                {/* Logo area */}
                <div className="text-center mb-10">
                    <div className="text-4xl mb-4">🎓</div>
                    <h1 style={{ fontFamily: "'DM Serif Display', serif" }} className="text-3xl text-white">
                        Performance Tracker
                    </h1>
                    <p className="text-slate-400 text-sm mt-2">ระบบติดตามผลการเรียนนักศึกษา</p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl p-8 shadow-2xl">
                    <h2 className="text-lg font-semibold text-slate-800 mb-6">เข้าสู่ระบบ</h2>

                    <div className="mb-5">
                        <label className="block text-xs font-medium text-slate-500 mb-2 uppercase tracking-wider">
                            บทบาทของคุณ
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { value: "student", label: "นักศึกษา", icon: "👨‍🎓" },
                                { value: "teacher", label: "อาจารย์",  icon: "👩‍🏫" },
                            ].map(opt => (
                                <button key={opt.value} type="button"
                                    onClick={() => setRole(opt.value)}
                                    className={`flex flex-col items-center py-4 rounded-xl border-2 transition-all font-medium text-sm
                                        ${role === opt.value
                                            ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                                            : "border-slate-200 text-slate-500 hover:border-slate-300"}`}>
                                    <span className="text-2xl mb-1">{opt.icon}</span>
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button onClick={handleLogin}
                        className="w-full bg-slate-900 text-white py-3 rounded-xl font-semibold text-sm hover:bg-slate-700 transition-colors">
                        เข้าสู่ระบบ →
                    </button>
                </div>
            </div>
        </div>
    );
}
