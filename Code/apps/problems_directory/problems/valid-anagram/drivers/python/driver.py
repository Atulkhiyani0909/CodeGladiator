import sys
import json

DELIMITER = "$$$DELIMITER$$$"

def main():
    try:
        with open("/app/input.txt", "r") as f:
            input_data = f.read()
            
        test_cases = input_data.split(DELIMITER)
        sol = Solution()
        
        for test_case in test_cases:
            if not test_case.strip(): continue
            lines = test_case.strip().split('\n')
            
            arg0 = lines[0].strip()
            arg1 = lines[1].strip()

            result = sol.isAnagram(arg0, arg1)
            
            # Sort lists to ensure [4,9] matches [9,4]
            if isinstance(result, list):
                result.sort()
            
            # Use json.dumps to print [1,2] without spaces
            print(json.dumps(result, separators=(',', ':')))
            print(DELIMITER)
            
    except Exception as e:
        sys.stderr.write(str(e))

if __name__ == "__main__":
    main()