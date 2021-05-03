package cz.cvut.fel.fem.controllers;

import cz.cvut.fel.fem.model.Location;
import cz.cvut.fel.fem.services.LocationService;
import cz.cvut.fel.fem.to.LocationTO;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Log
@RestController
@RequestMapping(value = "/location", produces = {"application/json; charset=UTF-8"})
public class LocationController implements Controller {

    private final LocationService locationService;

    @Autowired
    public LocationController(LocationService locationService) {
        this.locationService = locationService;
    }

    @GetMapping
    public List<Location> getAll() {
        return locationService.getAll();
    }

    @GetMapping("/{id}")
    public Location get(@PathVariable Long id) {
        return locationService.get(id);
    }

    @GetMapping("/free/{date}")
    public List<Location> getFree(@PathVariable String date) {
        return locationService.getFreeLocationByDate(date);
    }

    @PostMapping
    public Location create(@RequestBody LocationTO locationTO) {
        return locationService.save(locationTO);
    }

    @PostMapping("/{id}")
    public Location update(@PathVariable Long id, @RequestBody LocationTO to) {
        return locationService.update(id, to);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        locationService.delete(id);
    }

}
