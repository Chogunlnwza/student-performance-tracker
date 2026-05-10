package com.panuwit.tracker.repository;

import com.panuwit.tracker.model.Assignment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AssignmentRepository
        extends JpaRepository<Assignment, Long> {
}