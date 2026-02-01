import prisma from "./DB/db.js";

const insert = async () => {
    try {
        await prisma.problem.createMany({
            skipDuplicates: true,
            data: [
                {
                    slug: "contains-duplicate",
                    title: "Contains Duplicate",
                    difficulty: "EASY",
                    description: "Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.",
                    testCases: [
                        { input: { nums: [1, 2, 3, 1] }, output: true },
                        { input: { nums: [1, 2, 3, 4] }, output: false },
                        { input: { nums: [1, 1, 1, 3, 3, 4, 3, 2, 4, 2] }, output: true }
                    ]
                },
                {
                    slug: "find-max",
                    title: "Find Maximum",
                    difficulty: "EASY",
                    description: "Given an array of integers nums, find and return the maximum element in the array.",
                    testCases: [
                        { input: { nums: [1, 2, 3, 4, 5] }, output: 5 },
                        { input: { nums: [-10, -5, -2, -1] }, output: -1 },
                        { input: { nums: [100, 20, 50] }, output: 100 }
                    ]
                },
                {
                    slug: "fizz-buzz",
                    title: "Fizz Buzz",
                    difficulty: "EASY",
                    description: "Given an integer n, return a string array answer (1-indexed) where: answer[i] == 'FizzBuzz' if i is divisible by 3 and 5, 'Fizz' if i is divisible by 3, 'Buzz' if i is divisible by 5, and i as a string otherwise.",
                    testCases: [
                        { input: { n: 3 }, output: ["1", "2", "Fizz"] },
                        { input: { n: 5 }, output: ["1", "2", "Fizz", "4", "Buzz"] },
                        { input: { n: 15 }, output: ["1", "2", "Fizz", "4", "Buzz", "Fizz", "7", "8", "Fizz", "Buzz", "11", "Fizz", "13", "14", "FizzBuzz"] }
                    ]
                },
                {
                    slug: "missing-number",
                    title: "Missing Number",
                    difficulty: "EASY",
                    description: "Given an array nums containing n distinct numbers in the range [0, n], return the only number in the range that is missing from the array.",
                    testCases: [
                        { input: { nums: [3, 0, 1] }, output: 2 },
                        { input: { nums: [0, 1] }, output: 2 },
                        { input: { nums: [9, 6, 4, 2, 3, 5, 7, 0, 1] }, output: 8 }
                    ]
                },
                {
                    slug: "palindrome-number",
                    title: "Palindrome Number",
                    difficulty: "EASY",
                    description: "Given an integer x, return true if x is a palindrome, and false otherwise.",
                    testCases: [
                        { input: { x: 121 }, output: true },
                        { input: { x: -121 }, output: false },
                        { input: { x: 10 }, output: false }
                    ]
                },
                {
                    slug: "remove-duplicates",
                    title: "Remove Duplicates",
                    difficulty: "EASY",
                    description: "Given an integer array nums sorted in non-decreasing order, remove the duplicates in-place such that each unique element appears only once.",
                    testCases: [
                        { input: { nums: [1, 1, 2] }, output: [1, 2] },
                        { input: { nums: [0, 0, 1, 1, 1, 2, 2, 3, 3, 4] }, output: [0, 1, 2, 3, 4] }
                    ]
                },
                {
                    slug: "reverse-string",
                    title: "Reverse String",
                    difficulty: "EASY",
                    description: "Write a function that reverses a string. The input string is given as an argument s. You must return the reversed string.",
                    testCases: [
                        { input: { s: "hello" }, output: "olleh" },
                        { input: { s: "Hannah" }, output: "hannaH" }
                    ]
                },
                {
                    slug: "two-sum",
                    title: "Two Sum",
                    difficulty: "EASY",
                    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
                    testCases: [
                        { input: { nums: [2, 7, 11, 15], target: 9 }, output: [0, 1] },
                        { input: { nums: [3, 2, 4], target: 6 }, output: [1, 2] },
                        { input: { nums: [3, 3], target: 6 }, output: [0, 1] }
                    ]
                },
                {
                    slug: "valid-anagram",
                    title: "Valid Anagram",
                    difficulty: "EASY",
                    description: "Given two strings s and t, return true if t is an anagram of s, and false otherwise.",
                    testCases: [
                        { input: { s: "anagram", t: "nagaram" }, output: true },
                        { input: { s: "rat", t: "car" }, output: false }
                    ]
                }
            ]
        });
        console.log("✅ Database seeded successfully!");
    } catch (e) {
        console.error("❌ Error seeding database:", e);
    } finally {
        await prisma.$disconnect();
    }
};

insert();