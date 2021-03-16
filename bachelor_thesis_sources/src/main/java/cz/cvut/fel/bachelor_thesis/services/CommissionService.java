package cz.cvut.fel.bachelor_thesis.services;

import cz.cvut.fel.bachelor_thesis.model.Commission;
import cz.cvut.fel.bachelor_thesis.model.Teacher;
import cz.cvut.fel.bachelor_thesis.model.enums.CommissionState;
import cz.cvut.fel.bachelor_thesis.repository.CommissionRepository;
import cz.cvut.fel.bachelor_thesis.to.CommissionTO;
import cz.cvut.fel.bachelor_thesis.to.CreatorTO;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Log
public class CommissionService {

    @Autowired
    private CommissionRepository commissionRepository;

    @Autowired
    private ExamService examService;

    @Autowired
    private DateService dateService;

    @Autowired
    private LocationService locationService;

    public Commission getOne(Long commissionId) {
        return commissionRepository.getOne(commissionId);
    }

    public List<Commission> getAll() {
        return commissionRepository.findAll();
    }

    public List<Commission> getDrafts() {
        return commissionRepository.getAllByState(CommissionState.DRAFT);
    }

    public List<Commission> getNotDraft() {
        return commissionRepository.findByStateNot(CommissionState.DRAFT);
    }


    public Commission update(Long commissionId, CommissionTO commissionTO) {
        var commission = commissionRepository.getOne(commissionId);

        commission.setExam(commissionTO.getExam());
        commission.setState(commissionTO.getState());
        commission.setTeachers(commissionTO.getTeachers());

        return commissionRepository.save(commission);
    }

    public Commission saveManual(CommissionTO commissionTO, String date, Long locationId) {
        var commission = new Commission();
        var exam = examService.create();
        var loc = locationService.get(locationId);
        //todo do smth with date
        var dateNew = dateService.create(date);

        exam.setDate(dateNew);
        exam.setLocation(loc);
        exam.setLocation(loc);
//        examService.save(exam);

        commission.setExam(exam);
        commission.setState(CommissionState.DRAFT);
        commission.setTeachers(commissionTO.getTeachers());

        return commissionRepository.save(commission);
    }

    public Commission save(CommissionTO commissionTO, CreatorTO creatorTO) {
        if (commissionTO.getTeachers().isEmpty()) {
            return null;
        }
        var commission = new Commission();

        var exam = examService.create();
        //todo do smth with date
        var dateNew = dateService.create(creatorTO.getDate());

        exam.setDate(dateNew);
        exam.setLocation(locationService.get(creatorTO.getLocationId()));
        exam.setDegree(creatorTO.getDegree());

        commission.setExam(exam);
        commission.setState(CommissionState.DRAFT);
        commission.setTeachers(commissionTO.getTeachers());

        return commissionRepository.save(commission);
    }


    public Commission updateToEditedState(Long commissionId, Commission commission) {
        var comm = commissionRepository.getOne(commissionId);
        var date = comm.getExam().getDate();

        comm.setState(CommissionState.EDITABLE);
        removeByTeacher(commission.getTeachers());
        comm.getTeachers().forEach(teacher -> teacher.getUnavailableDates().add(date));
        //after that need to remove all commissions, where teacher was
        //and rerender

        return commissionRepository.save(comm);
    }


    public void removeByTeacher(List<Teacher> teacherList) {
        var all = commissionRepository.findAll()
                .stream().filter(commission -> commission.getState().equals(CommissionState.DRAFT))
                .collect(Collectors.toList());
//        System.out.println("all " + all);
        for (Teacher teacher : teacherList) {

//            var toRemove = all.stream()
//                    .filter(commission ->
//                            commission.getTeachers().contains(teacher))
//                    .collect(Collectors.toList());
            var toRemove = new ArrayList<Commission>();
            for (Commission commission : all) {
                System.out.println(commission.getTeachers());
                System.out.println("tryin " + teacher);
                if (commission.getTeachers().contains(teacher)) {
                    System.out.println("contains");
                    toRemove.add(commission);
                }
            }

            System.out.println(toRemove + "to remove");
            var iter = toRemove.iterator();
            while (iter.hasNext()) {
                remove(iter.next());
            }
            log.info(teacher + " removed");
        }
    }

    public void remove(Commission commission) {
        System.out.println("remove " + commission);
        commissionRepository.delete(commission);
    }

    public void remove(Long id) {
        commissionRepository.deleteById(id);
    }

    public void remove() {
        commissionRepository.deleteAll();
    }
}
