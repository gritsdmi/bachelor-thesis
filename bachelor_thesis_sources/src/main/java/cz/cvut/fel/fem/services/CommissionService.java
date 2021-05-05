package cz.cvut.fel.fem.services;

import cz.cvut.fel.fem.model.AbstractEntity;
import cz.cvut.fel.fem.model.Commission;
import cz.cvut.fel.fem.model.Exam;
import cz.cvut.fel.fem.model.User;
import cz.cvut.fel.fem.model.enums.CommissionState;
import cz.cvut.fel.fem.model.enums.Degree;
import cz.cvut.fel.fem.model.enums.FieldOfStudyEnum;
import cz.cvut.fel.fem.repository.CommissionRepository;
import cz.cvut.fel.fem.to.CommissionTO;
import cz.cvut.fel.fem.to.CreatorTO;
import cz.cvut.fel.fem.to.page.CommissionFilterProps;
import cz.cvut.fel.fem.to.page.PageRequestTO;
import cz.cvut.fel.fem.to.page.PageResponseTO;
import lombok.extern.java.Log;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
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

    public Map<String, Object> getDraftsPaginated() {
        var pageRequest = PageRequest.of(0, 50);
        var page = commissionRepository.findByState(CommissionState.DRAFT, pageRequest);

        return new PageResponseTO(page).getData();
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
     * @param teacherToRecommend teacher to add to the commission
     * @param commId             commission's id
     * @param teacherIdToRemove  teacher's id to remove
     * @return updated Commission
     */
    public Commission addTeacherToCommission(User teacherToRecommend, Long commId, Long teacherIdToRemove) {
        var comm = commissionRepository.getOne(commId);
        var date = comm.getExam().getDate();
        var teacherToRemove = userService.getTeacher(teacherIdToRemove);

        userService.addUnavailableDate(teacherToRemove.getId(), date);

        comm.getTeachers().add(teacherToRecommend);
        log.warning("before remove " + comm.getTeachers().toString());
        removeTeacherFromCommission(teacherToRemove, comm);
        log.warning("after remove " + comm.getTeachers().toString());
        return comm;
    }

    private void removeTeacherFromCommission(User teacherToRemove, Commission commission) {
        commission.getTeachers().removeIf(t -> t.getId().equals(teacherToRemove.getId()));
        update(commission.getId(), commission);
    }

    /**
     * used to update existing commission in manual creating
     */
    public Commission update(Long commissionId, Commission commission) {
        var updatedComm = modelMapper.map(commission, Commission.class);
        var updatedExam = modelMapper.map(commission.getExam(), Exam.class);

        updatedExam = examService.arrangeSemesterByDate(updatedExam, commission.getExam().getDate());
        updatedComm.setExam(examService.update(updatedExam));
        return commissionRepository.save(updatedComm);
    }

    /**
     * Used on Manual creating page
     *
     * @param creatorTO mix of parameters
     * @return new commission
     */
    public Commission saveManual(CreatorTO creatorTO) {
        var commission = new Commission();
        var exam = examService.create(creatorTO);

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
        var exam = examService.create(creatorTO);

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
    public Commission updateToEditedState(Long commissionId) {
        var comm = commissionRepository.getOne(commissionId);

        comm.setState(CommissionState.EDITABLE);

        var allDrafts = getDrafts();
        var draftsToRemove = allDrafts.stream()
                .filter(draft -> !draft.getId().equals(commissionId))
                .filter(draft -> draft.getExam().getLocation().equals(comm.getExam().getLocation()))
                .filter(draft -> draft.getExam().getDate().equals(comm.getExam().getDate()))
                .collect(Collectors.toList());

        remove(draftsToRemove);

        return commissionRepository.save(comm);
    }

    /**
     * Returns all non draft commissions by pages
     *
     * @param pageNumber represents current displayed page
     * @param size       represents max count items on page
     * @return
     */
    public Map<String, Object> getAllPaginated(Integer pageNumber, Integer size) {
        var pageRequest = PageRequest.of(pageNumber, size);
        var page = commissionRepository.findByStateNot(CommissionState.DRAFT, pageRequest);

        return new PageResponseTO(page).getData();
    }

    public Map<String, Object> getAll(PageRequestTO pageRequestTO) {
        return getAllPaginated(pageRequestTO.getPage(), pageRequestTO.getSize());
    }

    public Map<String, Object> getByTeacher(Long userId, PageRequestTO pageRequestTO) {
        var pageRequest = PageRequest.of(pageRequestTO.getPage(), pageRequestTO.getSize());
        var page = commissionRepository.findByTeacherIdAndStateNot(userId, CommissionState.DRAFT.toString(), pageRequest);

        return new PageResponseTO(page).getData();
    }

    public Map<String, Object> getAllDrafts(PageRequestTO pageRequestTO) {
        var pageRequest = PageRequest.of(pageRequestTO.getPage(), pageRequestTO.getSize());

        var page = commissionRepository.findByState(CommissionState.DRAFT, pageRequest);

        return new PageResponseTO(page).getData();
    }

    /**
     * Get commissions for commissions list page.
     * Used filter parameters such as dates, degrees, study fields and semesters.
     *
     * @param pageRequestTO page request.
     * @return page contains requested data.
     * @see cz.cvut.fel.fem.to.page.PageRequestTO
     * @see CommissionFilterProps
     */
    public Map<String, Object> getByPropsPaginated(PageRequestTO pageRequestTO) {
        if (pageRequestTO.getProps().getSelectedSemester() != null) {
            return getByPropsBySemesterPaginated(pageRequestTO);
        } else {

            var pageRequest = PageRequest.of(pageRequestTO.getPage(),
                    pageRequestTO.getSize(), Sort.by("exam.date"));
            var props = pageRequestTO.getProps();

            var notDraft = getNotDraft().stream()
                    .map(AbstractEntity::getId)
                    .collect(Collectors.toList());

            Page<Commission> page;
            if (props.getSelectedField().getDegree().equals(Degree.ALL)) {
                // request with all degrees and all fields
                page = commissionRepository.getByAllDegreesAndAllFieldsPaginated(
                        props.getSelectedDatesRange(),
                        notDraft, pageRequest);
            } else {
                if (props.getSelectedField().getField().equals(FieldOfStudyEnum.ALL)) {
                    // request with selected degree and all fields according to this degree
                    page = commissionRepository.getByDegreeAndAllFieldsPaginated(props.getSelectedDatesRange(),
                            notDraft,
                            props.getSelectedField().getDegree(),
                            pageRequest);

                } else {
                    //request specified degree and field of study
                    page = commissionRepository.getByDegreeAndFieldPaginated(props.getSelectedDatesRange(),
                            notDraft,
                            props.getSelectedField().getDegree(),
                            props.getSelectedField().getField().toString(),
                            pageRequest);
                }
            }
            return new PageResponseTO(page).getData();
        }
    }

    public Map<String, Object> getByPropsBySemesterPaginated(PageRequestTO pageRequestTO) {
        var pageRequest = PageRequest.of(pageRequestTO.getPage(),
                pageRequestTO.getSize(), Sort.by("exam.date"));
        var props = pageRequestTO.getProps();
        var notDraft = getNotDraft().stream()
                .map(AbstractEntity::getId)
                .collect(Collectors.toList());
        Page<Commission> page;

        if (props.getSelectedField().getDegree().equals(Degree.ALL)) {
            // request with all degrees and all fields
            page = commissionRepository.getByAllDegreesAndAllFieldsBySemesterPaginated(
                    props.getSelectedSemester(),
                    notDraft, pageRequest);
        } else {
            if (props.getSelectedField().getField().equals(FieldOfStudyEnum.ALL)) {
                // request with selected degree and all fields according to this degree
                page = commissionRepository.getByDegreeAndAllFieldsBySemesterPaginated(props.getSelectedSemester(),
                        notDraft,
                        props.getSelectedField().getDegree(),
                        pageRequest);
            } else {
                //request specified degree and field of study
                page = commissionRepository.getByDegreeAndFieldBySemesterPaginated(props.getSelectedSemester(),
                        notDraft,
                        props.getSelectedField().getDegree(),
                        props.getSelectedField().getField().toString(),
                        pageRequest);
            }
        }
        return new PageResponseTO(page).getData();
    }

    public Map<String, Object> getByPropsByTeacherPaginated(Long teacherId, PageRequestTO pageRequestTO) {
        if (pageRequestTO.getProps().getSelectedSemester() != null) {
            return getByPropsByTeacherBySemesterPaginated(teacherId, pageRequestTO);
        } else {

            var pageRequest = PageRequest.of(pageRequestTO.getPage(),
                    pageRequestTO.getSize(),
                    Sort.by("exam.date"));

            var byTeacher = getByTeacher(teacherId).stream()
                    .filter(commission -> !commission.getState().equals(CommissionState.DRAFT))
                    .map(AbstractEntity::getId)
                    .collect(Collectors.toList());

            Page<Commission> page;
            if (pageRequestTO.getProps().getSelectedDegree().equals(Degree.ALL)) {
                page = commissionRepository.getByAllDegreesAndAllFieldsPaginated(
                        pageRequestTO.getProps().getSelectedDatesRange(),
                        byTeacher,
                        pageRequest);
            } else {
                page = commissionRepository.getByDegreeAndAllFieldsPaginated(
                        pageRequestTO.getProps().getSelectedDatesRange(),
                        byTeacher,
                        pageRequestTO.getProps().getSelectedDegree(),
                        pageRequest);
            }
            return new PageResponseTO(page).getData();
        }
    }

    public Map<String, Object> getByPropsByTeacherBySemesterPaginated(Long teacherId, PageRequestTO pageRequestTO) {

        var pageRequest = PageRequest.of(pageRequestTO.getPage(),
                pageRequestTO.getSize(),
                Sort.by("exam.date"));

        var byTeacher = getByTeacher(teacherId).stream()
                .filter(commission -> !commission.getState().equals(CommissionState.DRAFT))
                .map(AbstractEntity::getId)
                .collect(Collectors.toList());

        Page<Commission> page;
        if (pageRequestTO.getProps().getSelectedDegree().equals(Degree.ALL)) {
            page = commissionRepository.getByAllDegreesAndAllFieldsBySemesterPaginated(
                    pageRequestTO.getProps().getSelectedSemester(),
                    byTeacher,
                    pageRequest);
        } else {
            page = commissionRepository.getByDegreeAndAllFieldsBySemesterPaginated(
                    pageRequestTO.getProps().getSelectedSemester(),
                    byTeacher,
                    pageRequestTO.getProps().getSelectedDegree(),
                    pageRequest);
        }
        return new PageResponseTO(page).getData();
    }

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

    public void removeDrafts() {
        var drafts = getDrafts();
        remove(drafts);
    }
}
