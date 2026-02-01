#include <iostream>
#include <vector>
#include <string>
#include <sstream>
#include <algorithm>
#include <fstream> 

using namespace std;

// USER CODE WILL BE INJECTED HERE

string reverseString(string);

// Helper: Print Vector as [1,2,3] (No spaces)
template <typename T>
void printResult(const vector<T>& v) {
    cout << "[";
    for (size_t i = 0; i < v.size(); ++i) {
        cout << v[i];
        if (i < v.size() - 1) cout << ",";
    }
    cout << "]";
}

template <typename T>
void printResult(const T& val) {
    cout << val;
}

int main() {
    const string DELIMITER = "$$$DELIMITER$$$";
    
    stringstream buffer;
    buffer << cin.rdbuf(); 
    string content = buffer.str();

    // Use file reader if cin is empty (fallback)
    if (content.empty()) {
        ifstream t("/app/input.txt");
        if(t.is_open()) {
            stringstream fbuffer;
            fbuffer << t.rdbuf();
            content = fbuffer.str();
        }
    }

    size_t prev = 0;
    while (true) {
        size_t pos = content.find(DELIMITER, prev);
        string testCase = (pos != string::npos) ? content.substr(prev, pos - prev) : content.substr(prev);
        
        // Cleanup whitespace
        testCase.erase(0, testCase.find_first_not_of(" \n\r\t"));
        testCase.erase(testCase.find_last_not_of(" \n\r\t") + 1);

        if (!testCase.empty()) {
            stringstream ss(testCase);
            string arg0; getline(ss, arg0);
            
            auto result = reverseString(arg0);
            
            // Sort result for set-based problems
            // sort(result.begin(), result.end());

            printResult(result);
            cout << endl << DELIMITER << endl;
        }

        if (pos == string::npos) break;
        prev = pos + DELIMITER.length();
    }
    return 0;
}