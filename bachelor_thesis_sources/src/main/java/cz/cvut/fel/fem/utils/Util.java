package cz.cvut.fel.fem.utils;

import cz.cvut.fel.fem.model.Commission;
import cz.cvut.fel.fem.services.CommissionService;
import cz.cvut.fel.fem.to.GenerateRequestTO;
import lombok.extern.java.Log;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.text.ParseException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

@Service
@Log
public class Util {

    @Autowired
    private CommissionService commissionService;

    public File generateCSV(GenerateRequestTO request) throws ParseException {
        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("dd.MM.uuuu");

        LocalDate from = LocalDate.parse(request.getDateTo(), dtf);
        LocalDate to = LocalDate.parse(request.getDateTo(), dtf);

        var commissions = commissionService.getNotDraft();

        var data = commissions.stream()
                .filter(com -> {
                    var date = LocalDate.parse(com.getExam().getDate(), dtf);
                    return (date.isEqual(from) || date.isEqual(to)) || (date.isBefore(to) && date.isAfter(from));
                })
                .collect(Collectors.toList());

        try {
            var filename = createCSVFile(data);
            return new File(filename);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }


    private String createCSVFile(List<Commission> data) throws IOException {

        final String[] HEADERS = {"id", "T1", "T2", "T3", "T4", "T5", "Date", "Time", "Degree", "Study field"};
        final String fileName = "src/main/resources/new.csv";

        FileWriter out = new FileWriter(fileName);
        try (CSVPrinter printer = new CSVPrinter(out, CSVFormat.DEFAULT.withHeader(HEADERS))) {

            AtomicInteger id = new AtomicInteger();
            data.forEach(comm -> {
                id.getAndIncrement();
                try {
                    printer.printRecord(line(id, comm));
                } catch (IOException e) {
                    e.printStackTrace();
                }
            });
        } catch (IOException e) {
            e.printStackTrace();
        }
        return fileName;
    }

    private List<String> line(AtomicInteger id, Commission commission) {
        var ret = new ArrayList<String>();
        ret.add(String.valueOf(id));
        for (int i = 0; i < 5; i++) {
            if (commission.getTeachers().size() > i) {
                var t = commission.getTeachers().get(i);
                if (t != null)
                    ret.add(t.getFullName());
            } else {
                ret.add("");
            }
        }
        ret.add(commission.getExam().getDate());
        ret.add(commission.getExam().getTime());
        ret.add(commission.getExam().getDegree().toString());
        ret.add(commission.getExam().getFieldOfStudy());
        return ret;
    }

}
