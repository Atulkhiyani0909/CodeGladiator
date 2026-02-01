#include <iostream>
#include <fstream>
#include <vector>
#include <string>
#include <sstream>
#include <algorithm>

using namespace std;

// USER CODE WILL BE INJECTED HERE

// Forward declaration just in case
vector<int> intersection(vector<int>, vector<int>);

int main() {
    const string DELIMITER = "$$$DELIMITER$$$";
    
    ifstream t("/app/input.txt");
    stringstream buffer;
    buffer << t.rdbuf();
    string content = buffer.str();

    size_t prev = 0;
    while (true) {
        size_t pos = content.find(DELIMITER, prev);
        string testCase = (pos != string::npos)
            ? content.substr(prev, pos - prev)
            : content.substr(prev);

        testCase.erase(0, testCase.find_first_not_of(" \n\r\t"));
        testCase.erase(testCase.find_last_not_of(" \n\r\t") + 1);

        if (!testCase.empty()) {
            stringstream ss(testCase);

            // Type List<int> not fully supported in simple driver generator yet
                // Type List<int> not fully supported in simple driver generator yet

            auto result = intersection(arg0, arg1);
            cout << result << endl;
            cout << DELIMITER << endl;
        }

        if (pos == string::npos) break;
        prev = pos + DELIMITER.length();
    }
    return 0;
}