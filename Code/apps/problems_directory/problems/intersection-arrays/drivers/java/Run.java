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

        // Split the full input file by the delimiter
        String[] testCases = content.split(java.util.regex.Pattern.quote(DELIMITER));

        for (String testCase : testCases) {
            // Skip empty cases (often caused by trailing newlines)
            if (testCase.trim().isEmpty()) continue;

            Scanner scanner = new Scanner(testCase.trim());
            
            // ❌ OLD WAY: int arg0 = scanner.nextInt(); (CRASHES on "[")
            // ✅ NEW WAY: Read the whole line and parse it manually
            String line1 = scanner.hasNextLine() ? scanner.nextLine() : "[]";
            String line2 = scanner.hasNextLine() ? scanner.nextLine() : "[]";

            // Parse the strings "[1, 2, 3]" into List<Integer>
            List<Integer> nums1 = parseList(line1);
            List<Integer> nums2 = parseList(line2);

            try {
                // Call user's function
                List<Integer> result = intersection(nums1, nums2);
                
                // Print with correct format
                printList(result);
                System.out.println(); 
                System.out.println(DELIMITER);
                
            } catch (Exception e) {
                // e.printStackTrace(); 
            } finally {
                scanner.close();
            }
        }
    }

    // --- HELPER 1: Parse string "[1, 2, 3]" -> List<Integer> ---
    private static List<Integer> parseList(String line) {
        line = line.trim();
        // Return empty list if string is empty or just "[]"
        if (line.equals("[]") || line.isEmpty()) return new ArrayList<>();

        // Remove brackets [ and ]
        if (line.startsWith("[")) line = line.substring(1);
        if (line.endsWith("]")) line = line.substring(0, line.length() - 1);
        
        line = line.trim();
        if (line.isEmpty()) return new ArrayList<>();

        List<Integer> list = new ArrayList<>();
        // Split by comma or whitespace (handles "[1, 2]" and "[1,2]")
        String[] parts = line.split("[,\\s]+");
        
        for (String s : parts) {
            if (!s.isEmpty()) {
                try {
                    list.add(Integer.parseInt(s.trim()));
                } catch (NumberFormatException e) {
                    // Ignore non-number parts
                }
            }
        }
        return list;
    }

    // --- HELPER 2: Print List as "[1, 2]" ---
    private static void printList(List<Integer> list) {
        if (list == null) {
            System.out.print("[]");
            return;
        }
        System.out.print("[");
        for (int i = 0; i < list.size(); i++) {
            System.out.print(list.get(i));
            if (i < list.size() - 1) {
                System.out.print(", ");
            }
        }
        System.out.print("]");
    }
}
