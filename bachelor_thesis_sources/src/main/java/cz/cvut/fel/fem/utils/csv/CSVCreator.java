package cz.cvut.fel.fem.utils.csv;

import cz.cvut.fel.fem.model.Commission;
import cz.cvut.fel.fem.services.CommissionService;
import cz.cvut.fel.fem.to.GenerateCSVRequestTO;
import lombok.extern.java.Log;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFFont;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileOutputStream;
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
public class CSVCreator {

    @Autowired
    private CommissionService commissionService;

    private final String fileNameLocal = "src/main/resources/new.xlsx";
    private final String fileNameDeploy = "../webapps/fem/WEB-INF/classes/new.xlsx";

//    private String fileName = fileNameLocal;
    private String fileName = fileNameDeploy;

    public File generateCSV(GenerateCSVRequestTO request) throws ParseException {
        var data = commissionService.getNotDraft();

        if (request.getSemester() != null) {
            data = data.stream()
                    .filter(commission -> commission.getExam().getSemester().equals(request.getSemester()))
                    .collect(Collectors.toList());
        } else {

            DateTimeFormatter dtf = DateTimeFormatter.ofPattern("dd.MM.uuuu");

            LocalDate from = LocalDate.parse(request.getDateTo(), dtf);
            LocalDate to = LocalDate.parse(request.getDateTo(), dtf);

            data = data.stream()
                    .filter(com -> {
                        var date = LocalDate.parse(com.getExam().getDate(), dtf);
                        return (date.isEqual(from) || date.isEqual(to)) || (date.isBefore(to) && date.isAfter(from));
                    })
                    .collect(Collectors.toList());
        }

        try {
            var filename = createCSVFile(data, request);
            return new File(filename);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }


    private String createCSVFile(List<Commission> data, GenerateCSVRequestTO request) throws IOException {

        final String[] HEADERS = {"id", "T1", "T2", "T3", "T4", "T5", "Semester", "Date", "Time", "Degree", "Study field"};

        Workbook workbook = new XSSFWorkbook();
        log.warning(request.toString());
        Sheet sheet = workbook.createSheet(request.getSemester() != null ? request.getSemester() : "Sheet 1");
        sheet.setColumnWidth(0, 6000);
        sheet.setColumnWidth(1, 4000);

        AtomicInteger rowCounter = new AtomicInteger();
        Row header = sheet.createRow(rowCounter.getAndIncrement());

        CellStyle headerStyle = workbook.createCellStyle();
        headerStyle.setFillForegroundColor(IndexedColors.LIGHT_BLUE.getIndex());
        headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

        XSSFFont font = ((XSSFWorkbook) workbook).createFont();
        font.setFontName("Arial");
        font.setFontHeightInPoints((short) 16);
        font.setBold(true);
        headerStyle.setFont(font);

        //filling header
        for (int i = 0; i < HEADERS.length; i++) {
            var headerCell = header.createCell(i);
            headerCell.setCellValue(HEADERS[i]);
            headerCell.setCellStyle(headerStyle);
        }
///////

        data.forEach(commission -> {
            writeRow(commission, rowCounter.get(), sheet, workbook);
            rowCounter.getAndIncrement();
        });

        FileOutputStream outputStream = new FileOutputStream(fileName);
        workbook.write(outputStream);
        workbook.close();


//        FileWriter out = new FileWriter(fileName);
//        try (CSVPrinter printer = new CSVPrinter(out, CSVFormat.DEFAULT.withHeader(HEADERS))) {
//
//            AtomicInteger id = new AtomicInteger();
//            data.forEach(comm -> {
//                id.getAndIncrement();
//                try {
//                    printer.printRecord(line(id, comm));
//                } catch (IOException e) {
//                    e.printStackTrace();
//                }
//            });
//        } catch (IOException e) {
//            e.printStackTrace();
//        }
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
        ret.add(commission.getExam().getSemester());
        ret.add(commission.getExam().getDate());
        ret.add(commission.getExam().getTime());
        ret.add(commission.getExam().getDegree().toString());
        ret.add(commission.getExam().getFieldOfStudy());
        return ret;
    }

    private void writeRow(Commission commission, int rowCounter, Sheet sheet, Workbook workbook) {
        var celCounter = 0;
        var row = sheet.createRow(rowCounter);
        CellStyle style = workbook.createCellStyle();
        style.setWrapText(true);

        Cell cell;
        cell = row.createCell(celCounter++);
        cell.setCellValue(rowCounter);
        cell.setCellStyle(style);


        for (int i = 0; i < 5; i++) {
            cell = row.createCell(celCounter++);
            if (commission.getTeachers().size() > i) {
                var t = commission.getTeachers().get(i);
                if (t != null) {
                    cell.setCellValue(t.getFullName());
                }
            } else {
                cell.setCellValue("");
            }
            cell.setCellStyle(style);
        }

        cell = row.createCell(celCounter++);
        cell.setCellValue(commission.getExam().getSemester());
        cell.setCellStyle(style);

        cell = row.createCell(celCounter++);
        cell.setCellValue(commission.getExam().getDate());
        cell.setCellStyle(style);

        cell = row.createCell(celCounter++);
        cell.setCellValue(commission.getExam().getTime());
        cell.setCellStyle(style);

        cell = row.createCell(celCounter++);
        cell.setCellValue(commission.getExam().getDegree().toString());
        cell.setCellStyle(style);

        cell = row.createCell(celCounter++);
        cell.setCellValue(commission.getExam().getFieldOfStudy());
        cell.setCellStyle(style);

    }
}
