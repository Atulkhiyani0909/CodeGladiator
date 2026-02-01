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
            
            raw_val = lines[0].strip()
            if raw_val.startswith("["):
                arg0 = json.loads(raw_val)
            else:
                arg0 = [int(x) for x in raw_val.split()]
            arg1 = int(lines[1])

            result = sol.twoSum(arg0, arg1)
            
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