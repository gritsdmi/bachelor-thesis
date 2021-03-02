package cz.cvut.fel.bachelor_thesis.services;

import cz.cvut.fel.bachelor_thesis.model.Exam;
import cz.cvut.fel.bachelor_thesis.repository.ExamRepository;
import cz.cvut.fel.bachelor_thesis.to.ExamTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

    public Exam save(ExamTO examTO) {
        var exam = new Exam();

        exam.setCommission(exam.getCommission());
        exam.setDate(exam.getDate());
        exam.setLocation(exam.getLocation());
        exam.setFieldOfStudy(exam.getFieldOfStudy());

        return examRepository.save(exam);
    }

    public Exam update(Long id, ExamTO examTO) {
        var exam = examRepository.getOne(id);

        exam.setCommission(exam.getCommission());
        exam.setDate(exam.getDate());
        exam.setLocation(exam.getLocation());
        exam.setFieldOfStudy(exam.getFieldOfStudy());

        return examRepository.save(exam);
    }

    public void delete(Long id) {
        examRepository.deleteById(id);
    }

    public void delete(Exam exam) {
        examRepository.delete(exam);
    }
}
