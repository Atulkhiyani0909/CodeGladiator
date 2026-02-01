import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// --- CONFIGURATION ---
const CONFIG_FILE = "problem_config.json"; 

// Global Delimiter Definition
const DELIMITER = "$$$DELIMITER$$$"; 

// --- TYPE MAPPING ---
const TYPE_MAP = {
    "int": { py: "int", js: "number", cpp: "int", java: "int" },
    "float": { py: "float", js: "number", cpp: "float", java: "double" },
    "string": { py: "str", js: "string", cpp: "string", java: "String" },
    "bool": { py: "bool", js: "boolean", cpp: "bool", java: "boolean" },
    "List<int>": { py: "List[int]", js: "number[]", cpp: "vector<int>", java: "List<Integer>" },
    "List<string>": { py: "List[str]", js: "string[]", cpp: "vector<string>", java: "List<String>" },
    "void": { py: "None", js: "void", cpp: "void", java: "void" }
};

// Helper to get a safe default return value so boilerplate compiles
function getDefaultReturn(type, lang) {
    if (type === "void") return "";
    if (type === "int" || type === "float") return "return 0;";
    if (type === "bool") return "return false;";
    
    // C++ specific defaults
    if (lang === 'cpp') {
        if (type === "string") return 'return "";';
        if (type.includes("List")) return 'return {};';
    }
    
    // Java specific defaults
    if (lang === 'java') {
        if (type === "string" || type.includes("List")) return 'return null;';
    }

    return "return 0;"; // Fallback
}

// ==========================================
// 1. SMART JAVASCRIPT DRIVER
// ==========================================
function getJsDriver(functionName, inputs) {
    const argParsingLogic = inputs.map((input, index) => {
        if (input.type.includes("List") || input.type.includes("vector")) {
            return `        // Arg ${index}: Smart Parse (JSON or Space-Separated)
        let arg${index};
        const raw${index} = lines[${index}].trim();
        if (raw${index}.startsWith('[')) {
            arg${index} = JSON.parse(raw${index});
        } else {
            arg${index} = raw${index}.split(/\\s+/).map(Number);
        }`;
        } else if (input.type === "int" || input.type === "float") {
             return `        const arg${index} = Number(lines[${index}]);`;
        } else {
             return `        const arg${index} = lines[${index}];`;
        }
    }).join("\n");

    const argsList = inputs.map((_, i) => `arg${i}`).join(", ");

    return `
// --- DRIVER CODE START ---
const fs = require('fs');

const DELIMITER = '${DELIMITER}';

try {
    if (!fs.existsSync('/app/input.txt')) throw new Error('Input file not found');
    const inputData = fs.readFileSync('/app/input.txt', 'utf-8');
    
    const testCases = inputData.split(DELIMITER).filter(tc => tc.trim() !== '');

    testCases.forEach((testCase) => {
        const lines = testCase.trim().split('\\n');
        
${argParsingLogic}

        if (typeof ${functionName} !== 'function') {
            throw new Error("Function '${functionName}' not found.");
        }
        
        const result = ${functionName}(${argsList});
        console.log(result);
        console.log(DELIMITER);
    });

} catch (err) {
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
            return `            # Arg ${index}: Smart Parse
            raw_val = lines[${index}].strip()
            if raw_val.startswith("["):
                arg${index} = json.loads(raw_val)
            else:
                arg${index} = [int(x) for x in raw_val.split()]`;
        } else if (input.type === "int") {
             return `            arg${index} = int(lines[${index}])`;
        } else if (input.type === "float") {
             return `            arg${index} = float(lines[${index}])`;
        } else {
             return `            arg${index} = lines[${index}].strip()`;
        }
    }).join("\n");

    const argsList = inputs.map((_, i) => `arg${i}`).join(", ");

    return `
# --- DRIVER CODE START ---
import sys
import os
import json

DELIMITER = "${DELIMITER}"

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
// 3. CPP DRIVER
// ==========================================
function getCppDriver(problem) { 
    const inputParsing = problem.inputs.map((inp, i) => {
        if (inp.type === "string") {
            return `string arg${i}; getline(ss, arg${i});`;
        }
        if (inp.type === "int") {
            return `int arg${i}; ss >> arg${i};`;
        }
        return `// Type ${inp.type} not fully supported in simple driver generator yet`; 
    }).join("\n                ");

    const argsCall = problem.inputs.map((_, i) => `arg${i}`).join(", ");
    const paramTypes = problem.inputs.map(inp => TYPE_MAP[inp.type]?.cpp || "int").join(", ");

    return `
#include <iostream>
#include <fstream>
#include <vector>
#include <string>
#include <sstream>
#include <algorithm>

using namespace std;

// USER CODE WILL BE INJECTED HERE

// Forward declaration just in case
${TYPE_MAP[problem.outputType]?.cpp || "int"} ${problem.functionName}(${paramTypes});

int main() {
    const string DELIMITER = "${DELIMITER}";
    
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

        testCase.erase(0, testCase.find_first_not_of(" \\n\\r\\t"));
        testCase.erase(testCase.find_last_not_of(" \\n\\r\\t") + 1);

        if (!testCase.empty()) {
            stringstream ss(testCase);

            ${inputParsing}

            auto result = ${problem.functionName}(${argsCall});
            cout << result << endl;
            cout << DELIMITER << endl;
        }

        if (pos == string::npos) break;
        prev = pos + DELIMITER.length();
    }
    return 0;
}
`;
}

// ==========================================
// 4. JAVA DRIVER
// ==========================================
function getJavaDriver(problem) { 
    const inputParsing = problem.inputs.map((inp, i) => {
        if (inp.type === "string") {
            return `String arg${i} = scanner.next();`;
        }
        if (inp.type === "int") {
            return `int arg${i} = scanner.nextInt();`;
        }
         return `// Type ${inp.type} not fully supported in generator`; 
    }).join("\n                ");

    const argsCall = problem.inputs.map((_, i) => `arg${i}`).join(", ");

    return `
import java.io.*;
import java.nio.file.*;
import java.util.*;

public class Run {

    //_USER_CODE_HERE_

    public static void main(String[] args) {
        final String DELIMITER = "${DELIMITER}";
        final String INPUT_FILE = "/app/input.txt";

        String content;
        try {
            content = Files.readString(Paths.get(INPUT_FILE));
        } catch (IOException e) {
            System.err.println("Input file not found");
            return;
        }

        int prev = 0;
        int pos;

        while (true) {
            pos = content.indexOf(DELIMITER, prev);
            String testCase = (pos != -1)
                ? content.substring(prev, pos)
                : content.substring(prev);

            if (!testCase.trim().isEmpty()) {
                Scanner scanner = new Scanner(testCase.trim());

                ${inputParsing}

                // Assuming static method
                var result = ${problem.functionName}(${argsCall});
                System.out.println(result);
                System.out.println(DELIMITER);

                scanner.close();
            }

            if (pos == -1) break;
            prev = pos + DELIMITER.length();
        }
    }
}
`;
}

// ==========================================
// 5. BOILERPLATE & MAIN
// ==========================================

function generateBoilerplate(config) {
    const { functionName, inputs, outputType } = config;

    // --- 1. JAVASCRIPT ---
    const jsParams = inputs.map(i => i.name).join(", ");
    const jsCode = `
/**
 * @param {${TYPE_MAP[inputs[0].type]?.js || "any"}} ${jsParams}
 * @return {${TYPE_MAP[outputType]?.js || "any"}}
 */
function ${functionName}(${jsParams}) {
  // Write your code here
  return 0;
}
`;

    // --- 2. PYTHON ---
    const pyParams = inputs.map(i => `${i.name}: ${TYPE_MAP[i.type]?.py || "Any"}`).join(", ");
    const pyCode = `
from typing import List, Dict, Optional
import json

class Solution:
    def ${functionName}(self, ${pyParams}) -> ${TYPE_MAP[outputType]?.py || "Any"}:
        # Write your code here
        return 0
`;

    // --- 3. C++ ---
    const cppParams = inputs.map(i => `${TYPE_MAP[i.type]?.cpp || "int"} ${i.name}`).join(", ");
    const cppReturn = TYPE_MAP[outputType]?.cpp || "void";
    const cppDefault = getDefaultReturn(outputType, 'cpp');
    
    const cppCode = `
#include <bits/stdc++.h>
using namespace std;

${cppReturn} ${functionName}(${cppParams}) {
    // Write your code here
    ${cppDefault}
}
`;

    // --- 4. JAVA ---
    const javaParams = inputs.map(i => `${TYPE_MAP[i.type]?.java || "int"} ${i.name}`).join(", ");
    const javaReturn = TYPE_MAP[outputType]?.java || "void";
    const javaDefault = getDefaultReturn(outputType, 'java');

    // Note: We use a static method because the Driver calls it directly inside main()
    const javaCode = `
public static ${javaReturn} ${functionName}(${javaParams}) {
    // Write your code here
    ${javaDefault}
}
`;

    return { 
        py: pyCode.trim(), 
        js: jsCode.trim(), 
        cpp: cppCode.trim(), 
        java: javaCode.trim() 
    };
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

    // Cleanup & Create Dirs
    if (fs.existsSync(baseDir)) fs.rmSync(baseDir, { recursive: true, force: true });
    [boilerplateDir, inputDir, outputDir, driversDir].forEach(d => fs.mkdirSync(d, { recursive: true }));
    
    // Create Language Specific Dirs
    ['python', 'javascript', 'java', 'cpp'].forEach(lang => {
        fs.mkdirSync(path.join(driversDir, lang), { recursive: true });
    });

    // Generate Input/Output Files
    let fullInput = "";
    let fullOutput = "";
    const FILE_DELIMITER = "\n" + DELIMITER + "\n"; 

    config.testCases.forEach((tc, index) => {
        const i = index + 1;
        fs.writeFileSync(path.join(inputDir, `${i}.txt`), tc.input);
        fs.writeFileSync(path.join(outputDir, `${i}.txt`), tc.output);
        fullInput += tc.input + FILE_DELIMITER;
        fullOutput += tc.output + FILE_DELIMITER;
    });

    // Save Batches 
    fs.writeFileSync(path.join(inputDir, "mount_data.txt"), fullInput.slice(0, -FILE_DELIMITER.length));
    fs.writeFileSync(path.join(outputDir, "expected_data.txt"), fullOutput.slice(0, -FILE_DELIMITER.length));

    // --- GENERATE BOILERPLATE (ALL LANGUAGES) ---
    const code = generateBoilerplate(config);
    fs.writeFileSync(path.join(boilerplateDir, "function.py"), code.py);
    fs.writeFileSync(path.join(boilerplateDir, "function.js"), code.js);
    fs.writeFileSync(path.join(boilerplateDir, "function.cpp"), code.cpp);
    fs.writeFileSync(path.join(boilerplateDir, "function.java"), code.java);

    // --- GENERATE DRIVERS ---
    
    // Python
    const pyDriver = getPyDriver(config.functionName, config.inputs);
    fs.writeFileSync(path.join(driversDir, "python", "driver.py"), pyDriver.trim());

    // Javascript
    const jsDriver = getJsDriver(config.functionName, config.inputs);
    fs.writeFileSync(path.join(driversDir, "javascript", "driver.js"), jsDriver.trim());

    // Java 
    const javaDriver = getJavaDriver(config); 
    fs.writeFileSync(path.join(driversDir, "java", "Run.java"), javaDriver.trim());

    // C++ 
    const cppDriver = getCppDriver(config);
    fs.writeFileSync(path.join(driversDir, "cpp", "driver.cpp"), cppDriver.trim());

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