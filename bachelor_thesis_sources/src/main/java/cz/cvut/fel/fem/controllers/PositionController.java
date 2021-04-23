package cz.cvut.fel.fem.controllers;

import cz.cvut.fel.fem.model.Position;
import cz.cvut.fel.fem.services.PositionService;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@Log
@RequestMapping(value = "/position", produces = {"application/json; charset=UTF-8"})
public class PositionController implements Controller {

    @Autowired
    public PositionService positionService;

    @GetMapping
    public List<Position> getAll() {
        return positionService.getAll();
    }
}
