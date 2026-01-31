// --- DRIVER CODE START ---
#include <iostream>
#include <fstream>
#include <vector>
#include <string>
#include <sstream>
#include <algorithm>

// User function declaration (assuming it exists)
long long calculateFactorial(int n);

int main() {
    const std::string DELIMITER = "$$$DELIMITER$$$";
    const std::string INPUT_FILE = "/app/input.txt";

    // 1. Read the entire file into memory (Same as fs.readFileSync)
    std::ifstream file(INPUT_FILE);
    if (!file.is_open()) {
        std::cerr << "Driver Error: Input file not found" << std::endl;
        return 1;
    }

    std::stringstream buffer;
    buffer << file.rdbuf();
    std::string content = buffer.str();
    file.close();

    // 2. Logic to Split by DELIMITER and handle the "last" chunk
    size_t prev = 0;
    size_t pos = 0;

    while (true) {
        pos = content.find(DELIMITER, prev);

        // Determine the length of the current chunk
        // If pos is npos (not found), we take the rest of the string
        size_t len = (pos == std::string::npos) ? std::string::npos : (pos - prev);
        
        std::string testCase = content.substr(prev, len);

        // 3. Trim and Filter Empty (Same as .filter(tc => tc.trim() !== ''))
        // Only process if the string contains non-whitespace characters
        if (testCase.find_first_not_of(" \n\r\t") != std::string::npos) {
            
            std::stringstream ss(testCase);
            int arg0;
            
            // Read the integer (skips whitespace automatically like Number(lines[0]))
            if (ss >> arg0) {
                try {
                    // Call User Function
                    long long result = calculateFactorial(arg0);

                    // Print Result
                    std::cout << result << std::endl;
                    std::cout << DELIMITER << std::endl;
                } catch (...) {
                     std::cerr << "Driver Error: Exception in user function" << std::endl;
                }
            }
        }

        // Break loop if we just processed the last chunk
        if (pos == std::string::npos) break;

        // Move pointer past the delimiter
        prev = pos + DELIMITER.length();
    }

    return 0;
}
// --- DRIVER CODE END ---