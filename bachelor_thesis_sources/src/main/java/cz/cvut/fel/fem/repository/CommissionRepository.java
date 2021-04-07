package cz.cvut.fel.fem.repository;

import cz.cvut.fel.fem.model.Commission;
import cz.cvut.fel.fem.model.enums.CommissionState;
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

//    @Query("select c from Commission c where(c)")
//    List<Commission> findByTeacherId(Long teacherId);
}