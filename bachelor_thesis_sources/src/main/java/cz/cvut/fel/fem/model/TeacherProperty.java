package cz.cvut.fel.fem.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;
import java.util.List;

@Entity
@Getter
@Setter
@ToString
@Table(name = "teacher_property")
public class TeacherProperty extends AbstractEntity {

    @OneToOne(mappedBy = "teacher")
    @JsonIgnore
    @ToString.Exclude
    private User user;

    private Double contract;

    private String department;

    @ManyToMany(mappedBy = "teachers")
    @JsonIgnore
    @ToString.Exclude
    private List<Commission> commissionList;

    @ManyToMany(cascade = CascadeType.ALL)
    private List<Date> unavailableDates;

    @ManyToMany
    private List<FieldOfStudy> preferredFieldOfStudies;

    @ManyToMany
    private List<Position> positionInCommissions;

    private String approvedByScientificCouncilFrom;

    //represents commissionTypes [Bc, Ing, PhD]
    private String commissionTypes;

    private Boolean extern;

//    new item
//    private List<String> availableExamDegrees;

//    //new item
//    @ElementCollection
//    @CollectionTable(name = "teacher_commission_reaction",
//            joinColumns = {@JoinColumn(name = "teacher_id", referencedColumnName = "id")})
//    @MapKeyColumn(name = "commission_id")
//    @Column(name = "reaction")
//    private Map<Long, TeacherReaction> reactionOnCommission;
}
