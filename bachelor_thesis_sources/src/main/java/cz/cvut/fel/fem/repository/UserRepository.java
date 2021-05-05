package cz.cvut.fel.fem.repository;

import cz.cvut.fel.fem.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    List<User> findByActiveTrue();

    Optional<User> findByLoginAndActiveTrue(String login);

    Page<User> findByActiveTrueAndTeacherNotNull(Pageable pageable);

    @Query("select u from User u where (u.active = true and u.teacher.contract is not null and u.teacher.contract > 0)")
    List<User> getTeachersWhoCan();

    @Query("select u from User u where (u.active = true and u.name = :pattern or u.surname = :pattern or u.login = :pattern)")
    List<User> getAllByName(@Param("pattern") String pattern);

    /**
     * get all teachers
     */
    @Query("select u from User u where (u.active = true and u.teacher is not null)")
    List<User> getAllTeachers();

    /**
     * get teacher by id
     */
    User getUserByIdAndTeacherNotNull(Long id);

    @Query("select u from User u where (u.teacher is not null " +
            "and (lower(u.name) like lower(concat('%',:pattern,'%')) " +
            "or lower(u.surname) like lower(concat('%',:pattern,'%')) " +
            "or lower(u.login) like lower(concat('%',:pattern,'%')) ))")
    Page<User> findTeacherByNameOrSurnameOrLoginContaining(@Param("pattern") String pattern, Pageable Pageable);

    @Query("SELECT u FROM User u WHERE (u.id IN :ids " +
            "and (lower(u.name) like lower(concat('%',:pattern,'%')) " +
            "or lower(u.surname) like lower(concat('%',:pattern,'%')) " +
            "or lower(u.login) like lower(concat('%',:pattern,'%')) ))")
    Page<User> getUsersByIdByPatternPaged(@Param("ids") Collection<Long> ids,
                                          @Param("pattern") String pattern,
                                          Pageable Pageable);

    @Query("SELECT u FROM User u WHERE u.id IN :ids")
    Page<User> getUsersByIdPaged(@Param("ids") Collection<Long> ids, Pageable Pageable);
}
