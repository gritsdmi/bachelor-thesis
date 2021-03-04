package cz.cvut.fel.bachelor_thesis.services;

import cz.cvut.fel.bachelor_thesis.model.Date;
import cz.cvut.fel.bachelor_thesis.repository.DateRepository;
import cz.cvut.fel.bachelor_thesis.to.DateTO;
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
        date.setDay(dateTO.getDay());
        date.setMonth(dateTO.getMonth());
        date.setYear(dateTO.getYear());
        date.setSemester(dateTO.getSemester());

        return dateRepository.save(date);
    }

    public Date update(Long dateId, DateTO dateTO) {
        var date = dateRepository.getOne(dateId);

        date.setDay(dateTO.getDay());
        date.setMonth(dateTO.getMonth());
        date.setYear(dateTO.getYear());
        date.setSemester(dateTO.getSemester());

        return dateRepository.save(date);
    }

    public void delete(Date date) {
        dateRepository.delete(date);
    }

    public void delete(Long id) {
        dateRepository.deleteById(id);
    }
}