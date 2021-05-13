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

}
