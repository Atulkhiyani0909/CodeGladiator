// --- DRIVER CODE START ---
const fs = require('fs');

const DELIMITER = '$$$DELIMITER$$$';

try {
    if (!fs.existsSync('/app/input.txt')) throw new Error('Input file not found');
    const inputData = fs.readFileSync('/app/input.txt', 'utf-8');
    
    const testCases = inputData.split(DELIMITER).filter(tc => tc.trim() !== '');

    testCases.forEach((testCase) => {
        const lines = testCase.trim().split('\n');
        
        // Arg 0: Smart Parse (JSON or Space-Separated)
        let arg0;
        const raw0 = lines[0].trim();
        if (raw0.startsWith('[')) {
            arg0 = JSON.parse(raw0);
        } else {
            arg0 = raw0.split(/\s+/).map(Number);
        }

        if (typeof removeDuplicates !== 'function') {
            throw new Error("Function 'removeDuplicates' not found.");
        }
        
        const result = removeDuplicates(arg0);
        console.log(result);
        console.log(DELIMITER);
    });

} catch (err) {
    console.error("Driver Error:", err.message);
    process.exit(1);
}
// --- DRIVER CODE END ---