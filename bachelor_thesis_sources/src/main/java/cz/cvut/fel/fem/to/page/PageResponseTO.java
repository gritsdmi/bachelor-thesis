package cz.cvut.fel.fem.to.page;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.data.domain.Page;

import java.util.HashMap;


@ToString
public class PageResponseTO {

    @Setter
    private String listName = "list";

    @Setter
    private String currentPageName = "currentPage";

    @Setter
    private String totalItemsCountName = "totalItemsCount";

    @Setter
    private String totalPagesCountName = "totalPagesCount";

    @Getter
    private final HashMap<String, Object> data;

    public PageResponseTO(Page page) {
        data = new HashMap<String, Object>();

        data.put(listName, page.getContent());
        data.put(currentPageName, page.getNumber());
        data.put(totalItemsCountName, page.getTotalElements());
        data.put(totalPagesCountName, page.getTotalPages());
    }
}
