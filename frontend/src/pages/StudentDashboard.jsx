import { useEffect, useState } from "react";
import API from "../services/api";

const STATUS_CONFIG = {
    NOT_SUBMITTED: { label: "ยังไม่ส่ง", bg: "bg-amber-100 text-amber-800 border-amber-200" },
    SUBMITTED:     { label: "ส่งแล้ว",  bg: "bg-emerald-100 text-emerald-800 border-emerald-200" },
    LATE:          { label: "ส่งช้า",   bg: "bg-red-100 text-red-800 border-red-200" },
};

export default function StudentDashboard() {
    const [assignments, setAssignments] = useState([]);
    const [submittingId, setSubmittingId] = useState(null);
    const [studentNote, setStudentNote] = useState("");

    useEffect(() => { fetchAll(); }, []);

    const fetchAll = async () => {
        try { setAssignments((await API.get("/assignments")).data); }
        catch (e) { console.error(e); }
    };

    const handleSubmit = async (id) => {
        try {
            await API.patch(`/assignments/${id}/submit`, { studentNote });
            setSubmittingId(null); setStudentNote(""); fetchAll();
        } catch (e) { console.error(e); }
    };

    const isLate = (dueDate) => dueDate && new Date(dueDate) < new Date();

    const getStatus = (a) =>
        a.status === "NOT_SUBMITTED" && isLate(a.dueDate) ? "LATE" : a.status;

    // Stats
    const submitted = assignments.filter(a => a.status === "SUBMITTED").length;
    const pending   = assignments.filter(a => a.status === "NOT_SUBMITTED").length;
    const gradedItems = assignments.filter(a => a.score != null);
    const avgScore  = gradedItems.length > 0
        ? (gradedItems.reduce((s, a) => s + a.score, 0) / gradedItems.length).toFixed(1)
        : null;

    // Student info from first record
    const student = assignments[0] || {};

    return (
        <div style={{ fontFamily: "'DM Sans', sans-serif" }} className="min-h-screen bg-slate-50">
            <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display&display=swap" rel="stylesheet" />

            {/* Header */}
            <div className="bg-indigo-900 text-white px-8 py-6">
                <div className="max-w-4xl mx-auto">
                    <p className="text-indigo-300 text-xs uppercase tracking-widest mb-1">Student Performance Tracker</p>
                    <h1 style={{ fontFamily: "'DM Serif Display', serif" }} className="text-3xl">
                        {student.studentName || "Student Dashboard"}
                    </h1>
                    {student.studentYear && (
                        <p className="text-indigo-300 text-sm mt-1">ชั้นปีที่ {student.studentYear}</p>
                    )}
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-8 py-8">

                {/* Stats */}
                <div className="grid grid-cols-4 gap-4 mb-8">
                    {[
                        { label: "งานทั้งหมด", value: assignments.length, color: "text-slate-800" },
                        { label: "ส่งงานแล้ว", value: submitted, color: "text-emerald-600" },
                        { label: "รอส่ง", value: pending, color: "text-amber-600" },
                        { label: "คะแนนเฉลี่ย", value: avgScore ?? "—", color: "text-indigo-600" },
                    ].map(s => (
                        <div key={s.label} className="bg-white border border-slate-200 rounded-2xl p-5 text-center shadow-sm">
                            <div className={`text-3xl font-bold ${s.color}`}>{s.value}</div>
                            <div className="text-xs text-slate-400 mt-2 uppercase tracking-wider">{s.label}</div>
                        </div>
                    ))}
                </div>

                {/* Assignment list */}
                <div className="space-y-4">
                    {assignments.map(a => {
                        const statusKey = getStatus(a);
                        const cfg = STATUS_CONFIG[statusKey] || STATUS_CONFIG.NOT_SUBMITTED;
                        const isSubmitting = submittingId === a.id;
                        const canSubmit = a.status === "NOT_SUBMITTED";

                        return (
                            <div key={a.id} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                                <div className="p-6">
                                    {/* Title row */}
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 flex-wrap">
                                                <h2 className="text-lg font-semibold text-slate-800">{a.title}</h2>
                                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${cfg.bg}`}>
                                                    {cfg.label}
                                                </span>
                                            </div>
                                            <p className="text-sm text-slate-500 mt-1">{a.description}</p>
                                        </div>

                                        {/* Score badge */}
                                        {a.score != null && (
                                            <div className="shrink-0 text-center bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-2">
                                                <div className="text-2xl font-bold text-indigo-700">{a.score}</div>
                                                <div className="text-xs text-indigo-400">/{a.maxScore}</div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Meta info */}
                                    <div className="flex gap-5 mt-3 text-xs text-slate-400 flex-wrap">
                                        <span>📅 กำหนดส่ง: <span className="text-slate-600 font-medium">{a.dueDate}</span></span>
                                        <span>🎯 คะแนนเต็ม: <span className="text-slate-600 font-medium">{a.maxScore}</span></span>
                                    </div>

                                    {/* Notes */}
                                    {a.teacherNote && (
                                        <div className="mt-4 bg-blue-50 border border-blue-100 rounded-xl p-3">
                                            <p className="text-xs font-semibold text-blue-700 mb-1">📝 โน้ตจากอาจารย์</p>
                                            <p className="text-sm text-blue-800">{a.teacherNote}</p>
                                        </div>
                                    )}
                                    {a.studentNote && (
                                        <div className="mt-2 bg-emerald-50 border border-emerald-100 rounded-xl p-3">
                                            <p className="text-xs font-semibold text-emerald-700 mb-1">💬 โน้ตของฉัน</p>
                                            <p className="text-sm text-emerald-800">{a.studentNote}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Submit section */}
                                {canSubmit && (
                                    <div className="border-t border-slate-100 bg-slate-50 px-6 py-4">
                                        {isSubmitting ? (
                                            <div className="space-y-3">
                                                <div>
                                                    <label className="block text-xs font-medium text-slate-500 mb-1">
                                                        โน้ตถึงอาจารย์ (ถ้ามี)
                                                    </label>
                                                    <textarea
                                                        value={studentNote}
                                                        onChange={e => setStudentNote(e.target.value)}
                                                        rows={2}
                                                        placeholder="เช่น ขอส่งงานช้าเพราะ... / งานชิ้นนี้ฉันทำ..."
                                                        className="w-full border border-slate-200 rounded-xl p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                                    />
                                                </div>
                                                <div className="flex gap-2">
                                                    <button onClick={() => handleSubmit(a.id)}
                                                        className="bg-indigo-600 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors">
                                                        ✅ ยืนยันส่งงาน
                                                    </button>
                                                    <button onClick={() => { setSubmittingId(null); setStudentNote(""); }}
                                                        className="bg-white border border-slate-200 text-slate-600 px-5 py-2 rounded-xl text-sm hover:bg-slate-100 transition-colors">
                                                        ยกเลิก
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <button onClick={() => setSubmittingId(a.id)}
                                                className="bg-indigo-600 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors">
                                                📤 ส่งงาน
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {assignments.length === 0 && (
                        <div className="text-center py-20 text-slate-400">
                            <div className="text-5xl mb-4">📚</div>
                            <p className="font-medium">ยังไม่มีงานที่ได้รับมอบหมาย</p>
                            <p className="text-sm mt-1">รอรับงานจากอาจารย์</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
