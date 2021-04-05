package cz.cvut.fel.fem.to;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class DateTO {

    private String date;

    private String semester;

    @JsonCreator
    public DateTO(
            @JsonProperty("date") String date,
            @JsonProperty("semester") String semester) {
        this.date = date;
        this.semester = semester;
    }
}
