package cz.cvut.fel.fem.repository;

import cz.cvut.fel.fem.model.Date;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DateRepository extends JpaRepository<Date, Long> {

    List<Date> findByDate(String date);
}
