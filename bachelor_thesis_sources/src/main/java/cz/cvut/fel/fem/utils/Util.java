package cz.cvut.fel.fem.utils;

import org.springframework.data.domain.Page;

import java.util.HashMap;
import java.util.Map;

public class Util {

    public static Map<String, Object> makeResponse(Page page) {
        var response = new HashMap<String, Object>();

        response.put("list", page.getContent());
        response.put("currentPage", page.getNumber());
        response.put("totalItemsCount", page.getTotalElements());
        response.put("totalPagesCount", page.getTotalPages());

        return response;
    }
}
