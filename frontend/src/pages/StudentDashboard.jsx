import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-hot-toast";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const STATUS_CONFIG = {
    NOT_SUBMITTED: { label: "ยังไม่ส่ง", bg: "bg-amber-100 text-amber-800 border-amber-200" },
    SUBMITTED:     { label: "ส่งแล้ว",  bg: "bg-emerald-100 text-emerald-800 border-emerald-200" },
    LATE:          { label: "ส่งช้า",   bg: "bg-red-100 text-red-800 border-red-200" },
};

export default function StudentDashboard() {
    const navigate = useNavigate();
    const [assignments, setAssignments] = useState([]);
    const [submittingId, setSubmittingId] = useState(null);
    const [studentNote, setStudentNote] = useState("");

    const studentName = localStorage.getItem("studentName");
    const role = localStorage.getItem("role");

    useEffect(() => {
        if (role !== "student" || !studentName) {
            navigate("/");
            return;
        }
        fetchAll();
    }, [role, studentName, navigate]);

    const fetchAll = async () => {
        try {
            const res = await API.get(`/assignments?studentName=${encodeURIComponent(studentName)}`);
            setAssignments(res.data);
        } catch (e) {
            console.error(e);
            toast.error("ดึงข้อมูลล้มเหลว");
        }
    };

    const handleSubmit = async (id) => {
        try {
            await API.patch(`/assignments/${id}/submit`, { studentNote });
            toast.success("ส่งงานสำเร็จ!");
            setSubmittingId(null);
            setStudentNote("");
            fetchAll();
        } catch (e) {
            console.error(e);
            toast.error("ส่งงานล้มเหลว");
        }
    };

    const isLate = (dueDate) => dueDate && new Date(dueDate) < new Date();

    const getStatus = (a) =>
        a.status === "NOT_SUBMITTED" && isLate(a.dueDate) ? "LATE" : a.status;

    // Stats
    const submitted = assignments.filter(a => a.status === "SUBMITTED").length;
    const pending   = assignments.filter(a => a.status === "NOT_SUBMITTED").length;
    const gradedItems = assignments.filter(a => a.score != null);
    const avgScore  = gradedItems.length > 0
        ? (gradedItems.reduce((s, a) => s + (a.score / a.maxScore) * 100, 0) / gradedItems.length).toFixed(1)
        : null;

    const studentYear = assignments.length > 0 ? assignments[0].studentYear : "ไม่ระบุ";

    // Chart Data
    const chartData = gradedItems.map(a => ({
        name: a.title.length > 15 ? a.title.substring(0, 15) + "..." : a.title,
        score: a.score,
        maxScore: a.maxScore,
        percent: ((a.score / a.maxScore) * 100).toFixed(0)
    }));

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    return (
        <div style={{ fontFamily: "'DM Sans', sans-serif" }} className="min-h-screen bg-slate-50/50">
            <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display&display=swap" rel="stylesheet" />

            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-900 text-white px-8 py-10 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500 opacity-10 rounded-full blur-2xl transform -translate-x-1/2 translate-y-1/2"></div>
                <div className="max-w-4xl mx-auto flex justify-between items-end relative z-10 animate-fade-in">
                    <div>
                        <p className="text-indigo-200 text-xs font-semibold uppercase tracking-widest mb-2">Student Performance Tracker</p>
                        <h1 style={{ fontFamily: "'DM Serif Display', serif" }} className="text-4xl tracking-wide drop-shadow-md">
                            {studentName}
                        </h1>
                        <div className="flex items-center gap-3 mt-3">
                            <span className="bg-white/10 px-3 py-1 rounded-full text-xs font-medium border border-white/20 backdrop-blur-sm">
                                ชั้นปีที่ {studentYear}
                            </span>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all backdrop-blur-sm border border-white/10 shadow-lg active:scale-95">
                        ออกจากระบบ
                    </button>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-8 py-10 animate-slide-up">

                {/* Stats */}
                <div className="grid grid-cols-4 gap-5 mb-10">
                    {[
                        { label: "งานทั้งหมด", value: assignments.length, color: "text-slate-800", icon: "📚" },
                        { label: "ส่งงานแล้ว", value: submitted, color: "text-emerald-600", icon: "✅" },
                        { label: "รอส่ง", value: pending, color: "text-amber-500", icon: "⏳" },
                        { label: "คะแนนเฉลี่ย (%)", value: avgScore ?? "—", color: "text-indigo-600", icon: "🎯" },
                    ].map((s, i) => (
                        <div key={s.label} className="bg-white border border-slate-100 rounded-3xl p-6 text-center shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300" style={{ animationDelay: `${i * 100}ms` }}>
                            <div className="text-2xl mb-2">{s.icon}</div>
                            <div className={`text-4xl font-bold ${s.color} tracking-tight`}>{s.value}</div>
                            <div className="text-[11px] font-semibold text-slate-400 mt-2 uppercase tracking-widest">{s.label}</div>
                        </div>
                    ))}
                </div>

                {/* Chart Section */}
                {chartData.length > 0 && (
                    <div className="bg-white border border-slate-100 rounded-3xl p-8 mb-10 shadow-sm hover:shadow-lg transition-all duration-300">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">📊</div>
                            <h2 className="text-xl font-bold text-slate-800">กราฟคะแนนการประเมิน</h2>
                        </div>
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" tick={{fontSize: 12, fontWeight: 500}} stroke="#94a3b8" axisLine={false} tickLine={false} dy={10} />
                                    <YAxis tick={{fontSize: 12, fontWeight: 500}} stroke="#94a3b8" axisLine={false} tickLine={false} dx={-10} />
                                    <Tooltip 
                                        cursor={{fill: '#f8fafc'}}
                                        contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: 500}}
                                    />
                                    <Bar dataKey="score" name="คะแนนที่ได้" fill="url(#colorScore)" radius={[6, 6, 0, 0]} barSize={45} />
                                    <Bar dataKey="maxScore" name="คะแนนเต็ม" fill="#e2e8f0" radius={[6, 6, 0, 0]} barSize={45} />
                                    <defs>
                                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={1}/>
                                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={1}/>
                                        </linearGradient>
                                    </defs>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}

                {/* Assignment list */}
                <div className="space-y-5">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">📋</div>
                        <h2 className="text-xl font-bold text-slate-800">รายการงานและการสอบ</h2>
                    </div>
                    {assignments.map(a => {
                        const statusKey = getStatus(a);
                        const cfg = STATUS_CONFIG[statusKey] || STATUS_CONFIG.NOT_SUBMITTED;
                        const isSubmitting = submittingId === a.id;
                        const canSubmit = a.status === "NOT_SUBMITTED";

                        return (
                            <div key={a.id} className="bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group">
                                <div className="p-7">
                                    {/* Title row */}
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 flex-wrap mb-2">
                                                <h2 className="text-xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{a.title}</h2>
                                                <span className={`px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase border ${cfg.bg}`}>
                                                    {cfg.label}
                                                </span>
                                            </div>
                                            <p className="text-sm text-slate-500 leading-relaxed">{a.description}</p>
                                        </div>

                                        {/* Score badge */}
                                        {a.score != null && (
                                            <div className="shrink-0 text-center bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl px-5 py-3 shadow-sm transform group-hover:scale-105 transition-transform">
                                                <div className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">{a.score}</div>
                                                <div className="text-xs font-semibold text-indigo-400">/{a.maxScore}</div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Meta info */}
                                    <div className="flex gap-6 mt-5 text-sm text-slate-400 flex-wrap bg-slate-50 p-4 rounded-2xl">
                                        <div className="flex items-center gap-2">
                                            <span>📅</span>
                                            <span>กำหนดส่ง: <span className="text-slate-700 font-semibold">{a.dueDate}</span></span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span>🎯</span>
                                            <span>คะแนนเต็ม: <span className="text-slate-700 font-semibold">{a.maxScore}</span></span>
                                        </div>
                                    </div>

                                    {/* Notes */}
                                    {a.teacherNote && (
                                        <div className="mt-5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100/50 rounded-2xl p-4">
                                            <p className="text-xs font-bold text-blue-700 mb-2 uppercase tracking-wide flex items-center gap-2">📝 โน้ตจากอาจารย์</p>
                                            <p className="text-sm text-blue-900/80 leading-relaxed font-medium">{a.teacherNote}</p>
                                        </div>
                                    )}
                                    {a.studentNote && (
                                        <div className="mt-3 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100/50 rounded-2xl p-4">
                                            <p className="text-xs font-bold text-emerald-700 mb-2 uppercase tracking-wide flex items-center gap-2">💬 โน้ตของฉัน</p>
                                            <p className="text-sm text-emerald-900/80 leading-relaxed font-medium">{a.studentNote}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Submit section */}
                                {canSubmit && (
                                    <div className="bg-slate-50/80 border-t border-slate-100 px-7 py-5">
                                        {isSubmitting ? (
                                            <div className="space-y-4 animate-fade-in">
                                                <div>
                                                    <label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wide">
                                                        โน้ตถึงอาจารย์ (ถ้ามี)
                                                    </label>
                                                    <textarea
                                                        value={studentNote}
                                                        onChange={e => setStudentNote(e.target.value)}
                                                        rows={2}
                                                        placeholder="อธิบายเพิ่มเติมเกี่ยวกับการส่งงานนี้..."
                                                        className="w-full bg-white border border-slate-200 rounded-2xl p-4 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all shadow-sm"
                                                    />
                                                </div>
                                                <div className="flex gap-3">
                                                    <button onClick={() => handleSubmit(a.id)}
                                                        className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-xl text-sm font-bold shadow-lg hover:shadow-indigo-500/30 hover:scale-[1.02] active:scale-95 transition-all">
                                                        ยืนยันส่งงาน
                                                    </button>
                                                    <button onClick={() => { setSubmittingId(null); setStudentNote(""); }}
                                                        className="flex-1 bg-white border border-slate-200 text-slate-600 py-3 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-50 transition-all">
                                                        ยกเลิก
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <button onClick={() => setSubmittingId(a.id)}
                                                className="w-full bg-slate-900 text-white py-4 rounded-2xl text-sm font-bold shadow-lg hover:bg-slate-800 hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all flex items-center justify-center gap-2">
                                                <span>📤</span> เริ่มส่งงาน
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {assignments.length === 0 && (
                        <div className="text-center py-24 bg-white border border-dashed border-slate-300 rounded-3xl animate-fade-in">
                            <div className="text-6xl mb-6">📚</div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">ยังไม่มีงานที่ได้รับมอบหมาย</h3>
                            <p className="text-slate-500 font-medium">รอรับการอัปเดตงานจากอาจารย์</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
