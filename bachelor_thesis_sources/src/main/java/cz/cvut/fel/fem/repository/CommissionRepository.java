package cz.cvut.fel.fem.repository;

import cz.cvut.fel.fem.model.Commission;
import cz.cvut.fel.fem.model.enums.CommissionState;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommissionRepository extends JpaRepository<Commission, Long> {

    @Query("select c from Commission c where (c.state = :commissionState)")
    List<Commission> getAllByState(@Param("commissionState") CommissionState commissionState);

    List<Commission> findByStateNot(CommissionState commissionState);

    Page<Commission> findByStateNot(CommissionState commissionState, Pageable pageable);

    Page<Commission> findByState(CommissionState commissionState, Pageable pageable);

    @Query(
            value = "SELECT * FROM Commission " +
                    "JOIN commission_teachers on Commission.id = commission_teachers.commission_list_id " +
                    "inner JOIN users as u ON u.id = commission_teachers.teachers_id " +
                    "where u.teacher is not null and u.id = :teacherId and Commission.state != :state",
            countQuery = "SELECT count(*) FROM Commission as com " +
                    "JOIN commission_teachers on com.id = commission_teachers.commission_list_id " +
                    "inner JOIN users as usr ON usr.id = commission_teachers.teachers_id " +
                    "where usr.teacher is not null and usr.id = :teacherId and com.state != :state",
            nativeQuery = true)
    Page<Commission> findByTeacherIdAndStateNot(@Param("teacherId") Long teacherId,
                                                @Param("state") String state,
                                                Pageable pageable);


}
