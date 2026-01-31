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
                
            lines = test_case.strip().split('\n')
            
            arg0 = lines[0].strip()

            result = sol.countVowels(arg0)
            print(result)
            print(DELIMITER)
            
    except Exception as e:
        sys.stderr.write(f"Driver Error: {str(e)}\n")
        sys.exit(1)

if __name__ == "__main__":
    main()
# --- DRIVER CODE END ---