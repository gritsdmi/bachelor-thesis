package cz.cvut.fel.fem.utils.csv;

import lombok.Getter;
import lombok.extern.java.Log;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Log
@Getter
@Service
public class CsvParser {

    private final String fileLocation = "src/main/resources/data.xlsx";
    private final String fileDeployedLocation = "../webapps/fem/WEB-INF/classes/data.xlsx";

//    private final String path = fileDeployedLocation;
    private final String path = fileLocation;

    private final Map<Integer, List<String>> document = new HashMap<>();

    public Map<Integer, List<String>> parse(int pageNumber) {
        FileInputStream file;

        //Create Workbook instance holding reference to .xlsx file
        Workbook workbook = null;

        try {
            file = new FileInputStream(path);
            workbook = new XSSFWorkbook(file);
        } catch (IOException e) {
            e.printStackTrace();
        }


        assert workbook != null;

        //Get sheet from the workbook
        Sheet sheet = workbook.getSheetAt(pageNumber);

        Map<Integer, List<String>> dataMap = new HashMap<>();
        List<String> buffer = new ArrayList<>();

        int i = 0;
        for (Row row : sheet) {
            boolean emptyRow = true;

            for (Cell cell : row) {
                if (!cell.toString().equals("")) {
                    emptyRow = false;
                    buffer.add(cell.toString());
                } else {
                    buffer.add(" ");
                }
            }
            if (emptyRow)
                break;
            dataMap.put(i, List.copyOf(buffer));
            buffer.clear();
            i++;
        }

        return dataMap;
    }

    public Map<Integer, List<String>> getData(Integer pageNumber) {
        return parse(pageNumber);
    }

    public String xlsxSheetToSting(Sheet sheet) {
        var string = new StringBuilder();
        var buffer = new StringBuilder();

        int i = 0;
        for (Row row : sheet) {
            buffer.append(i).append(". ");
            boolean emptyRow = true;
            for (Cell cell : row) {

                if (!cell.toString().equals("")) {
                    emptyRow = false;
                    buffer.append(String.format("   %s", cell.toString()))
                            .append("\t")
                    ;
                } else {
                    buffer.append(" ");
                }

                if (emptyRow)
                    break;

                string.append(buffer);
                buffer.setLength(0);
            }
            i++;
            string.append("\n");

            if (emptyRow)
                break;
        }
        return string.toString();
    }
}
