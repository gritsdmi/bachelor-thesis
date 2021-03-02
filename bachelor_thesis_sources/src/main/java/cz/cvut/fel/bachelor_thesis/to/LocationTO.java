package cz.cvut.fel.bachelor_thesis.to;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.ToString;


@Getter
@ToString
public class LocationTO {

    private final String classroom;

    private final String building;

    @JsonCreator
    public LocationTO(
            @JsonProperty("classroom") String classroom,
            @JsonProperty("building") String building) {
        this.classroom = classroom;
        this.building = building;
    }
}
