package cz.cvut.fel.bachelor_thesis.repository;

import cz.cvut.fel.bachelor_thesis.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    @Query("select u from User u where (u.teacher.contract is not null and u.teacher.contract > 0)")
    List<User> getTeachersWhoCan();

    @Query("select u from User u where (u.name = :pattern or u.surname = :pattern)")
    List<User> getAllByName(@Param("pattern") String pattern);

    /**
     * get all teachers
     */
    @Query("select u from User u where (u.teacher is not null)")
    List<User> getAllTeachers();

    /**
     * get teacher by id
     */
    User getUserByIdAndTeacherNotNull(Long id);
}
