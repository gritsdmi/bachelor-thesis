package cz.cvut.fel.fem.repository;

import cz.cvut.fel.fem.model.Location;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LocationRepository extends JpaRepository<Location, Long> {
    //todo 'query method'

    @Query(
            value = "SELECT * FROM Exam e " +
                    "NATURAL JOIN Location l " +
                    "WHERE not (e.date_id = ?1)",
            nativeQuery = true)
    List<Location> getFree(Long dateId);

    //    @Query("select t from Teacher t where (t.contract is not null and t.contract > 0)")

//    SELECT location_id
//    FROM Exam NATURAL JOIN Location
//    WHERE NOT(exam.date_id == '15')

}
