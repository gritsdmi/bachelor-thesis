package cz.cvut.fel.fem.services;

import cz.cvut.fel.fem.model.FieldOfStudy;
import cz.cvut.fel.fem.model.enums.Degree;
import cz.cvut.fel.fem.repository.FieldOfStudyRepository;
import cz.cvut.fel.fem.to.FieldOfStudyTO;
import lombok.extern.java.Log;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Log
public class FieldOfStudyService {

    @Autowired
    private FieldOfStudyRepository fieldOfStudyRepository;

    @Autowired
    private ModelMapper modelMapper;

    public List<FieldOfStudy> getAll() {
        return fieldOfStudyRepository.findAll();
    }

    public FieldOfStudy get(Long id) {
        return fieldOfStudyRepository.getOne(id);
    }

    public List<FieldOfStudy> getByDegree(Degree degree) {
        if (degree.toString().equals("ALL")) {
            return getAll();
        } else {
            return fieldOfStudyRepository.findByDegree(degree);
        }
    }

    public FieldOfStudy save(FieldOfStudyTO fieldOfStudyTO) {
        var field = new FieldOfStudy();

        field.setField(fieldOfStudyTO.getField());
        field.setDegree(fieldOfStudyTO.getDegree());

        return fieldOfStudyRepository.save(field);
    }

    public FieldOfStudy update(Long id, FieldOfStudyTO fieldOfStudyTO) {
        var field = fieldOfStudyRepository.getOne(id);

        field.setField(fieldOfStudyTO.getField());
        field.setDegree(fieldOfStudyTO.getDegree());

        return fieldOfStudyRepository.save(field);
    }

    public void delete(Long id) {
        fieldOfStudyRepository.deleteById(id);
    }

    public void delete(FieldOfStudy fieldOfStudy) {
        fieldOfStudyRepository.delete(fieldOfStudy);
    }
}
