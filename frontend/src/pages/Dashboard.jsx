import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-hot-toast";
import { PieChart, Pie, Cell, Tooltip as PieTooltip, ResponsiveContainer } from "recharts";

const STATUS_CONFIG = {
    NOT_SUBMITTED: { label: "ยังไม่ส่ง", bg: "bg-amber-100 text-amber-800 border-amber-200" },
    SUBMITTED:     { label: "ส่งแล้ว",  bg: "bg-emerald-100 text-emerald-800 border-emerald-200" },
    LATE:          { label: "ส่งช้า",   bg: "bg-red-100 text-red-800 border-red-200" },
};

const INITIAL_FORM = {
    title: "", description: "", dueDate: "",
    studentName: "สมชาย", studentYear: 2, maxScore: 100,
};

export default function Dashboard() {
    const navigate = useNavigate();
    const [assignments, setAssignments] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState(INITIAL_FORM);
    const [showForm, setShowForm] = useState(false);
    const [gradingMap, setGradingMap] = useState({});

    const role = localStorage.getItem("role");

    useEffect(() => { 
        if (role !== "teacher") {
            navigate("/");
            return;
        }
        fetchAll(); 
    }, [role, navigate]);

    const fetchAll = async () => {
        try { 
            const res = await API.get("/assignments");
            setAssignments(res.data);
        } catch (e) { 
            console.error(e); 
            toast.error("ดึงข้อมูลล้มเหลว");
        }
    };

    const handleChange = (e) =>
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmitForm = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await API.put(`/assignments/${editingId}`, formData);
                toast.success("แก้ไขงานสำเร็จ");
            } else {
                await API.post("/assignments", formData);
                toast.success("สร้างงานสำเร็จ");
            }
            fetchAll();
            setEditingId(null); setFormData(INITIAL_FORM); setShowForm(false);
        } catch (e) { 
            console.error(e); 
            toast.error("บันทึกข้อมูลล้มเหลว");
        }
    };

    const handleEdit = (a) => {
        setFormData({ title: a.title, description: a.description, dueDate: a.dueDate,
            studentName: a.studentName || "สมชาย", studentYear: a.studentYear || 2, maxScore: a.maxScore || 100 });
        setEditingId(a.id); setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("ต้องการลบงานนี้?")) return;
        try { 
            await API.delete(`/assignments/${id}`); 
            toast.success("ลบงานสำเร็จ");
            fetchAll(); 
        } catch (e) { 
            console.error(e); 
            toast.error("ลบข้อมูลล้มเหลว");
        }
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
            toast.success("บันทึกคะแนนสำเร็จ");
            fetchAll(); cancelGrading(id);
        } catch (e) { 
            console.error(e); 
            toast.error("บันทึกคะแนนล้มเหลว");
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    const submitted = assignments.filter(a => a.status === "SUBMITTED").length;
    const graded = assignments.filter(a => a.score != null).length;
    const pending = assignments.length - submitted;

    const pieData = [
        { name: "ส่งแล้ว", value: submitted, color: "#10b981" },
        { name: "ยังไม่ส่ง", value: pending, color: "#f59e0b" },
    ].filter(d => d.value > 0);

    return (
        <div style={{ fontFamily: "'DM Sans', sans-serif" }} className="min-h-screen bg-slate-50/50">
            <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display&display=swap" rel="stylesheet" />

            {/* Header */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white px-8 py-10 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500 opacity-5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
                <div className="max-w-5xl mx-auto flex items-center justify-between relative z-10 animate-fade-in">
                    <div>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Student Performance Tracker</p>
                        <h1 style={{ fontFamily: "'DM Serif Display', serif" }} className="text-4xl tracking-wide drop-shadow-md">
                            Teacher Dashboard
                        </h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => { setShowForm(!showForm); setEditingId(null); setFormData(INITIAL_FORM); }}
                            className="bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 font-bold px-6 py-3 rounded-2xl text-sm hover:shadow-lg hover:shadow-amber-500/20 hover:-translate-y-0.5 active:scale-95 transition-all"
                        >
                            {showForm ? "✕ ปิดหน้าต่าง" : "➕ เพิ่มงาน/การสอบ"}
                        </button>
                        <button onClick={handleLogout} className="bg-slate-800/50 hover:bg-slate-700 text-white px-5 py-3 rounded-2xl text-sm font-medium transition-all backdrop-blur-sm border border-slate-700 active:scale-95">
                            ออกจากระบบ
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-8 py-10 animate-slide-up">

                <div className="flex gap-8 mb-10">
                    {/* Stats */}
                    <div className="flex-1 grid grid-cols-2 gap-5">
                        {[
                            { label: "งานทั้งหมด", value: assignments.length, color: "text-slate-800", icon: "📚" },
                            { label: "ตรวจแล้ว", value: graded, color: "text-indigo-600", icon: "✅" },
                            { label: "ส่งงานแล้ว", value: submitted, color: "text-emerald-600", icon: "📥" },
                            { label: "ยังไม่ส่ง", value: pending, color: "text-amber-500", icon: "⏳" },
                        ].map((s, i) => (
                            <div key={s.label} className="bg-white border border-slate-100 rounded-3xl p-6 text-center shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-center relative overflow-hidden" style={{ animationDelay: `${i * 100}ms` }}>
                                <div className="absolute -right-4 -bottom-4 text-6xl opacity-[0.03]">{s.icon}</div>
                                <div className="flex items-center justify-center gap-3 mb-2">
                                    <span className="text-2xl">{s.icon}</span>
                                    <div className={`text-4xl font-bold ${s.color} tracking-tight`}>{s.value}</div>
                                </div>
                                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">{s.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Chart */}
                    {assignments.length > 0 && (
                        <div className="w-72 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col">
                            <h3 className="text-sm font-bold text-slate-700 text-center mb-4 uppercase tracking-wide">📊 สัดส่วนการส่งงาน</h3>
                            <div className="flex-1 min-h-[160px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={5} dataKey="value" stroke="none">
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <PieTooltip 
                                            contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: 600, fontSize: '13px'}}
                                            itemStyle={{color: '#334155'}}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )}
                </div>

                {/* Create / Edit Form */}
                {showForm && (
                    <form onSubmit={handleSubmitForm} className="bg-white border border-indigo-100 rounded-3xl p-8 mb-10 shadow-xl shadow-indigo-900/5 animate-fade-in relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-amber-500"></div>
                        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                            <span className="bg-amber-100 text-amber-600 p-2 rounded-xl">{editingId ? "✏️" : "📋"}</span>
                            {editingId ? "แก้ไขงาน" : "สร้างงาน/การสอบใหม่"}
                        </h2>
                        <div className="grid grid-cols-2 gap-5">
                            <div className="col-span-2">
                                <label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wide">ชื่องาน/การสอบ *</label>
                                <input type="text" name="title" value={formData.title} onChange={handleChange}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all" required />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wide">รายละเอียด *</label>
                                <textarea name="description" value={formData.description} onChange={handleChange} rows={3}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all resize-none" required />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wide">วันกำหนดส่ง *</label>
                                <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all" required />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wide">คะแนนเต็ม</label>
                                <input type="number" name="maxScore" value={formData.maxScore} onChange={handleChange} min={1}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wide">ชื่อนักศึกษาเป้าหมาย</label>
                                <input type="text" name="studentName" value={formData.studentName} onChange={handleChange}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wide">ชั้นปี</label>
                                <select name="studentYear" value={formData.studentYear} onChange={handleChange}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all appearance-none">
                                    {[1, 2, 3, 4].map(y => <option key={y} value={y}>ปีที่ {y}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-4 mt-8 pt-6 border-t border-slate-100">
                            <button type="submit"
                                className="bg-slate-900 text-white px-8 py-3.5 rounded-2xl text-sm font-bold shadow-lg hover:bg-slate-800 hover:-translate-y-0.5 active:scale-95 transition-all">
                                {editingId ? "บันทึกการแก้ไข" : "ยืนยันการสร้างงาน"}
                            </button>
                            <button type="button" onClick={() => setShowForm(false)}
                                className="bg-white border border-slate-200 text-slate-600 px-8 py-3.5 rounded-2xl text-sm font-bold shadow-sm hover:bg-slate-50 transition-all">
                                ยกเลิก
                            </button>
                        </div>
                    </form>
                )}

                {/* Assignment Cards */}
                <div className="space-y-5">
                    {assignments.map(a => {
                        const cfg = STATUS_CONFIG[a.status] || STATUS_CONFIG.NOT_SUBMITTED;
                        const g = gradingMap[a.id];
                        const isGrading = g !== undefined;

                        return (
                            <div key={a.id} className="bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group">
                                <div className="p-7">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 flex-wrap mb-2">
                                                <h2 className="text-xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{a.title}</h2>
                                                <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide border ${cfg.bg}`}>
                                                    {cfg.label}
                                                </span>
                                                {a.score != null && (
                                                    <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase border bg-indigo-50 text-indigo-600 border-indigo-200 flex items-center gap-1">
                                                        ✅ {a.score}/{a.maxScore} คะแนน
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-slate-500 leading-relaxed mb-4">{a.description}</p>
                                            <div className="flex gap-6 mt-4 text-xs text-slate-400 flex-wrap bg-slate-50 p-4 rounded-2xl">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-lg">👤</span>
                                                    <span className="font-semibold text-slate-600">{a.studentName || "—"} <span className="text-slate-400 font-normal">· ปีที่ {a.studentYear || "—"}</span></span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-lg">📅</span>
                                                    <span className="font-semibold text-slate-600">ส่ง: <span className="text-slate-700">{a.dueDate}</span></span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-lg">🎯</span>
                                                    <span className="font-semibold text-slate-600">เต็ม: <span className="text-slate-700">{a.maxScore}</span></span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleEdit(a)}
                                                className="bg-slate-100 text-slate-600 px-4 py-2 rounded-xl text-xs font-bold hover:bg-slate-200 hover:text-slate-800 transition-all">
                                                ✏️ แก้ไข
                                            </button>
                                            <button onClick={() => handleDelete(a.id)}
                                                className="bg-red-50 text-red-600 px-4 py-2 rounded-xl text-xs font-bold hover:bg-red-100 hover:text-red-700 transition-all">
                                                🗑️ ลบ
                                            </button>
                                        </div>
                                    </div>

                                    {/* Notes from student */}
                                    {a.studentNote && (
                                        <div className="mt-5 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100/50 rounded-2xl p-4">
                                            <p className="text-xs font-bold text-emerald-700 mb-2 uppercase tracking-wide flex items-center gap-2">💬 โน้ตจากนักศึกษา</p>
                                            <p className="text-sm text-emerald-900/80 leading-relaxed font-medium">{a.studentNote}</p>
                                        </div>
                                    )}
                                    {/* Notes from teacher */}
                                    {a.teacherNote && (
                                        <div className="mt-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100/50 rounded-2xl p-4">
                                            <p className="text-xs font-bold text-blue-700 mb-2 uppercase tracking-wide flex items-center gap-2">📝 โน้ตอาจารย์</p>
                                            <p className="text-sm text-blue-900/80 leading-relaxed font-medium">{a.teacherNote}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Grading section — available when SUBMITTED */}
                                {a.status === "SUBMITTED" && (
                                    <div className="bg-slate-50/80 border-t border-slate-100 px-7 py-5">
                                        {isGrading ? (
                                            <div className="space-y-4 animate-fade-in">
                                                <div className="flex gap-4 items-start">
                                                    <div className="w-32">
                                                        <label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wide">
                                                            คะแนน <span className="text-slate-400 font-normal">/{a.maxScore}</span>
                                                        </label>
                                                        <input type="number" value={g.score}
                                                            onChange={e => handleGradeChange(a.id, "score", e.target.value)}
                                                            min={0} max={a.maxScore}
                                                            className="w-full bg-white border border-slate-200 rounded-2xl p-3.5 text-center text-lg font-bold text-indigo-600 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all shadow-sm"
                                                            placeholder="0" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wide">โน้ตประเมินถึงนักศึกษา</label>
                                                        <input type="text" value={g.teacherNote}
                                                            onChange={e => handleGradeChange(a.id, "teacherNote", e.target.value)}
                                                            className="w-full bg-white border border-slate-200 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all shadow-sm"
                                                            placeholder="เช่น ทำได้ดีมาก แต่ข้อ 2 ยังมีข้อผิดพลาดเล็กน้อย..." />
                                                    </div>
                                                </div>
                                                <div className="flex gap-3">
                                                    <button onClick={() => handleGradeSubmit(a.id)}
                                                        className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-xl text-sm font-bold shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5 active:scale-95 transition-all">
                                                        ✅ บันทึกประเมินผล
                                                    </button>
                                                    <button onClick={() => cancelGrading(a.id)}
                                                        className="flex-1 bg-white border border-slate-200 text-slate-600 py-3 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-50 transition-all">
                                                        ยกเลิก
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <button onClick={() => startGrading(a)}
                                                className="w-full bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 py-4 rounded-2xl text-sm font-bold shadow-md hover:shadow-lg hover:shadow-amber-500/20 hover:-translate-y-0.5 active:scale-95 transition-all flex items-center justify-center gap-2">
                                                <span>✏️</span> {a.score != null ? "แก้ไขคะแนนและโน้ต" : "เริ่มการประเมิน / ให้คะแนน"}
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {assignments.length === 0 && (
                        <div className="text-center py-24 bg-white border border-dashed border-slate-300 rounded-3xl animate-fade-in">
                            <div className="text-6xl mb-6">📋</div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">ยังไม่มีงาน/การสอบที่มอบหมาย</h3>
                            <p className="text-slate-500 font-medium">กดปุ่ม ➕ เพิ่มงาน/การสอบ ด้านบนเพื่อเริ่มต้น</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
