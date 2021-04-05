package cz.cvut.fel.bachelor_thesis.services;

import cz.cvut.fel.bachelor_thesis.model.Exam;
import cz.cvut.fel.bachelor_thesis.model.Location;
import cz.cvut.fel.bachelor_thesis.model.enums.CommissionState;
import cz.cvut.fel.bachelor_thesis.repository.LocationRepository;
import cz.cvut.fel.bachelor_thesis.to.LocationTO;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Log
@Transactional
public class LocationService {

    @Autowired
    private LocationRepository locationRepository;

    @Autowired
    private ExamService examService;

    public List<Location> getAll() {
        return locationRepository.findAll();
    }

    public Location get(Long locationId) {
        return locationRepository.getOne(locationId);
    }

    public Map<String, List<String>> getMap() {
        var allData = locationRepository.findAll();
        var map = new HashMap<String, List<String>>();

        for (var loc : allData) {
            if (map.containsKey(loc.getBuilding())) {
                map.get(loc.getBuilding()).add(loc.getClassroom());
            } else {
                var arr = new ArrayList<String>();
                arr.add(loc.getClassroom());
                map.put(loc.getBuilding(), arr);
            }
        }
        return map;
    }

    public List<Location> getFreeLocationByDate(String date) {

        var examsToday = examService.getByDate(date);
        var allLocations = locationRepository.findAll();

        if (!examsToday.isEmpty()) {
            var fullLocations = examsToday.stream()
                    .filter(exam -> !exam.getCommission().getState().equals(CommissionState.DRAFT))
                    .map(Exam::getLocation)
                    .collect(Collectors.toList());
            allLocations.removeAll(fullLocations);
        }

        return allLocations;
    }

    public Location save(LocationTO locationTO) {
        var newLoc = new Location();
        newLoc.setBuilding(locationTO.getBuilding());
        newLoc.setClassroom(locationTO.getClassroom());

        return locationRepository.save(newLoc);
    }

    public Location update(Long locationId, LocationTO location) {
        var old = locationRepository.getOne(locationId);

        old.setClassroom(location.getClassroom());
        old.setBuilding(location.getBuilding());

        return locationRepository.save(old);
    }

    public void delete(Long locationId) {
        locationRepository.deleteById(locationId);
    }

    public void delete(Location location) {
        locationRepository.delete(location);
    }
}
