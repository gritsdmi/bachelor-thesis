package cz.cvut.fel.fem.services;

import cz.cvut.fel.fem.model.Exam;
import cz.cvut.fel.fem.model.Location;
import cz.cvut.fel.fem.model.enums.CommissionState;
import cz.cvut.fel.fem.repository.LocationRepository;
import cz.cvut.fel.fem.to.LocationTO;
import lombok.extern.java.Log;
import org.modelmapper.ModelMapper;
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

    @Autowired
    private ModelMapper modelMapper;

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
//        log.warning("exams today " + date + " " + examsToday.toString());

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
        var newLoc = modelMapper.map(locationTO, Location.class);
        return locationRepository.save(newLoc);
    }

    public Location update(Long locationId, LocationTO locationTO) {
        var old = locationRepository.getOne(locationId);
        modelMapper.map(locationTO, old);
        return locationRepository.save(old);
    }

    public void delete(Long locationId) {
        locationRepository.deleteById(locationId);
    }

    public void delete(Location location) {
        locationRepository.delete(location);
    }
}
