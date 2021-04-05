package cz.cvut.fel.fem.services;

import cz.cvut.fel.fem.model.Date;
import cz.cvut.fel.fem.repository.DateRepository;
import cz.cvut.fel.fem.to.DateTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DateService {

    @Autowired
    private DateRepository dateRepository;

    public List<Date> getAll() {
        return dateRepository.findAll();
    }

    public Date get(Long dateId) {
        return dateRepository.getOne(dateId);
    }

    public Date save(DateTO dateTO) {
        var date = new Date();
        date.setDate(dateTO.getDate());
//        date.setSemester(dateTO.getSemester());

        return dateRepository.save(date);
    }

    public Date create(String date) {
        var dateNew = new Date();
        dateNew.setDate(date);
        return dateRepository.save(dateNew);

    }

    public Date update(Long dateId, DateTO dateTO) {
        var date = dateRepository.getOne(dateId);

        date.setDate(dateTO.getDate());
//        date.setSemester(dateTO.getSemester());

        return dateRepository.save(date);
    }

    public void delete(Date date) {
        dateRepository.delete(date);
    }

    public void delete(Long id) {
        dateRepository.deleteById(id);
    }
}
