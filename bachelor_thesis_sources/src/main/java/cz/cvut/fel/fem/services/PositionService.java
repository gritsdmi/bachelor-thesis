package cz.cvut.fel.fem.services;

import cz.cvut.fel.fem.model.Position;
import cz.cvut.fel.fem.model.enums.PositionEnum;
import cz.cvut.fel.fem.repository.PositionRepository;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Log
public class PositionService {

    @Autowired
    private PositionRepository positionRepository;

    public List<Position> getAll() {
        return positionRepository.findAll();
    }

    public Position getByLetter(String s) {

        var letter = PositionEnum.C;
        switch (s) {
            case "C", "Č", "č", "c" -> letter = PositionEnum.C;
            case "M", "m" -> letter = PositionEnum.M;
            case "P", "p" -> letter = PositionEnum.P;
            default -> {
                try {
                    throw new Exception(s);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }

        var all = getAll();
        PositionEnum finalLetter = letter;
        var ret = all
                .stream()
                .filter(position -> position.getPosition().equals(finalLetter))
                .collect(Collectors.toList());

        assert !ret.isEmpty();

        return ret.get(0);
    }
}
