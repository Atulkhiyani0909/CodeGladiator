import java.io.*;
import java.nio.file.*;
import java.util.*;

public class Run {

    //_USER_CODE_HERE_

    public static void main(String[] args) {
        final String DELIMITER = "$$$DELIMITER$$$";
        final String INPUT_FILE = "/app/input.txt";

        String content;
        try {
            content = Files.readString(Paths.get(INPUT_FILE));
        } catch (IOException e) {
            System.err.println("Input file not found");
            return;
        }

        int prev = 0;
        int pos;

        while (true) {
            pos = content.indexOf(DELIMITER, prev);
            String testCase = (pos != -1)
                ? content.substring(prev, pos)
                : content.substring(prev);

            if (!testCase.trim().isEmpty()) {
                Scanner scanner = new Scanner(testCase.trim());

                // Type List<int> not fully supported in generator
                // Type List<int> not fully supported in generator

                // Assuming static method
                var result = intersection(arg0, arg1);
                System.out.println(result);
                System.out.println(DELIMITER);

                scanner.close();
            }

            if (pos == -1) break;
            prev = pos + DELIMITER.length();
        }
    }
}