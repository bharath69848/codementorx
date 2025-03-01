import { FC, useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  getAlgorithmExplanation,  // Change import
  getDebugHelp,            // Change import
  getComplexityAnalysis,   // Change import
  executeCode              // Change import
} from "@/services/groqService";
import { Skeleton } from "@/components/ui/skeleton";

const CodePlaygroundPage: FC = () => {
  const [currentTab, setCurrentTab] = useState<string>("problem");
  const [language, setLanguage] = useState<string>("javascript");
  const [problemStatement, setProblemStatement] = useState<string>("");
  const [code, setCode] = useState<string>("// Write your code here");
  const [output, setOutput] = useState<string>("");
  const [algorithmExplanation, setAlgorithmExplanation] = useState<string>("");
  const [debugHelp, setDebugHelp] = useState<string>("");
  const [complexityAnalysis, setComplexityAnalysis] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAlgorithmExplanation = async () => {
    setIsLoading(true);
    setError(null);
    setCurrentTab("algorithm");
    
    try {
      // Use main algorithm explanation function
      const explanation = await getAlgorithmExplanation(problemStatement);
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
      // Use main debug help function
      const help = await getDebugHelp(
        problemStatement,
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
      // Use main complexity analysis function
      const analysis = await getComplexityAnalysis(
        problemStatement,
        code,
        language
      );
      setComplexityAnalysis(analysis.content);
    } catch (err) {
      setError("Failed to fetch complexity analysis. Please try again later.");
    }
    
    setIsLoading(false);
  };

  const runCode = async () => {
    setOutput("Running code...");
    setIsLoading(true);
    setError(null);
    
    try {
      // Use main code execution function
      const result = await executeCode(
        code,
        language,
        "Custom Problem"
      );
      setOutput(result);
    } catch (err) {
      setOutput("Error: Failed to execute code. Please try again.");
    }
    
    setIsLoading(false);
  };

  const parseResponse = (response: string): JSX.Element => {
    const sections = response.split('\n\n');
    
    return (
      <div className="space-y-6">
        {sections.map((section, index) => {
          // Handle debug sections
          if (section.startsWith('Issues Found:') || section.startsWith('How to Fix:')) {
            const [title, ...items] = section.split('\n');
            return (
              <div key={index} className="space-y-2">
                <h4 className="text-lg font-semibold text-github-light/90">{title}</h4>
                <ul className="space-y-3">
                  {items.filter(item => item.trim()).map((item, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <span className="text-github-green mt-1.5">•</span>
                      <span className="text-github-light/80 leading-relaxed">
                        {item.startsWith('- ') ? item.substring(2) : item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          }

          // Handle numbered sections (like Code Analysis)
          if (/^\d+\./.test(section)) {
            return (
              <div key={index} className="space-y-2">
                {section.split('\n').map((line, i) => (
                  <p key={i} className="text-github-light/90 leading-relaxed">{line}</p>
                ))}
              </div>
            );
          }

          // Handle lists with dashes
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
          {/* Left Side - Problem Statement and Features */}
          <div className="bg-github-accent rounded-lg overflow-hidden h-full flex flex-col border border-github-accent/50">
            <div className="flex items-center justify-between px-6 py-4 border-b border-github-accent">
              <h2 className="text-xl font-semibold">Code Playground</h2>
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
                  <h3 className="text-lg font-semibold mb-4">Problem Statement</h3>
                  <Textarea
                    value={problemStatement}
                    onChange={(e) => setProblemStatement(e.target.value)}
                    placeholder="Enter your problem statement here..."
                    className="min-h-[200px] bg-github-dark/40 border-github-accent/50 text-github-light/90"
                  />
                  <p className="text-github-light/50 text-sm mt-2">
                    Example: "Given an array of integers, find the maximum product of two numbers in the array."
                  </p>
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
                    </div>
                  ) : (
                    <div className="prose prose-invert max-w-none">
                      {algorithmExplanation && parseResponse(algorithmExplanation)}
                    </div>
                  )}
                </div>
              )}
              
              {currentTab === "debug" && (
                <div className="animate-fade-in">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold">Debug Results</h3>
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
                    </div>
                  ) : (
                    <div className="prose prose-invert max-w-none">
                      {debugHelp && parseResponse(debugHelp)}
                    </div>
                  )}
                </div>
              )}
              
              {currentTab === "complexity" && (
                <div className="animate-fade-in">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold">Complexity Analysis</h3>
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
                    </div>
                  ) : (
                    <div className="prose prose-invert max-w-none">
                      {complexityAnalysis && parseResponse(complexityAnalysis)}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Right Side - Code Editor and Results */}
          <div className="flex flex-col h-full">
            <div className="flex-1 bg-github-darker rounded-lg mb-4 border border-github-accent/50 flex flex-col overflow-hidden">
              <div className="bg-github-accent px-6 py-3 border-b border-github-accent flex justify-between items-center">
                <div className="flex items-center">
                  <h3 className="font-medium mr-4">Code Editor</h3>
                  <div className="flex border border-github-accent/50 rounded-md overflow-hidden">
                    <button
                      onClick={() => setLanguage('javascript')}
                      className={`px-3 py-1 text-xs font-medium ${
                        language === 'javascript'
                          ? 'bg-github-green text-white'
                          : 'bg-github-dark/40 text-github-light/70 hover:bg-github-dark/60'
                      }`}
                    >
                      JavaScript
                    </button>
                    <button
                      onClick={() => setLanguage('python')}
                      className={`px-3 py-1 text-xs font-medium ${
                        language === 'python'
                          ? 'bg-github-green text-white'
                          : 'bg-github-dark/40 text-github-light/70 hover:bg-github-dark/60'
                      }`}
                    >
                      Python
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
            
            <div className="h-1/3 bg-github-accent rounded-lg border border-github-accent/50 flex flex-col overflow-hidden">
              <div className="bg-github-darker/50 px-6 py-3 border-b border-github-accent flex justify-between items-center">
                <h3 className="font-medium">Results</h3>
                {isLoading && <span className="text-xs text-github-light/70">Running code...</span>}
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

export default CodePlaygroundPage;
