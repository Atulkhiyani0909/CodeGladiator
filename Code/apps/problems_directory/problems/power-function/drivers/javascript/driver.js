// --- DRIVER CODE START ---
const fs = require('fs');

const DELIMITER = '$$$DELIMITER$$$';

try {
    if (!fs.existsSync('/app/input.txt')) throw new Error('Input file not found');
    const inputData = fs.readFileSync('/app/input.txt', 'utf-8');
    
    const testCases = inputData.split(DELIMITER).filter(tc => tc.trim() !== '');

    testCases.forEach((testCase) => {
        const lines = testCase.trim().split('\n');
        
        const arg0 = Number(lines[0]);
        const arg1 = Number(lines[1]);

        if (typeof myPow !== 'function') {
            throw new Error("Function 'myPow' not found.");
        }
        
        const result = myPow(arg0, arg1);
        console.log(result);
        console.log(DELIMITER);
    });

} catch (err) {
    console.error("Driver Error:", err.message);
    process.exit(1);
}
// --- DRIVER CODE END ---