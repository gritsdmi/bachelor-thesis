package cz.cvut.fel.bachelor_thesis.services;

import cz.cvut.fel.bachelor_thesis.model.Exam;
import cz.cvut.fel.bachelor_thesis.model.enums.Degree;
import cz.cvut.fel.bachelor_thesis.repository.ExamRepository;
import cz.cvut.fel.bachelor_thesis.to.ExamTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
public class ExamService {

    @Autowired
    private ExamRepository examRepository;

    public List<Exam> getAll() {
        return examRepository.findAll();
    }

    public Exam get(Long id) {
        return examRepository.getOne(id);
    }

    public List<Degree> getDegrees() {
        return new ArrayList<>(Arrays.asList(Degree.Bc, Degree.Ing, Degree.PhD));
    }

    public List<Exam> getByDate(String date) {
        return examRepository.getAllByDate(date);
    }

    public Exam create() {
        return examRepository.save(new Exam());
    }

    public Exam save(ExamTO examTO) {
        var exam = new Exam();

//        exam.setDate(examTO.getDate());
        exam.setLocation(examTO.getLocation());
        exam.setFieldOfStudy(examTO.getFieldOfStudy());
        exam.setDegree(examTO.getDegree());

        return examRepository.save(exam);
    }

    public Exam update(Exam exam) {
        return examRepository.save(exam);
    }

    public Exam update(Long id, ExamTO examTO) {
        var exam = examRepository.getOne(id);

//        exam.setDate(examTO.getDate());
        exam.setLocation(examTO.getLocation());
        exam.setFieldOfStudy(examTO.getFieldOfStudy());
        exam.setDegree(examTO.getDegree());

        return examRepository.save(exam);
    }

    public void delete(Long id) {
        examRepository.deleteById(id);
    }

    public void delete(Exam exam) {
        examRepository.delete(exam);
    }
}
