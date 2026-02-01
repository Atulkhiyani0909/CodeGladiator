import java.io.*;
import java.util.*;
import java.util.stream.*;
import java.nio.file.*; // <--- CRITICAL IMPORT
import java.nio.file.Files; // Explicitly import Files to be safe
import java.nio.file.Paths; // Explicitly import Paths to be safe

public class Run {

    //_USER_CODE_HERE_

    public static void main(String[] args) {
        final String DELIMITER = "$$$DELIMITER$$$";
        final String INPUT_FILE = "/app/input.txt";

        String content = "";
        try {
            // Read file content safely
            content = Files.readString(Paths.get(INPUT_FILE));
        } catch (IOException e) { return; }

        // Regex split with safe delimiter escaping
        String[] testCases = content.split(java.util.regex.Pattern.quote(DELIMITER));

        for (String testCase : testCases) {
            if (testCase.trim().isEmpty()) continue;

            Scanner scanner = new Scanner(testCase.trim());
            try {
                
                String raw0 = scanner.hasNextLine() ? scanner.nextLine().trim() : "";
                List<Integer> arg0 = parseIntegerList(raw0);

                String raw1 = scanner.hasNextLine() ? scanner.nextLine().trim() : "";
                int arg1 = 0;
                try { if(!raw1.isEmpty()) arg1 = Integer.parseInt(raw1); } catch(Exception e) {}

                var result = twoSum(arg0, arg1);
                
                // Sort Lists to ensure [4,9] matches [9,4]
                if (result instanceof List) {
                     Collections.sort((List<Integer>) result);
                }

                printResult(result);
                System.out.println();
                System.out.println(DELIMITER);

            } catch (Exception e) {
            } finally {
                scanner.close();
            }
        }
    }

    private static List<Integer> parseIntegerList(String raw) {
        if (raw == null || raw.isEmpty()) return new ArrayList<>();
        if (raw.startsWith("[")) raw = raw.substring(1);
        if (raw.endsWith("]")) raw = raw.substring(0, raw.length() - 1);
        
        raw = raw.trim();
        if (raw.isEmpty()) return new ArrayList<>();
        
        String[] parts = raw.split("[,\\s]+");
        List<Integer> list = new ArrayList<>();
        for (String part : parts) {
            if (!part.isEmpty()) {
                try { list.add(Integer.parseInt(part.trim())); } catch(Exception e) {}
            }
        }
        return list;
    }

    private static void printResult(Object result) {
        if (result instanceof List) {
            List<?> list = (List<?>) result;
            System.out.print("[");
            for (int i = 0; i < list.size(); i++) {
                System.out.print(list.get(i));
                if (i < list.size() - 1) System.out.print(",");
            }
            System.out.print("]");
        } else {
            System.out.print(result);
        }
    }
}