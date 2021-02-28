package cz.cvut.fel.bachelor_thesis.services;

import cz.cvut.fel.bachelor_thesis.model.Location;
import cz.cvut.fel.bachelor_thesis.repository.LocationRepository;
import cz.cvut.fel.bachelor_thesis.to.LocationTO;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Log
@Transactional
public class LocationService {

    @Autowired
    private LocationRepository locationRepository;


    public List<Location> getAll() {
        return locationRepository.findAll();
    }

    public Location get(Long locationId) {
        return locationRepository.getOne(locationId);
    }

    public Location save(LocationTO locationTO) {
        var newLoc = new Location();
        newLoc.setBuilding(locationTO.getBuilding());
        newLoc.setClassroom(locationTO.getClassroom());

        log.warning(locationTO.toString());
        log.warning(newLoc.toString());
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
