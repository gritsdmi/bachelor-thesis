package cz.cvut.fel.fem.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.Table;

//@Entity
@Getter
@Setter
@ToString
@Table(name = "Mananger")
//@PrimaryKeyJoinColumn(name = "userId")
public class Manager extends AbstractEntity {

    private Boolean isAdmin;
}