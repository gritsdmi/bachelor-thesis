package cz.cvut.fel.bachelor_thesis.services;

import cz.cvut.fel.bachelor_thesis.model.FieldOfStudy;
import cz.cvut.fel.bachelor_thesis.repository.FieldOfStudyRepository;
import cz.cvut.fel.bachelor_thesis.to.FieldOfStudyTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FieldOfStudyService {

    private final FieldOfStudyRepository fieldOfStudyRepository;

    @Autowired
    public FieldOfStudyService(FieldOfStudyRepository fieldOfStudyRepository) {
        this.fieldOfStudyRepository = fieldOfStudyRepository;
    }

    public List<FieldOfStudy> getAll() {
        return fieldOfStudyRepository.findAll();
    }

    public FieldOfStudy get(Long id) {
        return fieldOfStudyRepository.getOne(id);
    }

    public FieldOfStudy save(FieldOfStudyTO fieldOfStudyTO) {
        var field = new FieldOfStudy();

        field.setField(fieldOfStudyTO.getField());
//        field.setDegree(fieldOfStudyTO.getDegree());
        field.setStudentList(fieldOfStudyTO.getStudentList());

        return fieldOfStudyRepository.save(field);
    }

    public FieldOfStudy update(Long id, FieldOfStudyTO fieldOfStudyTO) {
        var field = fieldOfStudyRepository.getOne(id);

        field.setField(fieldOfStudyTO.getField());
//        field.setDegree(fieldOfStudyTO.getDegree());
        field.setStudentList(fieldOfStudyTO.getStudentList());

        return fieldOfStudyRepository.save(field);
    }

    public void delete(Long id) {
        fieldOfStudyRepository.deleteById(id);
    }

    public void delete(FieldOfStudy fieldOfStudy) {
        fieldOfStudyRepository.delete(fieldOfStudy);
    }
}
