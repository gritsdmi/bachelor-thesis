package cz.cvut.fel.fem.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.Entity;
import javax.persistence.Table;
import java.util.Objects;

@Entity
@Setter
@Getter
@ToString
@Table(name = "Location")
//@EqualsAndHashCode(callSuper = false)
public class Location extends AbstractEntity {

    private String classroom;

    private String building;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Location location = (Location) o;
        return Objects.equals(classroom, location.classroom)
                && Objects.equals(building, location.building);
    }

    @Override
    public int hashCode() {
        return Objects.hash(classroom, building);
    }
}
