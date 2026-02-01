import axios from 'axios';

export const loadProblemData = async (slug: string) => {
    try {
        // 1. Perform requests inside the try block so errors are caught
        const [inputRes, outputRes] = await Promise.all([
            axios.get(`https://raw.githubusercontent.com/Atulkhiyani0909/CodeGladiator/main/Code/apps/problems_directory/problems/${slug}/input/mount_data.txt`),
            axios.get(`https://raw.githubusercontent.com/Atulkhiyani0909/CodeGladiator/main/Code/apps/problems_directory/problems/${slug}/output/expected_data.txt`)
        ]);

        // 2. Extract the actual text content using .data
        // Axios stores the response body in the 'data' property
        const fullInputs = inputRes.data;
        const fullOutputs = outputRes.data;

        // 3. Basic validation to ensure we didn't get an object/JSON by mistake
        if (typeof fullInputs !== 'string' || typeof fullOutputs !== 'string') {
            throw new Error("Invalid data format: Expected string content");
        }

        
        return { fullInputs, fullOutputs };

    } catch (error: any) {
        console.error(`❌ Failed to load problem data for ${slug}:`, error.message);
        // Throw a clean error message for your UI to handle
        throw new Error(`Failed to load test cases for '${slug}'. Ensure the GitHub paths are correct.`);
    }
};


