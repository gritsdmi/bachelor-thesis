package cz.cvut.fel.fem.controllers;

import cz.cvut.fel.fem.model.Commission;
import cz.cvut.fel.fem.model.User;
import cz.cvut.fel.fem.services.UserService;
import cz.cvut.fel.fem.to.CreatorTO;
import cz.cvut.fel.fem.to.GenerateRequestTO;
import cz.cvut.fel.fem.utils.CommissionMaker;
import cz.cvut.fel.fem.utils.csv.CSVCreator;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.ParseException;
import java.util.List;

@RestController
@Log
@RequestMapping(value = "/util", produces = {"application/json; charset=UTF-8"})
public class UtilController implements Controller {

    @Autowired
    private UserService userService;

    @Autowired
    private CommissionMaker commissionMaker;

    @Autowired
    private CSVCreator CSVCreator;

    @GetMapping("/{sheetNumber}")
    public List<User> parseCSV(@PathVariable Integer sheetNumber) {
        log.warning("parser csv called with argument 4");
        return userService.readXLS(sheetNumber);
    }

    @PostMapping("/gen/{len}")
    public List<Commission> generate(@PathVariable Integer len,
                                     @RequestBody CreatorTO creatorTO) {
        return commissionMaker.generateCommissions(len, creatorTO);
    }

    @RequestMapping(path = "/download", method = RequestMethod.POST)
    public ResponseEntity<Resource> download(@RequestBody GenerateRequestTO request) throws IOException {

        File file = null;
        try {
            file = CSVCreator.generateCSV(request);
        } catch (ParseException e) {
            e.printStackTrace();
        }

        HttpHeaders header = new HttpHeaders();
        header.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=image.jpg");
        header.add("Cache-Control", "no-cache, no-store, must-revalidate");
        header.add("Pragma", "no-cache");
        header.add("Expires", "0");

        assert file != null;
        Path path = Paths.get(file.getAbsolutePath());
        ByteArrayResource resource = new ByteArrayResource(Files.readAllBytes(path));

        return ResponseEntity.ok()
                .headers(header)
                .contentLength(file.length())
                .contentType(MediaType.parseMediaType("application/octet-stream"))
                .body(resource);
    }
}
