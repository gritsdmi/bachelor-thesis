package cz.cvut.fel.bachelor_thesis.services;

import cz.cvut.fel.bachelor_thesis.model.Commission;
import cz.cvut.fel.bachelor_thesis.repository.CommissionRpository;
import cz.cvut.fel.bachelor_thesis.to.CommissionTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommissionService {

    @Autowired
    private CommissionRpository commissionRpository;

    public Commission getOne(Long commissionId) {
        return commissionRpository.getOne(commissionId);
    }

    public List<Commission> getAll() {
        return commissionRpository.findAll();
    }


    public Commission update(Long commissionId, CommissionTO commissionTO) {
        var commission = commissionRpository.getOne(commissionId);

        commission.setExam(commissionTO.getExam());
        commission.setState(commissionTO.getState());
        commission.setTeachers(commissionTO.getTeachers());

        return commissionRpository.save(commission);
    }

    public Commission save(CommissionTO commissionTO) {
        var commission = new Commission();

        commission.setExam(commissionTO.getExam());
        commission.setState(commissionTO.getState());
        commission.setTeachers(commissionTO.getTeachers());

        return commissionRpository.save(commission);

    }

    public void remove(Commission commission) {
        commissionRpository.delete(commission);
    }

    public void remove(Long id) {
        commissionRpository.deleteById(id);
    }
}
