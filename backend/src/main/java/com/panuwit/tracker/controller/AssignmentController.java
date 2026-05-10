package com.panuwit.tracker.controller;

import com.panuwit.tracker.model.Assignment;
import com.panuwit.tracker.repository.AssignmentRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/assignments")
@CrossOrigin("*")
public class AssignmentController {

    private final AssignmentRepository repository;

    public AssignmentController(AssignmentRepository repository) {
        this.repository = repository;
    }

    // GET ALL
    @GetMapping
    public List<Assignment> getAll() {
        return repository.findAll();
    }

    // CREATE (Teacher)
    @PostMapping
    public Assignment create(@RequestBody Assignment assignment) {
        if (assignment.getStatus() == null) {
            assignment.setStatus("NOT_SUBMITTED");
        }
        return repository.save(assignment);
    }

    // UPDATE full (Teacher edits assignment details)
    @PutMapping("/{id}")
    public Assignment update(@PathVariable Long id, @RequestBody Assignment updated) {
        Assignment a = repository.findById(id).orElseThrow();
        a.setTitle(updated.getTitle());
        a.setDescription(updated.getDescription());
        a.setDueDate(updated.getDueDate());
        a.setMaxScore(updated.getMaxScore());
        a.setStudentName(updated.getStudentName());
        a.setStudentYear(updated.getStudentYear());
        if (updated.getStatus() != null) a.setStatus(updated.getStatus());
        if (updated.getScore() != null) a.setScore(updated.getScore());
        if (updated.getTeacherNote() != null) a.setTeacherNote(updated.getTeacherNote());
        if (updated.getStudentNote() != null) a.setStudentNote(updated.getStudentNote());
        return repository.save(a);
    }

    // SUBMIT (Student submits assignment + student note)
    @PatchMapping("/{id}/submit")
    public Assignment submit(@PathVariable Long id, @RequestBody Map<String, String> body) {
        Assignment a = repository.findById(id).orElseThrow();
        a.setStatus("SUBMITTED");
        a.setStudentNote(body.getOrDefault("studentNote", ""));
        return repository.save(a);
    }

    // GRADE (Teacher gives score + teacher note)
    @PatchMapping("/{id}/grade")
    public Assignment grade(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        Assignment a = repository.findById(id).orElseThrow();
        if (body.containsKey("score") && body.get("score") != null) {
            a.setScore(Double.parseDouble(body.get("score").toString()));
        }
        if (body.containsKey("teacherNote")) {
            a.setTeacherNote(body.get("teacherNote").toString());
        }
        return repository.save(a);
    }

    // DELETE (Teacher)
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repository.deleteById(id);
    }
}
