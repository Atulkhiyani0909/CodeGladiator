const fs = require('fs');
const DELIMITER = '$$$DELIMITER$$$';

try {
    const inputData = fs.readFileSync('/app/input.txt', 'utf-8');
    const testCases = inputData.split(DELIMITER).filter(tc => tc.trim() !== '');

    testCases.forEach((testCase) => {
        const lines = testCase.trim().split('\n');
        const arg0 = lines[0];

        const result = reverseString(arg0);
        
        // Ensure standard JSON format (no extra spaces)
        console.log(JSON.stringify(result));
        console.log(DELIMITER);
    });
} catch (err) {
    console.error(err);
}