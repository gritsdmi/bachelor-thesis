package cz.cvut.fel.fem.model;

import cz.cvut.fel.fem.model.enums.CommissionState;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;
import java.util.List;

@Entity
@Getter
@Setter
@ToString
@Table(name = "Commission")
public class Commission extends AbstractEntity {

    //ownerSide
    @ManyToMany
//    @JsonIgnore
    private List<User> teachers;

    //owner side
    @OneToOne
            (cascade = CascadeType.REMOVE)
    @JoinColumn(name = "exam_id", referencedColumnName = "id")
    private Exam exam;

    @Enumerated(EnumType.STRING)
    private CommissionState state;
}
