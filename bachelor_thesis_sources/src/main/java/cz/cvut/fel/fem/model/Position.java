package cz.cvut.fel.fem.model;

import cz.cvut.fel.fem.model.enums.PositionEnum;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.Table;

@Entity
@Getter
@Setter
@ToString
@Table(name = "position")
public class Position extends AbstractEntity {

    @Enumerated(EnumType.STRING)
    private PositionEnum position;

    private String description;

//    @Override
//    public boolean equals(Object o) {
//        if (this == o) return true;
//        if (o == null || getClass() != o.getClass()) return false;
//        Position pos = (Position) o;
//        return Objects.equals(personalNumber, user.personalNumber)
//
//                && Objects.equals(titlesPre, user.titlesPre);
//    }

}
