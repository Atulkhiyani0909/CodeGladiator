import prisma from "./DB/db.js";

const insert = async () => {
    const res = await prisma.problem.createMany({
        skipDuplicates:true,
        data: [
            {
                "slug": "reverse-string",
                "title": "Reverse String",
                "difficulty": "EASY",
                "description": "Write a function that reverses a string. The input string is given as an argument s. You must return the reversed string.",
                "testCases": [
                    { "input": { "s": "hello" }, "output": "olleh" },
                    { "input": { "s": "Hannah" }, "output": "hannaH" }
                ]
            },
            {
                "slug": "check-palindrome",
                "title": "Check Palindrome",
                "difficulty": "EASY",
                "description": "Given a string text, return true if it is a palindrome, or false otherwise. A palindrome is a word, phrase, number, or other sequence of characters that reads the same forward and backward.",
                "testCases": [
                    { "input": { "text": "racecar" }, "output": true },
                    { "input": { "text": "hello" }, "output": false },
                    { "input": { "text": "madam" }, "output": true }
                ]
            },
            {
                "slug": "fibonacci-number",
                "title": "Fibonacci Number",
                "difficulty": "EASY",
                "description": "The Fibonacci numbers, commonly denoted F(n) form a sequence, called the Fibonacci sequence, such that each number is the sum of the two preceding ones, starting from 0 and 1. Given n, calculate F(n).",
                "testCases": [
                    { "input": { "n": 2 }, "output": 1 },
                    { "input": { "n": 3 }, "output": 2 },
                    { "input": { "n": 4 }, "output": 3 }
                ]
            },
            {
                "slug": "find-maximum",
                "title": "Find Maximum Element",
                "difficulty": "EASY",
                "description": "Given an array of integers nums, find and return the maximum element in the array.",
                "testCases": [
                    { "input": { "nums": [1, 2, 3, 4, 5] }, "output": 5 },
                    { "input": { "nums": [-10, -5, -2, -1] }, "output": -1 },
                    { "input": { "nums": [100, 20, 50] }, "output": 100 }
                ]
            },
            {
                "slug": "two-sum",
                "title": "Two Sum",
                "difficulty": "EASY",
                "description": "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution.",
                "testCases": [
                    { "input": { "nums": [2, 7, 11, 15], "target": 9 }, "output": [0, 1] },
                    { "input": { "nums": [3, 2, 4], "target": 6 }, "output": [1, 2] },
                    { "input": { "nums": [3, 3], "target": 6 }, "output": [0, 1] }
                ]
            },
            {
                "slug": "valid-parentheses",
                "title": "Valid Parentheses",
                "difficulty": "MEDIUM",
                "description": "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. An input string is valid if open brackets are closed by the same type of brackets and in the correct order.",
                "testCases": [
                    { "input": { "s": "()" }, "output": true },
                    { "input": { "s": "()[]{}" }, "output": true },
                    { "input": { "s": "(]" }, "output": false }
                ]
            },
            {
                "slug": "missing-number",
                "title": "Missing Number",
                "difficulty": "EASY",
                "description": "Given an array nums containing n distinct numbers in the range [0, n], return the only number in the range that is missing from the array.",
                "testCases": [
                    { "input": { "nums": [3, 0, 1] }, "output": 2 },
                    { "input": { "nums": [0, 1] }, "output": 2 },
                    { "input": { "nums": [9, 6, 4, 2, 3, 5, 7, 0, 1] }, "output": 8 }
                ]
            },
            {
                "slug": "power-function",
                "title": "Power Function (x^n)",
                "difficulty": "MEDIUM",
                "description": "Implement pow(x, n), which calculates x raised to the power n (i.e., x^n).",
                "testCases": [
                    { "input": { "x": 2.0, "n": 10 }, "output": 1024.0 },
                    { "input": { "x": 2.1, "n": 3 }, "output": 9.261 },
                    { "input": { "x": 2.0, "n": -2 }, "output": 0.25 }
                ]
            },
            {
                "slug": "remove-duplicates",
                "title": "Remove Duplicates from Sorted Array",
                "difficulty": "EASY",
                "description": "Given an integer array nums sorted in non-decreasing order, remove the duplicates in-place such that each unique element appears only once. Return the new array with unique elements.",
                "testCases": [
                    { "input": { "nums": [1, 1, 2] }, "output": [1, 2] },
                    { "input": { "nums": [0, 0, 1, 1, 1, 2, 2, 3, 3, 4] }, "output": [0, 1, 2, 3, 4] }
                ]
            },
            {
                "slug": "intersection-arrays",
                "title": "Intersection of Two Arrays",
                "difficulty": "EASY",
                "description": "Given two integer arrays nums1 and nums2, return an array of their intersection. Each element in the result must be unique and you may return the result in any order.",
                "testCases": [
                    { "input": { "nums1": [1, 2, 2, 1], "nums2": [2, 2] }, "output": [2] },
                    { "input": { "nums1": [4, 9, 5], "nums2": [9, 4, 9, 8, 4] }, "output": [9, 4] }
                ]
            }
        ]
    })

    console.log(res);

}

