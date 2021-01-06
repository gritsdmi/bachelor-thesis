package cz.cvut.fel.bachelor_thesis.repository;

import cz.cvut.fel.bachelor_thesis.model.Exam;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExamRepository extends JpaRepository<Exam, Long> {
}
