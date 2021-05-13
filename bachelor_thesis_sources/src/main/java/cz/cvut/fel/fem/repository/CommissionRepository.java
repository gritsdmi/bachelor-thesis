package cz.cvut.fel.fem.repository;

import cz.cvut.fel.fem.model.Commission;
import cz.cvut.fel.fem.model.enums.CommissionState;
import cz.cvut.fel.fem.model.enums.Degree;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

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

    //request with all degrees and all fields
    @Query("select c from Commission c where (c.exam.date in :dates and c.id in :ids)")
    Page<Commission> getByAllDegreesAndAllFieldsPaginated(
            @Param("dates") List<String> dates,
            @Param("ids") List<Long> ids,
            Pageable pageable);

    // request with selected degree and all fields according to this degree
    @Query(
            value = "select com from Commission com where (com.exam.date in :dates and com.id in :ids " +
                    "and com.exam.degree = :degree)"
    )
    Page<Commission> getByDegreeAndAllFieldsPaginated(@Param("dates") List<String> dates,
                                                      @Param("ids") List<Long> ids,
                                                      @Param("degree") Degree degree,
                                                      Pageable pageable);

    // request specified degree and field of study
    @Query(
            value = "select com from Commission com where (com.exam.date in :dates and com.id in :ids " +
                    "and com.exam.degree = :degree " +
                    "and com.exam.fieldOfStudy = :fieldOfStudy)"
    )
    Page<Commission> getByDegreeAndFieldPaginated(@Param("dates") List<String> dates,
                                                  @Param("ids") List<Long> ids,
                                                  @Param("degree") Degree degree,
                                                  @Param("fieldOfStudy") String fieldOfStudy,
                                                  Pageable pageable);


    //request with all degrees and all fields BY SEMESTER
    @Query("select c from Commission c where (c.exam.semester = :semester and c.id in :ids)")
    Page<Commission> getByAllDegreesAndAllFieldsBySemesterPaginated(
            @Param("semester") String semester,
            @Param("ids") List<Long> ids,
            Pageable pageable);

    // request with selected degree and all fields according to this degree BY SEMESTER
    @Query(
            value = "select com from Commission com where (com.exam.semester = :semester and com.id in :ids " +
                    "and com.exam.degree = :degree)"
    )
    Page<Commission> getByDegreeAndAllFieldsBySemesterPaginated(
            @Param("semester") String semester,
            @Param("ids") List<Long> ids,
            @Param("degree") Degree degree,
            Pageable pageable);

    // request specified degree and field of study BY SEMESTER
    @Query(
            value = "select com from Commission com where (com.exam.semester = :semester and com.id in :ids " +
                    "and com.exam.degree = :degree " +
                    "and com.exam.fieldOfStudy = :fieldOfStudy)"
    )
    Page<Commission> getByDegreeAndFieldBySemesterPaginated(
            @Param("semester") String semester,
            @Param("ids") List<Long> ids,
            @Param("degree") Degree degree,
            @Param("fieldOfStudy") String fieldOfStudy,
            Pageable pageable);

    @Transactional
    @Modifying
    @Query(value = "Delete from Commission c where c.state= :state")
    void deleteAllDrafts(@Param("state") CommissionState state);
}
