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
            
        arg0 = int(lines[0])
        # Arg 1: Smart Parse (JSON or Space-Separated)
            raw_val = lines[1].strip()
            if raw_val.startswith("["):
                arg1 = json.loads(raw_val)
            else:
                arg1 = [int(x) for x in raw_val.split()]

            result = sol.arraySum(arg0, arg1)
            print(result)
            print(DELIMITER)
            
    except Exception as e:
        sys.stderr.write(f"Driver Error: {str(e)}\n")
        sys.exit(1)

if __name__ == "__main__":
    main()
# --- DRIVER CODE END ---