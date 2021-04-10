package cz.cvut.fel.fem.to.page;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;


@Getter
@Setter
@ToString
@AllArgsConstructor
public class PageRequestTO {

    private Integer page;

    private Integer size;

    private String pattern;
}
