// --- DRIVER CODE START ---
const fs = require('fs');

const DELIMITER = '$$$DELIMITER$$$';

try {
    if (!fs.existsSync('/app/input.txt')) throw new Error('Input file not found');
    const inputData = fs.readFileSync('/app/input.txt', 'utf-8');
    
    // Split by delimiter and filter empty lines
    const testCases = inputData.split(DELIMITER).filter(tc => tc.trim() !== '');

    testCases.forEach((testCase) => {
        // Split input by newlines to separate arguments
        const lines = testCase.trim().split('\n');
        
        // Arg 0: Number
        const arg0 = Number(lines[0]);
        // Arg 1: Smart Parse (JSON or Space-Separated)
        let arg1;
        const raw1 = lines[1].trim();
        if (raw1.startsWith('[')) {
            // It looks like JSON array
            arg1 = JSON.parse(raw1);
        } else {
            // Fallback: Space-separated (e.g. "1 2 3 4")
            arg1 = raw1.split(/\s+/).map(Number);
        }

        // Call User Function
        if (typeof findMax !== 'function') {
            throw new Error("Function 'findMax' not found. Did you name it correctly?");
        }
        
        const result = findMax(arg0, arg1);

        // Print Result
        console.log(result);
        console.log(DELIMITER);
    });

} catch (err) {
    // Print to Stderr so our Node.js Worker can catch it
    console.error("Driver Error:", err.message);
    process.exit(1);
}
// --- DRIVER CODE END ---