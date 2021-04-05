package cz.cvut.fel.fem.services;

import cz.cvut.fel.fem.model.Commission;
import cz.cvut.fel.fem.model.User;
import cz.cvut.fel.fem.model.enums.CommissionState;
import cz.cvut.fel.fem.repository.CommissionRepository;
import cz.cvut.fel.fem.to.CommissionTO;
import cz.cvut.fel.fem.to.CreatorTO;
import lombok.extern.java.Log;
import org.modelmapper.ModelMapper;
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
    private UserService userService;

    @Autowired
    private LocationService locationService;

    @Autowired
    private ModelMapper modelMapper;

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

    public List<Commission> getByTeacher(Long teacherId) {
        var all = commissionRepository.findAll();
        return all.stream()
                .filter(commission -> commission.getTeachers().stream()
                        .anyMatch(t -> t.getId().equals(teacherId)))
                .collect(Collectors.toList());
    }

    public Commission addTeacherById(Long commId, Long teacherId) {
        var com = commissionRepository.getOne(commId);
        var teacher = userService.getTeacher(teacherId);

        com.getTeachers().add(teacher);
        log.info(com.toString());

        return commissionRepository.save(com);
    }

    /**
     * Used in TeacherRecommendDialog.
     * Adds recommended teacher to commission, removes current teacher
     * and add unavailable date to the current teacher
     *
     * @param newUser           teacher to add to the commission
     * @param commId            commission's id
     * @param teacherIdToRemove teacher's id to remove
     * @return updated Commission
     */
    public Commission addTeacherToCommission(User newUser, Long commId, Long teacherIdToRemove) {
        var comm = commissionRepository.getOne(commId);
        var date = comm.getExam().getDate();
        var teacherToRemove = userService.getTeacher(teacherIdToRemove);

        userService.addUnavailableDate(teacherToRemove.getId(), date);

        comm.getTeachers().add(newUser);
        removeTeacherFromCommission(teacherToRemove, comm);
        return comm;
    }

    private void removeTeacherFromCommission(User teacherToRemove, Commission commission) {
        commission.getTeachers().removeIf(t -> t.getId().equals(teacherToRemove.getId()));
        update(commission.getId(), commission);
    }

    /**
     * used to update existing commission in manual creating
     * <p>
     * <p>
     * used model mapper (seems working)
     */
    public Commission update(Long commissionId, Commission commission) {
//        var comm = commissionRepository.getOne(commissionId);
        var newComm = modelMapper.map(commission, Commission.class);
        return commissionRepository.save(newComm);
    }

    /**
     * Used on Manual creating page
     *
     * @param creatorTO mix of parameters
     * @return new commission
     */
    public Commission saveManual(CreatorTO creatorTO) {
        var commission = new Commission();
        var exam = examService.create();
        var loc = locationService.get(creatorTO.getLocationId());

        exam.setDate(creatorTO.getDate());
        exam.setLocation(loc);
        exam.setDegree(creatorTO.getDegree());
//        examService.save(exam);

        commission.setExam(exam);
        commission.setState(CommissionState.EDITABLE);
        commission.setTeachers(creatorTO.getTeachers());

        return commissionRepository.save(commission);
    }

    /**
     * used on autogenerate page
     */
    public Commission save(CommissionTO commissionTO, CreatorTO creatorTO) {
        if (commissionTO.getTeachers().isEmpty()) {
            return null;
        }

        var commission = new Commission();

        var exam = examService.create();

        exam.setDate(creatorTO.getDate());
        exam.setLocation(locationService.get(creatorTO.getLocationId()));
        exam.setDegree(creatorTO.getDegree());

        commission.setExam(exam);
        commission.setState(CommissionState.DRAFT);
        commission.setTeachers(commissionTO.getTeachers());

        return commissionRepository.save(commission);
    }


    /**
     * Used when manager clicks on "CREATE" button in autogenerate commissions.
     * <p>
     * updating commission to the EDITED state
     * delete every commission, with same teachers today
     * todo delete every commission with same location in same day (т.е удалить все остальные, кроме текущей)
     *
     * @return updated Commission
     */
//    public Commission updateToEditedState(Long commissionId, Commission commission) {
    public Commission updateToEditedState(Long commissionId) {
        var comm = commissionRepository.getOne(commissionId);
        var date = comm.getExam().getDate();

        comm.setState(CommissionState.EDITABLE);

        /** OLD VERSION
         */

//        removeCommissionByTeacher(commission.getTeachers());
        //after that need to remove all commissions, where teacher was
        //and rerender
        //remove comm by (day and location)
        // where state==DRAFT && comm.exam.date==day && comm.exam.location==location
//        removeByDateLocation(commission.getExam().getLocation().getId(), commission.getExam().getDate().getDate());

        /** NEW VERSION
         * remove all draft commissions for today in this location
         */
        var allDrafts = getDrafts();
        var draftsToRemove = allDrafts.stream()
                .filter(draft -> !draft.getId().equals(commissionId))
                .filter(draft -> draft.getExam().getLocation().equals(comm.getExam().getLocation()))
                .filter(draft -> draft.getExam().getDate().equals(comm.getExam().getDate()))
                .collect(Collectors.toList());

        remove(draftsToRemove);

        return commissionRepository.save(comm);
    }

    //    //do not work
//    private void removeByDateLocation(Long locId, String date) {
//        var allCom = commissionRepository.findAll();
//        var loc = locationService.get(locId);
//        System.out.println(loc.toString());
//        System.out.println(date);
//
//        var comToRemove = allCom.stream()
//                .filter(commission -> commission.getState().equals(CommissionState.DRAFT)
//                        && commission.getExam().getDate().getDate().equals(date)
//                        && commission.getExam().getLocation().equals(loc)
//                ).collect(Collectors.toList());
//        log.warning("removeByDateLocation " + comToRemove.size());
//        remove(comToRemove);
////        log.info("comm to remove" + comToRemove.toString());
//
//    }
//
//
//    private void removeCommissionByTeacher(List<User> teacherList) {
//        var allDraft = commissionRepository.findAll()
//                .stream().filter(commission -> commission.getState().equals(CommissionState.DRAFT))
//                .collect(Collectors.toList());
//
//        for (User teacher : teacherList) {
//
//            var toRemove = allDraft.stream()
//                    .filter(commission -> commission.getTeachers().contains(teacher))
//                    .collect(Collectors.toList());
//
//            remove(toRemove);
//        }
//    }

    private void remove(List<Commission> toRemove) {
        var iter = toRemove.iterator();
        while (iter.hasNext()) {
            remove(iter.next());
        }
    }

    public void remove(Commission commission) {
        commissionRepository.deleteById(commission.getId());
    }

    public void remove(Long id) {
        commissionRepository.deleteById(id);
    }

}
