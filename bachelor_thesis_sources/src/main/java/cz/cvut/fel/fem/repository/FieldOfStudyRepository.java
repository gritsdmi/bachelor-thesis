package cz.cvut.fel.fem.repository;

import cz.cvut.fel.fem.model.FieldOfStudy;
import cz.cvut.fel.fem.model.enums.Degree;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FieldOfStudyRepository extends JpaRepository<FieldOfStudy, Long> {

    List<FieldOfStudy> findByDegree(Degree degree);
}
