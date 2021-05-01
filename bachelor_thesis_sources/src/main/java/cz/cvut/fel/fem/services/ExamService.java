package cz.cvut.fel.fem.services;

import cz.cvut.fel.fem.model.Exam;
import cz.cvut.fel.fem.model.enums.Degree;
import cz.cvut.fel.fem.repository.ExamRepository;
import cz.cvut.fel.fem.to.CreatorTO;
import cz.cvut.fel.fem.to.ExamTO;
import lombok.extern.java.Log;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Log
@Service
public class ExamService {

    @Autowired
    private ExamRepository examRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private LocationService locationService;

    public List<Exam> getAll() {
        return examRepository.findAll();
    }

    public Exam get(Long id) {
        return examRepository.getOne(id);
    }

    public List<Degree> getDegrees() {
        return new ArrayList<>(Arrays.asList(Degree.ALL, Degree.Bc, Degree.Ing, Degree.PhD));
    }

    public Degree getDegreeByName(String name) {
        var ret = Degree.ALL;

        switch (name) {
            case "Bc":
                ret = Degree.Bc;
                break;
            case "Ing":
                ret = Degree.Ing;
                break;
            case "PhD":
                ret = Degree.PhD;
                break;
        }
        return ret;
    }

    public List<Exam> getByDate(String date) {
        return examRepository.getAllByDate(date);
    }

    public List<String> getAllSemesters() {
        var allExams = examRepository.findAll();

        return allExams.stream()
                .map(Exam::getSemester)
                .distinct()
                .collect(Collectors.toList());
    }

    public Exam create() {
        return examRepository.save(new Exam());
    }

    public Exam create(CreatorTO creatorTO) {
        var exam = new Exam();

        exam.setDate(creatorTO.getDate());
        exam.setTime(creatorTO.getTime());
        exam.setDegree(creatorTO.getDegree());
        if (creatorTO.getLocationId() != null)
            exam.setLocation(locationService.get(creatorTO.getLocationId()));
        exam.setFieldOfStudy(creatorTO.getField());

        exam.setSemester(setSemesterByDate(creatorTO.getDate()));

        return examRepository.save(exam);
    }

    private String setSemesterByDate(String date) {

        final short borderLs = 9;
        final short borderZs = 3;
        var sb = new StringBuilder();

        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("dd.MM.uuuu");
        LocalDate formattedDate = LocalDate.parse(date, dtf);

        if (formattedDate.getMonthValue() >= borderZs && formattedDate.getMonthValue() <= borderLs) {
            sb.append("Summer ");
            sb.append(formattedDate.getYear() - 1);
            sb.append("/");
            sb.append(formattedDate.getYear());
        } else {
            sb.append("Winter ");
            sb.append(formattedDate.getYear());
            sb.append("/");
            sb.append(formattedDate.getYear() + 1);
        }

        return sb.toString();
    }

    public Exam save(ExamTO examTO) {
        var exam = new Exam();
        var mapped = modelMapper.map(examTO, Exam.class);
//        exam.setDate(examTO.getDate());
//        exam.setLocation(examTO.getLocation());
//        exam.setFieldOfStudy(examTO.getFieldOfStudy());
//        exam.setDegree(examTO.getDegree());
//todo test mapping
        return examRepository.save(mapped);
    }

    public Exam update(Exam exam) {
        return examRepository.save(exam);
    }

    public Exam update(Long id, ExamTO examTO) {
        var exam = examRepository.getOne(id);
        var mapped = modelMapper.map(examTO, Exam.class);

        exam.setDate(examTO.getDate());
        exam.setLocation(examTO.getLocation());
        exam.setFieldOfStudy(examTO.getFieldOfStudy());
        exam.setDegree(examTO.getDegree());
        //todo test mapping
        log.info(exam.toString());
        log.warning(mapped.toString());

        return examRepository.save(exam);
    }

    public void delete(Long id) {
        examRepository.deleteById(id);
    }

    public void delete(Exam exam) {
        examRepository.delete(exam);
    }
}
