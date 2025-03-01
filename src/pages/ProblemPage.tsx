import { FC, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAlgorithmExplanation, getDebugHelp, getComplexityAnalysis, executeCode } from "@/services/groqService";
import { Skeleton } from "@/components/ui/skeleton";

interface Problem {
  id: string;
  title: string;
  difficulty: string;
  category: string;
  description: string;
  examples: {
    input: string;
    output: string;
    explanation: string;
  }[];
  constraints: string[];
}

const problems: Record<string, Problem> = {
  "1": {
    id: "1",
    title: "Two Sum",
    difficulty: "Easy",
    category: "Arrays",
    description: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`. You may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order.",
    examples: [
      {
        input: "nums = [2, 7, 11, 15], target = 9",
        output: "[0, 1]",
        explanation: "nums[0] + nums[1] = 2 + 7 = 9, so we return [0, 1]."
      }
    ],
    constraints: [
      "2 ≤ nums.length ≤ 10^4",
      "-10^9 ≤ nums[i] ≤ 10^9",
      "-10^9 ≤ target ≤ 10^9",
      "Only one valid answer exists."
    ]
  },
  "2": {
    id: "2",
    title: "Valid Parentheses",
    difficulty: "Easy",
    category: "Stacks",
    description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. An input string is valid if: Open brackets must be closed by the same type of brackets. Open brackets must be closed in the correct order. Every close bracket has a corresponding open bracket of the same type.",
    examples: [
      {
        input: "s = \"()\"",
        output: "true",
        explanation: "The string contains matching opening and closing parentheses."
      },
      {
        input: "s = \"()[]{}\"",
        output: "true",
        explanation: "The string contains multiple valid parentheses pairs."
      },
      {
        input: "s = \"(]\"",
        output: "false",
        explanation: "The closing square bracket does not match the opening parenthesis."
      }
    ],
    constraints: [
      "1 ≤ s.length ≤ 10^4",
      "s consists of parentheses only '()[]{}'."
    ]
  }
};

const ProblemPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const problem = problems[id || "1"] || problems["1"];
  
  const [currentTab, setCurrentTab] = useState<string>("problem");
  const [language, setLanguage] = useState<string>("javascript");
  const [code, setCode] = useState<string>(`function twoSum(nums, target) {
  // Write your solution here
  
}`);
  const [output, setOutput] = useState<string>("");
  const [algorithmExplanation, setAlgorithmExplanation] = useState<string>("");
  const [debugHelp, setDebugHelp] = useState<string>("");
  const [complexityAnalysis, setComplexityAnalysis] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [visibleWords, setVisibleWords] = useState<number>(0);
  const [allWords, setAllWords] = useState<string[]>([]);
  const [typingInterval, setTypingInterval] = useState<NodeJS.Timeout | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Code templates for different languages and problems
  const codeTemplates: Record<string, Record<string, string>> = {
    "1": {
      javascript: `function twoSum(nums, target) {
  // Write your solution here
  
}`,
      python: `def two_sum(nums, target):
    # Write your solution here
    
    return []`,
      cpp: `#include <vector>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Write your solution here
        
        return {};
    }
};`,
      java: `import java.util.*;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your solution here
        
        return new int[]{};
    }
}`
    },
    "2": {
      javascript: `function isValid(s) {
  // Write your solution here
  
}`,
      python: `def is_valid(s):
    # Write your solution here
    
    return True`,
      cpp: `#include <string>
#include <stack>
using namespace std;

class Solution {
public:
    bool isValid(string s) {
        // Write your solution here
        
        return false;
    }
};`,
      java: `import java.util.*;

class Solution {
    public boolean isValid(String s) {
        // Write your solution here
        
        return false;
    }
}`
    }
  };

  // Update code template when problem or language changes
  useEffect(() => {
    if (id && problems[id]) {
      const templates = codeTemplates[id] || codeTemplates["1"];
      setCode(templates[language] || templates.javascript);
    }
  }, [id, language]);

  // Typing animation effect
  useEffect(() => {
    // Clear previous interval when tab changes
    if (typingInterval) {
      clearInterval(typingInterval);
    }
    
    // Reset visible words when tab changes
    setVisibleWords(0);
    
    let content = "";
    if (currentTab === "algorithm" && algorithmExplanation) {
      content = algorithmExplanation;
    } else if (currentTab === "debug" && debugHelp) {
      content = debugHelp;
    } else if (currentTab === "complexity" && complexityAnalysis) {
      content = complexityAnalysis;
    }
    
    if (content) {
      const words = content.split(' ');
      setAllWords(words);
      
      // Start word-by-word typing animation
      const interval = setInterval(() => {
        setVisibleWords(prev => {
          const next = prev + 1;
          if (next >= words.length) {
            clearInterval(interval);
          }
          return next;
        });
      }, 50); // Adjust speed here
      
      setTypingInterval(interval);
      
      // Clean up interval on unmount
      return () => clearInterval(interval);
    }
  }, [currentTab, algorithmExplanation, debugHelp, complexityAnalysis]);

  const changeLanguage = (newLanguage: string) => {
    setLanguage(newLanguage);
    const templates = codeTemplates[id || "1"] || codeTemplates["1"];
    setCode(templates[newLanguage] || templates.javascript);
  };

  const runCode = async () => {
    setOutput("Running code...");
    setIsLoading(true);
    setError(null);
    
    try {
      // Check if code is empty or only contains comments/whitespace
      const codeContent = code.replace(/\/\/.*|\/\*[\s\S]*?\*\/|\s+/g, '');
      if (!codeContent) {
        setOutput("Error: Please implement the solution before running.");
        setIsLoading(false);
        return;
      }

      // Execute code without test cases
      const result = await executeCode(code, language, problem.title);
      setOutput(result);
    } catch (err) {
      console.error("Code execution error:", err);
      setOutput("Error: Failed to execute code. Please check your code and try again.");
    }
    
    setIsLoading(false);
  };

  const fetchAlgorithmExplanation = async () => {
    setIsLoading(true);
    setError(null);
    setCurrentTab("algorithm");
    
    try {
      const explanation = await getAlgorithmExplanation(
        `${problem.title}: ${problem.description} 
         Example: ${problem.examples.map(ex => `Input: ${ex.input}, Output: ${ex.output}`).join('. ')}`
      );
      setAlgorithmExplanation(explanation.content);
    } catch (err) {
      setError("Failed to fetch algorithm explanation. Please try again later.");
    }
    
    setIsLoading(false);
  };

  const fetchDebugHelp = async () => {
    setIsLoading(true);
    setError(null);
    setCurrentTab("debug");
    
    try {
      const help = await getDebugHelp(
        `${problem.title}: ${problem.description}`,
        code,
        language
      );
      setDebugHelp(help.content);
    } catch (err) {
      setError("Failed to fetch debug help. Please try again later.");
    }
    
    setIsLoading(false);
  };

  const fetchComplexityAnalysis = async () => {
    setIsLoading(true);
    setError(null);
    setCurrentTab("complexity");
    
    try {
      const analysis = await getComplexityAnalysis(
        `${problem.title}: ${problem.description}`,
        code,
        language
      );
      setComplexityAnalysis(analysis.content);
    } catch (err) {
      setError("Failed to fetch complexity analysis. Please try again later.");
    }
    
    setIsLoading(false);
  };

  // Render text with word-by-word typing animation
  const renderTypingText = (text: string) => {
    if (!text) return null;
    
    const paragraphs = text.split('\n');
    return paragraphs.map((paragraph, pIndex) => {
      if (!paragraph.trim()) return null;
      
      // Split paragraph into words and apply animation
      const words = paragraph.split(' ');
      const visibleText = allWords.slice(0, visibleWords).join(' ');
      
      return (
        <p key={pIndex} className="text-github-light/80 mb-4">
          {visibleText}
        </p>
      );
    });
  };

  const parseResponse = (response: string): JSX.Element => {
    const sections = response.split('\n\n');
    
    return (
      <div className="space-y-6">
        {sections.map((section, index) => {
          // Check if section contains code
          if (section.includes('```')) {
            const [before, code, after] = section.split('```');
            return (
              <div key={index} className="space-y-4">
                {before && <p className="text-github-light/90 leading-relaxed">{before}</p>}
                {code && (
                  <pre className="bg-github-dark/50 p-4 rounded-lg overflow-x-auto">
                    <code className="text-sm font-mono text-github-light/90">{code.trim()}</code>
                  </pre>
                )}
                {after && <p className="text-github-light/90 leading-relaxed">{after}</p>}
              </div>
            );
          }

          // Handle lists
          if (section.includes('- ')) {
            const items = section.split('\n');
            const title = items[0].endsWith(':') ? items[0] : null;
            const listItems = items.filter(item => item.startsWith('- '));
            
            return (
              <div key={index} className="space-y-2">
                {title && <h4 className="text-lg font-semibold text-github-light/90 mb-2">{title}</h4>}
                <ul className="space-y-2">
                  {listItems.map((item, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <span className="text-github-green mt-1.5">•</span>
                      <span className="text-github-light/80 leading-relaxed">{item.substring(2)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          }

          // Regular text sections
          return (
            <div key={index} className="space-y-4">
              {section.split('\n').map((line, i) => {
                // Check if line is a header
                if (line.endsWith(':')) {
                  return <h4 key={i} className="text-lg font-semibold text-github-light/90">{line}</h4>;
                }
                return <p key={i} className="text-github-light/80 leading-relaxed">{line}</p>;
              })}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <Layout>
      <div className="container mx-auto px-0 md:px-6 py-4 h-[calc(100vh-4rem)]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
          {/* Left Side - Problem Statement and Feature Tabs */}
          <div className="bg-github-accent rounded-lg overflow-hidden h-full flex flex-col border border-github-accent/50">
            <div className="flex items-center justify-between px-6 py-4 border-b border-github-accent">
              <h2 className="text-xl font-semibold">{problem.title}</h2>
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={fetchAlgorithmExplanation}
                  className={`text-xs border-github-accent hover:border-github-green hover:bg-github-green/10 ${
                    currentTab === "algorithm" ? "border-github-green bg-github-green/10" : ""
                  }`}
                >
                  Explain Algorithm
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={fetchDebugHelp}
                  className={`text-xs border-github-accent hover:border-github-green hover:bg-github-green/10 ${
                    currentTab === "debug" ? "border-github-green bg-github-green/10" : ""
                  }`}
                >
                  Debug Code
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={fetchComplexityAnalysis}
                  className={`text-xs border-github-accent hover:border-github-green hover:bg-github-green/10 ${
                    currentTab === "complexity" ? "border-github-green bg-github-green/10" : ""
                  }`}
                >
                  Analyze Complexity
                </Button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              {error && (
                <div className="bg-red-500 text-white p-4 rounded mb-4">
                  {error}
                </div>
              )}
              {currentTab === "problem" && (
                <div className="animate-fade-in">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className={`${
                        problem.difficulty === "Easy" 
                          ? "bg-green-500/20 text-green-500" 
                          : problem.difficulty === "Medium"
                            ? "bg-yellow-500/20 text-yellow-500"
                            : "bg-red-500/20 text-red-500"
                      } text-xs font-medium px-2.5 py-0.5 rounded`}>
                        {problem.difficulty}
                      </span>
                      <span className="bg-github-dark text-github-light/70 text-xs font-medium px-2.5 py-0.5 rounded">
                        {problem.category}
                      </span>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-4">Problem Description</h3>
                  <p className="text-github-light/80 mb-4">
                    {problem.description.split("`").map((text, i) => 
                      i % 2 === 0 
                        ? text 
                        : <code key={i} className="bg-github-dark px-1 py-0.5 rounded text-sm">{text}</code>
                    )}
                  </p>
                  
                  <h3 className="text-lg font-semibold mb-4">Examples</h3>
                  {problem.examples.map((example, index) => (
                    <div key={index} className="bg-github-dark p-4 rounded-lg mb-6">
                      <p className="text-github-light/80 mb-2">
                        <strong>Input:</strong> {example.input}
                      </p>
                      <p className="text-github-light/80 mb-2">
                        <strong>Output:</strong> {example.output}
                      </p>
                      <p className="text-github-light/80">
                        <strong>Explanation:</strong> {example.explanation}
                      </p>
                    </div>
                  ))}
                  
                  <h3 className="text-lg font-semibold mb-4">Constraints</h3>
                  <ul className="list-disc pl-5 space-y-2 text-github-light/80 mb-4">
                    {problem.constraints.map((constraint, index) => (
                      <li key={index}>{constraint}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {currentTab === "algorithm" && (
                <div className="animate-fade-in">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold">Algorithm Explanation</h3>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setCurrentTab("problem")}
                      className="text-xs border-github-accent hover:border-github-green hover:bg-github-green/10"
                    >
                      Back to Problem
                    </Button>
                  </div>
                  
                  {isLoading ? (
                    <div className="space-y-4">
                      <Skeleton className="h-6 w-3/4 bg-github-dark/60" />
                      <Skeleton className="h-24 w-full bg-github-dark/60" />
                      <Skeleton className="h-6 w-1/2 bg-github-dark/60" />
                      <Skeleton className="h-24 w-full bg-github-dark/60" />
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="prose prose-invert max-w-none">
                        {algorithmExplanation && parseResponse(algorithmExplanation)}
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {currentTab === "debug" && (
                <div className="animate-fade-in">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold">Debug Your Code</h3>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setCurrentTab("problem")}
                      className="text-xs border-github-accent hover:border-github-green hover:bg-github-green/10"
                    >
                      Back to Problem
                    </Button>
                  </div>
                  
                  {isLoading ? (
                    <div className="space-y-4">
                      <Skeleton className="h-6 w-3/4 bg-github-dark/60" />
                      <Skeleton className="h-24 w-full bg-github-dark/60" />
                      <Skeleton className="h-6 w-1/2 bg-github-dark/60" />
                      <Skeleton className="h-24 w-full bg-github-dark/60" />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="prose prose-invert max-w-none">
                        {debugHelp && parseResponse(debugHelp)}
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {currentTab === "complexity" && (
                <div className="animate-fade-in">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold">Time & Space Complexity Analysis</h3>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setCurrentTab("problem")}
                      className="text-xs border-github-accent hover:border-github-green hover:bg-github-green/10"
                    >
                      Back to Problem
                    </Button>
                  </div>
                  
                  {isLoading ? (
                    <div className="space-y-4">
                      <Skeleton className="h-6 w-3/4 bg-github-dark/60" />
                      <Skeleton className="h-24 w-full bg-github-dark/60" />
                      <Skeleton className="h-6 w-1/2 bg-github-dark/60" />
                      <Skeleton className="h-24 w-full bg-github-dark/60" />
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="prose prose-invert max-w-none">
                        {complexityAnalysis && parseResponse(complexityAnalysis)}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Right Side - Code Editor and Results */}
          <div className="flex flex-col h-full">
            {/* Code Editor */}
            <div className="flex-1 bg-github-darker rounded-lg mb-4 border border-github-accent/50 flex flex-col overflow-hidden">
              <div className="bg-github-accent px-6 py-3 border-b border-github-accent flex justify-between items-center">
                <div className="flex items-center">
                  <h3 className="font-medium mr-4">Code Editor</h3>
                  <div className="flex border border-github-accent/50 rounded-md overflow-hidden">
                    <button
                      onClick={() => changeLanguage('javascript')}
                      className={`px-3 py-1 text-xs font-medium ${
                        language === 'javascript'
                          ? 'bg-github-green text-white'
                          : 'bg-github-dark/40 text-github-light/70 hover:bg-github-dark/60'
                      }`}
                    >
                      JavaScript
                    </button>
                    <button
                      onClick={() => changeLanguage('python')}
                      className={`px-3 py-1 text-xs font-medium ${
                        language === 'python'
                          ? 'bg-github-green text-white'
                          : 'bg-github-dark/40 text-github-light/70 hover:bg-github-dark/60'
                      }`}
                    >
                      Python
                    </button>
                    <button
                      onClick={() => changeLanguage('cpp')}
                      className={`px-3 py-1 text-xs font-medium ${
                        language === 'cpp'
                          ? 'bg-github-green text-white'
                          : 'bg-github-dark/40 text-github-light/70 hover:bg-github-dark/60'
                      }`}
                    >
                      C++
                    </button>
                    <button
                      onClick={() => changeLanguage('java')}
                      className={`px-3 py-1 text-xs font-medium ${
                        language === 'java'
                          ? 'bg-github-green text-white'
                          : 'bg-github-dark/40 text-github-light/70 hover:bg-github-dark/60'
                      }`}
                    >
                      Java
                    </button>
                  </div>
                </div>
                <Button 
                  size="sm"
                  onClick={runCode}
                  disabled={isLoading}
                  className="bg-github-green hover:bg-github-green-hover text-white button-glow"
                >
                  {isLoading ? "Running..." : "Run Code"}
                </Button>
              </div>
              <div className="flex-1 p-4 overflow-auto">
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full h-full bg-transparent text-github-light/90 font-mono resize-none focus:outline-none text-sm"
                  spellCheck="false"
                />
              </div>
            </div>
            
            {/* Results Section */}
            <div className="h-1/3 bg-github-accent rounded-lg border border-github-accent/50 flex flex-col overflow-hidden">
              <div className="bg-github-darker/50 px-6 py-3 border-b border-github-accent flex justify-between items-center">
                <h3 className="font-medium">Results</h3>
                {isLoading && <span className="text-xs text-github-light/70">Running test cases...</span>}
              </div>
              <div className="flex-1 p-4 overflow-auto">
                <pre className="text-github-light/80 font-mono text-sm whitespace-pre-wrap">
                  {output || "Run your code to see the results..."}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProblemPage;
