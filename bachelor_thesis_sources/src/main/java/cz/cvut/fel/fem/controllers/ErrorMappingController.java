package cz.cvut.fel.fem.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping(produces = {"application/json; charset=UTF-8"})
public class ErrorMappingController {

    @GetMapping
    public String errorLabel() {
        return "This is error page";
    }
}
