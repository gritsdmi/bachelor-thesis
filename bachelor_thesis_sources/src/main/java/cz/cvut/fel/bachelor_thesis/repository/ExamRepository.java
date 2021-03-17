package cz.cvut.fel.bachelor_thesis.repository;

import cz.cvut.fel.bachelor_thesis.model.Exam;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExamRepository extends JpaRepository<Exam, Long> {

    //    @Query("select t from Teacher t where (t.name = :pattern or t.surname = :pattern)")
//todo test
    @Query("select e from Exam e where (e.date.date =:date)")
    List<Exam> getAllByDate(@Param("date") String date);
}
