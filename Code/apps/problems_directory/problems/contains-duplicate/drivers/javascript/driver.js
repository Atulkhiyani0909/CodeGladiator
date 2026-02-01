const fs = require('fs');
const DELIMITER = '$$$DELIMITER$$$';

try {
    const inputData = fs.readFileSync('/app/input.txt', 'utf-8');
    const testCases = inputData.split(DELIMITER).filter(tc => tc.trim() !== '');

    testCases.forEach((testCase) => {
        const lines = testCase.trim().split('\n');
        // Arg 0: List/Array
        let arg0;
        const raw0 = lines[0].trim();
        if (raw0.startsWith('[')) {
            arg0 = JSON.parse(raw0);
        } else {
            arg0 = raw0.split(/\s+/).map(Number);
        }

        const result = containsDuplicate(arg0);
        
        // Ensure standard JSON format (no extra spaces)
        console.log(JSON.stringify(result));
        console.log(DELIMITER);
    });
} catch (err) {
    console.error(err);
}