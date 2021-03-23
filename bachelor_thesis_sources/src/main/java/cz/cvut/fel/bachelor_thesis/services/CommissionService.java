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
    private TeacherService teacherService;

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


    public Commission update(Long commissionId, Commission commission) {
        var comm = commissionRepository.getOne(commissionId);

//        comm.setExam(commissionTO.getExam());
        comm.setState(commission.getState());
        comm.setTeachers(commission.getTeachers());
        //todo add date to teacher's unavialable date
        teacherService.updDate(commission.getTeachers(), commission.getExam().getDate());


        return commissionRepository.save(comm);
    }

    public Commission saveManual(CreatorTO creatorTO) {
        var commission = new Commission();
        var exam = examService.create();
        var loc = locationService.get(creatorTO.getLocationId());
        //todo do smth with date
        var dateNew = dateService.create(creatorTO.getDate());

        exam.setDate(dateNew);
        exam.setLocation(loc);
        exam.setDegree(creatorTO.getDegree());
//        examService.save(exam);

        //todo add date to teacher's unavialable date
        teacherService.updDate(creatorTO.getTeachers(), dateNew);

        commission.setExam(exam);
        commission.setState(CommissionState.EDITABLE);
        commission.setTeachers(creatorTO.getTeachers());

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

        //remove comm by (day and location)
        // where state==DRAFT && comm.exam.date==day && comm.exam.location==location
        removeByDateLocation(commission.getExam().getLocation().getId(), commission.getExam().getDate().getDate());

        return commissionRepository.save(comm);
    }

    //do not work
    private void removeByDateLocation(Long locId, String date) {
        var allCom = commissionRepository.findAll();
        var loc = locationService.get(locId);
        System.out.println(loc.toString());
        System.out.println(date);

        var comToRemove = allCom.stream()
                .filter(commission -> commission.getState().equals(CommissionState.DRAFT)
                        && commission.getExam().getDate().getDate().equals(date)
                        && commission.getExam().getLocation().equals(loc)
                ).collect(Collectors.toList());
        log.warning("removeByDateLocation " + comToRemove.size());
        remove(comToRemove);
//        log.info("comm to remove" + comToRemove.toString());

    }


    private void removeByTeacher(List<Teacher> teacherList) {
        var allDraft = commissionRepository.findAll()
                .stream().filter(commission -> commission.getState().equals(CommissionState.DRAFT))
                .collect(Collectors.toList());

        for (Teacher teacher : teacherList) {

            var toRemove = allDraft.stream()
                    .filter(commission -> commission.getTeachers().contains(teacher))
                    .collect(Collectors.toList());

            remove(toRemove);
        }
    }

    private void remove(List<Commission> toRemove) {
        var iter = toRemove.iterator();
        while (iter.hasNext()) {
            remove(iter.next());
        }
    }

    public void remove(Commission commission) {
        remove(commission.getId());
    }

    public void remove(Long id) {
        //todo when remove commission, clear teachers unavailable date
        commissionRepository.deleteById(id);
    }

    public void remove() {
        //todo when remove commission, clear teachers unavailable date
        teacherService.removeAllDates();
        commissionRepository.deleteAll();

    }
}
