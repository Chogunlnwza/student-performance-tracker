const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// In-memory data store for the MVP
let assignments = [
    {
        id: 1,
        title: "Homework 1: Math",
        description: "Solve problems 1-10",
        dueDate: "2026-06-01",
        maxScore: 10,
        studentName: "สมชาย",
        studentYear: 2,
        status: "NOT_SUBMITTED",
        score: null,
        teacherNote: "",
        studentNote: ""
    }
];
let nextId = 2;

// Get assignments, optionally filter by studentName
app.get('/api/assignments', (req, res) => {
    const { studentName } = req.query;
    if (studentName) {
        const filtered = assignments.filter(a => 
            a.studentName && a.studentName.toLowerCase() === studentName.toLowerCase()
        );
        return res.json(filtered);
    }
    res.json(assignments);
});

// Create new assignment
app.post('/api/assignments', (req, res) => {
    const a = {
        ...req.body,
        id: nextId++,
        status: req.body.status || "NOT_SUBMITTED",
        score: req.body.score || null,
        teacherNote: req.body.teacherNote || "",
        studentNote: req.body.studentNote || ""
    };
    assignments.push(a);
    res.status(201).json(a);
});

// Full update
app.put('/api/assignments/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = assignments.findIndex(a => a.id === id);
    if (index === -1) return res.status(404).send("Not found");
    
    assignments[index] = { ...assignments[index], ...req.body, id };
    res.json(assignments[index]);
});

// Submit assignment
app.patch('/api/assignments/:id/submit', (req, res) => {
    const id = parseInt(req.params.id);
    const index = assignments.findIndex(a => a.id === id);
    if (index === -1) return res.status(404).send("Not found");
    
    assignments[index].status = "SUBMITTED";
    assignments[index].studentNote = req.body.studentNote || "";
    res.json(assignments[index]);
});

// Grade assignment
app.patch('/api/assignments/:id/grade', (req, res) => {
    const id = parseInt(req.params.id);
    const index = assignments.findIndex(a => a.id === id);
    if (index === -1) return res.status(404).send("Not found");
    
    if (req.body.score !== undefined) assignments[index].score = parseFloat(req.body.score);
    if (req.body.teacherNote !== undefined) assignments[index].teacherNote = req.body.teacherNote;
    
    res.json(assignments[index]);
});

// Delete assignment
app.delete('/api/assignments/:id', (req, res) => {
    const id = parseInt(req.params.id);
    assignments = assignments.filter(a => a.id !== id);
    res.status(204).send();
});

// Fallback for direct execution
if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`API running on port ${PORT}`));
}

// Export for Vercel
module.exports = app;
