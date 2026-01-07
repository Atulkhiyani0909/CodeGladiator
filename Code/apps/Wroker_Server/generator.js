import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// --- ESM FIX ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// --- CONFIGURATION ---
const CONFIG_FILE = "problem_config.json"; 

// --- TYPE MAPPING ---
const TYPE_MAP = {
    "int": { py: "int", js: "number" },
    "float": { py: "float", js: "number" },
    "string": { py: "str", js: "string" },
    "bool": { py: "bool", js: "boolean" },
    "List<int>": { py: "List[int]", js: "number[]" },
    "List<string>": { py: "List[str]", js: "string[]" },
    "void": { py: "None", js: "void" }
};

// ==========================================
// 1. SMART JAVASCRIPT DRIVER
// ==========================================
function getJsDriver(functionName, inputs) {
    const argParsingLogic = inputs.map((input, index) => {
        // CHECK: Is this an Array/List type?
        if (input.type.includes("List") || input.type.includes("vector")) {
            return `        // Arg ${index}: Smart Parse (JSON or Space-Separated)
        let arg${index};
        const raw${index} = lines[${index}].trim();
        if (raw${index}.startsWith('[')) {
            // It looks like JSON array
            arg${index} = JSON.parse(raw${index});
        } else {
            // Fallback: Space-separated (e.g. "1 2 3 4")
            arg${index} = raw${index}.split(/\\s+/).map(Number);
        }`;
        } else if (input.type === "int" || input.type === "float") {
             return `        // Arg ${index}: Number
        const arg${index} = Number(lines[${index}]);`;
        } else {
             return `        // Arg ${index}: String
        const arg${index} = lines[${index}];`;
        }
    }).join("\n");

    const argsList = inputs.map((_, i) => `arg${i}`).join(", ");

    return `
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
        const lines = testCase.trim().split('\\n');
        
${argParsingLogic}

        // Call User Function
        if (typeof ${functionName} !== 'function') {
            throw new Error("Function '${functionName}' not found. Did you name it correctly?");
        }
        
        const result = ${functionName}(${argsList});

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
`;
}

// ==========================================
// 2. SMART PYTHON DRIVER
// ==========================================
function getPyDriver(functionName, inputs) {
    const argParsingLogic = inputs.map((input, index) => {
        if (input.type.includes("List") || input.type.includes("vector")) {
            return `        # Arg ${index}: Smart Parse (JSON or Space-Separated)
            raw_val = lines[${index}].strip()
            if raw_val.startswith("["):
                arg${index} = json.loads(raw_val)
            else:
                arg${index} = [int(x) for x in raw_val.split()]`;
        } else if (input.type === "int") {
             return `        arg${index} = int(lines[${index}])`;
        } else if (input.type === "float") {
             return `        arg${index} = float(lines[${index}])`;
        } else {
             return `        arg${index} = lines[${index}].strip()`;
        }
    }).join("\n");

    const argsList = inputs.map((_, i) => `arg${i}`).join(", ");

    return `
# --- DRIVER CODE START ---
import sys
import os
import json

DELIMITER = "$$$DELIMITER$$$"

def main():
    try:
        with open("/app/input.txt", "r") as f:
            input_data = f.read()
            
        test_cases = input_data.split(DELIMITER)
        sol = Solution()
        
        for test_case in test_cases:
            if not test_case.strip():
                continue
                
            lines = test_case.strip().split('\\n')
            
${argParsingLogic}

            result = sol.${functionName}(${argsList})
            print(result)
            print(DELIMITER)
            
    except Exception as e:
        sys.stderr.write(f"Driver Error: {str(e)}\\n")
        sys.exit(1)

if __name__ == "__main__":
    main()
# --- DRIVER CODE END ---
`;
}

// ==========================================
// 3. MAIN LOGIC (UNCHANGED)
// ==========================================

function generateBoilerplate(config) {
    const { functionName, inputs, outputType } = config;

    // JS Boilerplate
    const jsParams = inputs.map(i => i.name).join(", ");
    const jsDocParams = inputs.map(i => ` * @param {${TYPE_MAP[i.type]?.js || "any"}} ${i.name}`).join("\n");
    const jsReturn = TYPE_MAP[outputType]?.js || "any";

    const jsCode = 
`/**
${jsDocParams}
 * @returns {${jsReturn}}
 */
function ${functionName}(${jsParams}) {
  // Write your code here
  return 0;
}
`;

    // Python Boilerplate
    let pyImports = "from typing import List, Dict, Optional\nimport json\n\n";
    const pyParams = inputs.map(i => `${i.name}: ${TYPE_MAP[i.type]?.py || "Any"}`).join(", ");
    const pyReturn = TYPE_MAP[outputType]?.py || "Any";

    const pyCode = 
`${pyImports}class Solution:
    def ${functionName}(self, ${pyParams}) -> ${pyReturn}:
        # Write your code here
        return 0
`;

    return { py: pyCode, js: jsCode };
}

function createProblem() {
    const configPath = path.join(__dirname, CONFIG_FILE);
    if (!fs.existsSync(configPath)) {
        console.error(`❌ Config file not found: ${CONFIG_FILE}`);
        return;
    }
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    
    console.log(`🚀 Generating problem: ${config.name}...`);

    const baseDir = path.join(__dirname, "problems", config.slug);
    const boilerplateDir = path.join(baseDir, "boilerplate");
    const inputDir = path.join(baseDir, "input");
    const outputDir = path.join(baseDir, "output");
    const driversDir = path.join(baseDir, "drivers");

    // Cleanup & Create
    if (fs.existsSync(baseDir)) {
        fs.rmSync(baseDir, { recursive: true, force: true });
    }
    fs.mkdirSync(boilerplateDir, { recursive: true });
    fs.mkdirSync(inputDir, { recursive: true });
    fs.mkdirSync(outputDir, { recursive: true });
    fs.mkdirSync(driversDir, { recursive: true });
    fs.mkdirSync(path.join(driversDir, "python"), { recursive: true });
    fs.mkdirSync(path.join(driversDir, "javascript"), { recursive: true });

    // Generate Test Cases
    let fullInput = "";
    let fullOutput = "";
    const DELIMITER = "\n$$$DELIMITER$$$\n";

    config.testCases.forEach((tc, index) => {
        const i = index + 1;
        fs.writeFileSync(path.join(inputDir, `${i}.txt`), tc.input);
        fs.writeFileSync(path.join(outputDir, `${i}.txt`), tc.output);
        fullInput += tc.input + DELIMITER;
        fullOutput += tc.output + DELIMITER;
    });

    // Save Batches
    const trimmedInput = fullInput.slice(0, -DELIMITER.length);
    const trimmedOutput = fullOutput.slice(0, -DELIMITER.length);
    fs.writeFileSync(path.join(inputDir, "mount_data.txt"), trimmedInput);
    fs.writeFileSync(path.join(outputDir, "expected_data.txt"), trimmedOutput);

    // Generate Boilerplate
    const code = generateBoilerplate(config);
    fs.writeFileSync(path.join(boilerplateDir, "function.py"), code.py);
    fs.writeFileSync(path.join(boilerplateDir, "function.js"), code.js);

    // --- GENERATE DRIVERS ---
    const pyDriver = getPyDriver(config.functionName, config.inputs);
    fs.writeFileSync(path.join(driversDir, "python", "driver.py"), pyDriver.trim());

    const jsDriver = getJsDriver(config.functionName, config.inputs);
    fs.writeFileSync(path.join(driversDir, "javascript", "driver.js"), jsDriver.trim());

    // Save Metadata
    const metadata = {
        slug: config.slug,
        name: config.name,
        params: config.inputs,
        returnType: config.outputType,
        totalTestCases: config.testCases.length
    };
    fs.writeFileSync(path.join(baseDir, "problem.json"), JSON.stringify(metadata, null, 2));

    console.log(`✅ Success! Problem created at ./problems/${config.slug}`);
}

createProblem();