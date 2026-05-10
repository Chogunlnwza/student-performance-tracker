import { useEffect, useState } from "react";
import API from "../services/api";

const STATUS_CONFIG = {
    NOT_SUBMITTED: { label: "ยังไม่ส่ง", bg: "bg-amber-100 text-amber-800 border-amber-200" },
    SUBMITTED:     { label: "ส่งแล้ว",  bg: "bg-emerald-100 text-emerald-800 border-emerald-200" },
    LATE:          { label: "ส่งช้า",   bg: "bg-red-100 text-red-800 border-red-200" },
};

const INITIAL_FORM = {
    title: "", description: "", dueDate: "",
    studentName: "", studentYear: 1, maxScore: 100,
};

export default function Dashboard() {
    const [assignments, setAssignments] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState(INITIAL_FORM);
    const [showForm, setShowForm] = useState(false);
    const [gradingMap, setGradingMap] = useState({});

    useEffect(() => { fetchAll(); }, []);

    const fetchAll = async () => {
        try { setAssignments((await API.get("/assignments")).data); }
        catch (e) { console.error(e); }
    };

    const handleChange = (e) =>
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmitForm = async (e) => {
        e.preventDefault();
        try {
            editingId
                ? await API.put(`/assignments/${editingId}`, formData)
                : await API.post("/assignments", formData);
            fetchAll();
            setEditingId(null); setFormData(INITIAL_FORM); setShowForm(false);
        } catch (e) { console.error(e); }
    };

    const handleEdit = (a) => {
        setFormData({ title: a.title, description: a.description, dueDate: a.dueDate,
            studentName: a.studentName || "", studentYear: a.studentYear || 1, maxScore: a.maxScore || 100 });
        setEditingId(a.id); setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("ต้องการลบงานนี้?")) return;
        try { await API.delete(`/assignments/${id}`); fetchAll(); }
        catch (e) { console.error(e); }
    };

    const startGrading = (a) =>
        setGradingMap(prev => ({ ...prev, [a.id]: { score: a.score ?? "", teacherNote: a.teacherNote ?? "" } }));

    const cancelGrading = (id) =>
        setGradingMap(prev => { const n = { ...prev }; delete n[id]; return n; });

    const handleGradeChange = (id, field, val) =>
        setGradingMap(prev => ({ ...prev, [id]: { ...prev[id], [field]: val } }));

    const handleGradeSubmit = async (id) => {
        const g = gradingMap[id] || {};
        try {
            await API.patch(`/assignments/${id}/grade`, { score: g.score, teacherNote: g.teacherNote });
            fetchAll(); cancelGrading(id);
        } catch (e) { console.error(e); }
    };

    const submitted = assignments.filter(a => a.status === "SUBMITTED").length;
    const graded = assignments.filter(a => a.score != null).length;

    return (
        <div style={{ fontFamily: "'DM Sans', sans-serif" }} className="min-h-screen bg-slate-50">
            <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display&display=swap" rel="stylesheet" />

            {/* Header */}
            <div className="bg-slate-900 text-white px-8 py-6">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <div>
                        <p className="text-slate-400 text-xs uppercase tracking-widest mb-1">Student Performance Tracker</p>
                        <h1 style={{ fontFamily: "'DM Serif Display', serif" }} className="text-3xl">
                            Teacher Dashboard
                        </h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right text-sm text-slate-400">
                            <div>{assignments.length} งาน · {submitted} ส่งแล้ว · {graded} ให้คะแนนแล้ว</div>
                        </div>
                        <button
                            onClick={() => { setShowForm(!showForm); setEditingId(null); setFormData(INITIAL_FORM); }}
                            className="bg-amber-400 text-slate-900 font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-amber-300 transition-colors"
                        >
                            {showForm ? "✕ ปิด" : "+ เพิ่มงาน"}
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-8 py-8">

                {/* Create / Edit Form */}
                {showForm && (
                    <form onSubmit={handleSubmitForm} className="bg-white border border-slate-200 rounded-2xl p-6 mb-8 shadow-sm">
                        <h2 className="text-lg font-semibold text-slate-800 mb-5">
                            {editingId ? "✏️ แก้ไขงาน" : "📋 สร้างงานใหม่"}
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="block text-xs font-medium text-slate-500 mb-1">ชื่องาน *</label>
                                <input type="text" name="title" value={formData.title} onChange={handleChange}
                                    className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" required />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-xs font-medium text-slate-500 mb-1">รายละเอียดงาน *</label>
                                <textarea name="description" value={formData.description} onChange={handleChange} rows={3}
                                    className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none" required />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">วันกำหนดส่ง *</label>
                                <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange}
                                    className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" required />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">คะแนนเต็ม</label>
                                <input type="number" name="maxScore" value={formData.maxScore} onChange={handleChange} min={1}
                                    className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">ชื่อนักศึกษา</label>
                                <input type="text" name="studentName" value={formData.studentName} onChange={handleChange}
                                    placeholder="ชื่อ-นามสกุล"
                                    className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">ชั้นปี</label>
                                <select name="studentYear" value={formData.studentYear} onChange={handleChange}
                                    className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400">
                                    {[1, 2, 3, 4].map(y => <option key={y} value={y}>ปีที่ {y}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-5">
                            <button type="submit"
                                className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-700 transition-colors">
                                {editingId ? "บันทึกการแก้ไข" : "สร้างงาน"}
                            </button>
                            <button type="button" onClick={() => setShowForm(false)}
                                className="bg-slate-100 text-slate-600 px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-200 transition-colors">
                                ยกเลิก
                            </button>
                        </div>
                    </form>
                )}

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    {[
                        { label: "งานทั้งหมด", value: assignments.length, color: "text-slate-800" },
                        { label: "ส่งงานแล้ว", value: submitted, color: "text-emerald-600" },
                        { label: "ยังไม่ส่ง", value: assignments.length - submitted, color: "text-amber-600" },
                    ].map(s => (
                        <div key={s.label} className="bg-white border border-slate-200 rounded-2xl p-5 text-center shadow-sm">
                            <div className={`text-4xl font-bold ${s.color}`}>{s.value}</div>
                            <div className="text-xs text-slate-400 mt-2 uppercase tracking-wider">{s.label}</div>
                        </div>
                    ))}
                </div>

                {/* Assignment Cards */}
                <div className="space-y-4">
                    {assignments.map(a => {
                        const cfg = STATUS_CONFIG[a.status] || STATUS_CONFIG.NOT_SUBMITTED;
                        const g = gradingMap[a.id];
                        const isGrading = g !== undefined;

                        return (
                            <div key={a.id} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                                <div className="p-6">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 flex-wrap">
                                                <h2 className="text-lg font-semibold text-slate-800">{a.title}</h2>
                                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${cfg.bg}`}>
                                                    {cfg.label}
                                                </span>
                                                {a.score != null && (
                                                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium border bg-indigo-100 text-indigo-700 border-indigo-200">
                                                        ✅ {a.score}/{a.maxScore} คะแนน
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-slate-500 mt-1">{a.description}</p>
                                            <div className="flex gap-5 mt-3 text-xs text-slate-400 flex-wrap">
                                                <span>👤 {a.studentName || "—"} · ปีที่ {a.studentYear || "—"}</span>
                                                <span>📅 กำหนดส่ง {a.dueDate}</span>
                                                <span>🎯 คะแนนเต็ม {a.maxScore}</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 shrink-0">
                                            <button onClick={() => handleEdit(a)}
                                                className="bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-slate-200 transition-colors">
                                                แก้ไข
                                            </button>
                                            <button onClick={() => handleDelete(a.id)}
                                                className="bg-red-50 text-red-600 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-red-100 transition-colors">
                                                ลบ
                                            </button>
                                        </div>
                                    </div>

                                    {/* Notes from student */}
                                    {a.studentNote && (
                                        <div className="mt-4 bg-emerald-50 border border-emerald-100 rounded-xl p-3">
                                            <p className="text-xs font-semibold text-emerald-700 mb-1">💬 โน้ตจากนักศึกษา</p>
                                            <p className="text-sm text-emerald-800">{a.studentNote}</p>
                                        </div>
                                    )}
                                    {/* Notes from teacher */}
                                    {a.teacherNote && (
                                        <div className="mt-2 bg-blue-50 border border-blue-100 rounded-xl p-3">
                                            <p className="text-xs font-semibold text-blue-700 mb-1">📝 โน้ตอาจารย์</p>
                                            <p className="text-sm text-blue-800">{a.teacherNote}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Grading section — available when SUBMITTED */}
                                {a.status === "SUBMITTED" && (
                                    <div className="border-t border-slate-100 bg-slate-50 px-6 py-4">
                                        {isGrading ? (
                                            <div className="space-y-3">
                                                <div className="flex gap-3 items-end">
                                                    <div>
                                                        <label className="block text-xs font-medium text-slate-500 mb-1">
                                                            คะแนน (จาก {a.maxScore})
                                                        </label>
                                                        <input type="number" value={g.score}
                                                            onChange={e => handleGradeChange(a.id, "score", e.target.value)}
                                                            min={0} max={a.maxScore}
                                                            className="w-28 border border-slate-200 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                                                            placeholder="0" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <label className="block text-xs font-medium text-slate-500 mb-1">โน้ตอาจารย์</label>
                                                        <input type="text" value={g.teacherNote}
                                                            onChange={e => handleGradeChange(a.id, "teacherNote", e.target.value)}
                                                            className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                                                            placeholder="ความคิดเห็น..." />
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button onClick={() => handleGradeSubmit(a.id)}
                                                        className="bg-slate-900 text-white px-4 py-2 rounded-lg text-xs font-medium hover:bg-slate-700 transition-colors">
                                                        บันทึกคะแนน
                                                    </button>
                                                    <button onClick={() => cancelGrading(a.id)}
                                                        className="bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-lg text-xs font-medium hover:bg-slate-100 transition-colors">
                                                        ยกเลิก
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <button onClick={() => startGrading(a)}
                                                className="bg-amber-400 text-slate-900 px-4 py-2 rounded-lg text-xs font-semibold hover:bg-amber-300 transition-colors">
                                                ✏️ {a.score != null ? "แก้ไขคะแนน" : "ให้คะแนน"}
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {assignments.length === 0 && (
                        <div className="text-center py-20 text-slate-400">
                            <div className="text-5xl mb-4">📋</div>
                            <p className="font-medium">ยังไม่มีงานที่มอบหมาย</p>
                            <p className="text-sm mt-1">กด + เพิ่มงาน เพื่อเริ่มต้น</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
