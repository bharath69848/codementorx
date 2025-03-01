const GROQ_API_KEY = "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";
const API_URL = "https://api.groq.com/openai/v1/chat/completions";

interface GroqResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
  error?: {
    message: string;
  };
}

export const fetchFromGroq = async (prompt: string, systemPrompt: string): Promise<string> => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-specdec",
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1024
      })
    });

    const data: GroqResponse = await response.json();

    if (data.error) {
      console.error("Groq API error:", data.error);
      return `Error: ${data.error.message}`;
    }

    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error calling Groq API:", error);
    return "Sorry, there was an error processing your request. Please try again later.";
  }
};

interface StructuredResponse {
  title: string;
  content: string;
}

interface CustomProblem {
  statement: string;
  code?: string;
  language?: string;
}

// Specialized functions for each feature
export const getAlgorithmExplanation = async (problem: string): Promise<StructuredResponse> => {
  const systemPrompt = `You are an expert algorithm teacher. Structure your response in clear sections:

1. Solution Overview:
   Just write a plain text overview of the solution approach.

2. Step-by-Step Approach:
   Number each step clearly, no special formatting.
   Each step should be on a new line starting with a number.

3. Key Concepts:
   List important concepts as plain text.
   Each concept should be on a new line with a simple dash.

Do not use any markdown symbols (no **, ##, >, or *).
Do not include any code snippets.
Keep explanations conceptual and simple.
Format everything as plain text only.`;
  
  const prompt = `Explain step-by-step how to solve this problem: ${problem}. 
Keep it simple and avoid any special formatting or symbols.`;
  
  const content = await fetchFromGroq(prompt, systemPrompt);
  return { title: "Algorithm Explanation", content };
};

export const getDebugHelp = async (problem: string, code: string, language: string): Promise<StructuredResponse> => {
  const systemPrompt = `You are an expert code debugger. Analyze the provided code and structure your response as follows:

1. Code Analysis:
   Review the code and identify any issues.
   No markdown formatting or symbols.

2. Issues Found:
   - List each issue found
   - Include line numbers when possible
   - Explain why it's an issue
   - Keep it simple and clear

3. How to Fix:
   - For each issue, provide a clear solution
   - Explain the fix in plain language
   - If showing code, only show the specific line that needs to change
   - No full code solutions, only targeted fixes

4. Best Practices:
   - Suggest improvements
   - Keep suggestions specific to the problem

Format everything in plain text.
No markdown symbols or formatting.
Focus on being clear and actionable.`;
  
  const prompt = `Analyze this ${language} code and provide debugging help:

Problem: ${problem}

Code:
${code}

Find any:
1. Syntax errors
2. Logical errors
3. Common mistakes
4. Edge cases not handled
5. Performance issues

Provide specific fixes for each issue found.`;
  
  const content = await fetchFromGroq(prompt, systemPrompt);
  return { title: "Debug Help", content };
};

export const getComplexityAnalysis = async (problem: string, code: string, language: string): Promise<StructuredResponse> => {
  const systemPrompt = `You are an expert in algorithm complexity analysis. Format your response in plain text:

Time Complexity:
State the complexity and explain in simple terms.
No special formatting or symbols.

Space Complexity:
State the complexity and explain in simple terms.
No special formatting or symbols.

Optimization Tips:
List each tip on a new line with a simple dash.
Use plain text only.`;
  
  const prompt = `Analyze the complexity for this ${language} solution: ${problem}
Provide analysis in simple plain text format.`;
  
  const content = await fetchFromGroq(prompt, systemPrompt);
  return { title: "Complexity Analysis", content };
};

export const executeCode = async (
  code: string, 
  language: string,
  title: string
): Promise<string> => {
  const systemPrompt = `You are a code execution engine. Execute the given ${language} code and:
1. Return ONLY the output or error message
2. For JavaScript use eval() to execute
3. For Python simulate Python interpreter
4. For Java/C++ simulate compilation and execution
5. Handle common runtime errors`;
  
  const prompt = `Execute this ${language} code and return ONLY the output or error message:

${code}

Rules:
1. If there's a syntax error, return "SyntaxError: <details>"
2. If there's a runtime error, return "RuntimeError: <details>"
3. If code executes successfully, return ONLY the actual output
4. Don't include any explanations or AI responses
5. If code has no output statements, return "No output"`;

  try {
    const response = await fetchFromGroq(prompt, systemPrompt);
    const cleanResponse = response.trim();
    
    // Clean up the response to remove any AI explanations
    const lines = cleanResponse.split('\n')
      .filter(line => !line.startsWith('AI:') && !line.startsWith('Output:'))
      .join('\n');
    
    return lines || "No output";
  } catch (error) {
    console.error("Code execution error:", error);
    return "Error: Failed to execute code. Please try again.";
  }
};

export const analyzeCustomProblem = async (problem: CustomProblem): Promise<StructuredResponse> => {
  const systemPrompt = `You are an expert algorithm analyst. For the given custom problem:
1. Identify the key requirements and constraints
2. Suggest possible test cases
3. Format your response as:
Requirements:
- <list key requirements>

Test Cases:
- Input: <example input>
  Output: <expected output>
`;
  
  const prompt = `Analyze this problem and suggest test cases: ${problem.statement}`;
  
  const content = await fetchFromGroq(prompt, systemPrompt);
  return { title: "Problem Analysis", content };
};

export const getCustomAlgorithmExplanation = async (problem: CustomProblem): Promise<StructuredResponse> => {
  const systemPrompt = `You are an expert algorithm teacher. For the given custom problem:
1. Explain the brute force approach
2. Explain the optimized approach
3. Format your response in sections:

Brute Force Approach:
- Steps
- Time Complexity
- Space Complexity

Optimized Approach:
- Steps
- Time Complexity
- Space Complexity`;
  
  const prompt = `Explain how to solve this problem: ${problem.statement}`;
  
  const content = await fetchFromGroq(prompt, systemPrompt);
  return { title: "Algorithm Explanation", content };
};

export const debugCustomCode = async (problem: CustomProblem): Promise<StructuredResponse> => {
  if (!problem.code || !problem.language) {
    return { 
      title: "Debug Error", 
      content: "No code provided to debug." 
    };
  }

  const systemPrompt = `You are an expert code debugger. Analyze the code and:
1. Find syntax errors
2. Find logical errors
3. Check edge cases
4. Suggest improvements
Format response as:
Issues Found:
- <list issues>

Suggested Fixes:
- <list fixes>`;
  
  const prompt = `Debug this ${problem.language} code for problem:
${problem.statement}

Code:
${problem.code}`;
  
  const content = await fetchFromGroq(prompt, systemPrompt);
  return { title: "Debug Results", content };
};

export const analyzeCustomComplexity = async (problem: CustomProblem): Promise<StructuredResponse> => {
  if (!problem.code || !problem.language) {
    return { 
      title: "Analysis Error", 
      content: "No code provided to analyze." 
    };
  }

  const systemPrompt = `You are an algorithm complexity expert. Analyze the code and:
1. Calculate time complexity
2. Calculate space complexity
3. Suggest optimizations
Format response as:
Current Solution:
- Time: O(x) - <explanation>
- Space: O(x) - <explanation>

Optimal Solution:
- Time: O(x)
- Space: O(x)
- Optimization: <suggestion>`;
  
  const prompt = `Analyze complexity for this ${problem.language} code:
Problem: ${problem.statement}

Code:
${problem.code}`;
  
  const content = await fetchFromGroq(prompt, systemPrompt);
  return { title: "Complexity Analysis", content };
};

export const executeCustomCode = async (problem: CustomProblem): Promise<string> => {
  if (!problem.code || !problem.language) {
    return "Error: No code provided to execute.";
  }

  const systemPrompt = `You are a code execution engine. You will:
1. Actually execute the provided code
2. Return the exact output or error message
3. For JavaScript code, use try-catch and eval() to execute
4. For Python code, simulate Python interpreter behavior
5. Handle common runtime errors and edge cases`;
  
  const prompt = `Execute this ${problem.language} code and return ONLY the output or error message:

${problem.code}

Rules:
1. If there's a syntax error, return "SyntaxError: <details>"
2. If there's a runtime error, return "RuntimeError: <details>"
3. If the code executes successfully, return the exact output
4. Don't include any explanations, just the output or error
5. For console.log or print statements, show their output
6. If code has no output statements, return "No output"`;

  try {
    const response = await fetchFromGroq(prompt, systemPrompt);
    const cleanResponse = response.trim();
    
    // Clean up the response to remove any AI explanations
    const lines = cleanResponse.split('\n')
      .filter(line => !line.startsWith('AI:') && !line.startsWith('Output:'))
      .join('\n');
    
    return lines || "No output";
  } catch (error) {
    console.error("Code execution error:", error);
    return "Error: Failed to execute code. Please try again.";
  }
};
