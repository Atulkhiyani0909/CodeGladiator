// --- DRIVER CODE START ---
const fs = require('fs');

const DELIMITER = '$$$DELIMITER$$$';

try {
    if (!fs.existsSync('/app/input.txt')) throw new Error('Input file not found');
    const inputData = fs.readFileSync('/app/input.txt', 'utf-8');
    
    const testCases = inputData.split(DELIMITER).filter(tc => tc.trim() !== '');

    testCases.forEach((testCase) => {
        const lines = testCase.trim().split('\n');
        
        const arg0 = lines[0];

        if (typeof reverseString !== 'function') {
            throw new Error("Function 'reverseString' not found.");
        }
        
        const result = reverseString(arg0);
        console.log(result);
        console.log(DELIMITER);
    });

} catch (err) {
    console.error("Driver Error:", err.message);
    process.exit(1);
}
// --- DRIVER CODE END ---