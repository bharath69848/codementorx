import { FC, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ProblemsPage: FC = () => {
  const [activeTab, setActiveTab] = useState<string>("problems");

  return (
    <Layout>
      <div className="container mx-auto px-4 md:px-6 py-10">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Master DSA & Competitive Programming</h1>
          <p className="text-github-light/70 mb-10">
            Explore a curated collection of problems and follow structured roadmaps to enhance your coding skills.
          </p>

          <Tabs defaultValue="problems" className="mb-10" onValueChange={(value) => setActiveTab(value)}>
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="problems" className="data-[state=active]:bg-github-green data-[state=active]:text-white">
                Problem Sets
              </TabsTrigger>
              <TabsTrigger value="dsa-roadmap" className="data-[state=active]:bg-github-green data-[state=active]:text-white">
                DSA Roadmap
              </TabsTrigger>
              <TabsTrigger value="cp-roadmap" className="data-[state=active]:bg-github-green data-[state=active]:text-white">
                CP Roadmap
              </TabsTrigger>
            </TabsList>

            <TabsContent value="problems" className="animate-fade-in">
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Problem Categories</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4 mb-8">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant="outline"
                      className="justify-start border-github-accent hover:border-github-green hover:bg-github-green/10"
                    >
                      {category}
                    </Button>
                  ))}
                </div>
                
                <h2 className="text-2xl font-semibold mb-4">Difficulty Levels</h2>
                <div className="flex flex-wrap gap-4 mb-8">
                  <Button 
                    variant="outline" 
                    className="border-github-accent hover:border-green-500 hover:text-green-500"
                  >
                    Easy
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-github-accent hover:border-yellow-500 hover:text-yellow-500"
                  >
                    Medium
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-github-accent hover:border-red-500 hover:text-red-500"
                  >
                    Hard
                  </Button>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-6">Problem Sets</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {problems.map((problem, index) => (
                    <ProblemCard key={index} problem={problem} />
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="dsa-roadmap" className="animate-fade-in">
              <h2 className="text-2xl font-semibold mb-6">Data Structures & Algorithms Roadmap</h2>
              <p className="text-github-light/70 mb-8">
                A comprehensive, step-by-step guide to mastering data structures and algorithms from basics to advanced concepts.
              </p>
              
              <div className="space-y-6">
                {dsaRoadmap.map((step, index) => (
                  <RoadmapStep 
                    key={index} 
                    step={step} 
                    index={index} 
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="cp-roadmap" className="animate-fade-in">
              <h2 className="text-2xl font-semibold mb-6">Competitive Programming Roadmap</h2>
              <p className="text-github-light/70 mb-8">
                Follow this roadmap to excel in coding competitions and enhance your problem-solving skills.
              </p>
              
              <div className="space-y-6">
                {cpRoadmap.map((step, index) => (
                  <RoadmapStep 
                    key={index} 
                    step={step} 
                    index={index} 
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="text-center mt-16">
            <h2 className="text-2xl font-bold mb-6">Ready to Start Solving Problems?</h2>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button 
                asChild
                className="bg-github-green hover:bg-github-green-hover text-white px-6 py-5 button-glow"
              >
                <Link to="/playground">Code Playground</Link>
              </Button>
              <Button 
                variant="outline" 
                asChild
                className="border-github-green text-github-green hover:bg-github-green/10 px-6 py-5"
                onClick={() => setActiveTab("dsa-roadmap")}
              >
                Explore Roadmaps
              </Button>
              <Button 
                variant="outline" 
                asChild
                className="border-github-green text-github-green hover:bg-github-green/10 px-6 py-5"
                onClick={() => setActiveTab("algorithm")}
              >
                Explain Algorithm
              </Button>
              <Button 
                variant="outline" 
                asChild
                className="border-github-green text-github-green hover:bg-github-green/10 px-6 py-5"
                onClick={() => setActiveTab("debug")}
              >
                Debug Code
              </Button>
              <Button 
                variant="outline" 
                asChild
                className="border-github-green text-github-green hover:bg-github-green/10 px-6 py-5"
                onClick={() => setActiveTab("complexity")}
              >
                Analyze Complexity
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

interface ProblemCardProps {
  problem: {
    id: string;
    title: string;
    description: string;
    difficulty: string;
    category: string;
  };
}

const ProblemCard: FC<ProblemCardProps> = ({ problem }) => {
  const difficultyColor = {
    Easy: "text-green-500",
    Medium: "text-yellow-500",
    Hard: "text-red-500"
  }[problem.difficulty];

  return (
    <Link to={`/problem/${problem.id}`}>
      <div className="bg-github-accent rounded-lg p-6 border border-github-accent/50 transition-all duration-300 hover:border-github-green/50 hover-scale">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold">{problem.title}</h3>
          <span className={`text-sm font-medium ${difficultyColor}`}>
            {problem.difficulty}
          </span>
        </div>
        <p className="text-github-light/70 text-sm mb-4 line-clamp-2">{problem.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-xs bg-github-dark px-3 py-1 rounded-full">
            {problem.category}
          </span>
          <Button 
            variant="link" 
            className="text-github-green p-0 hover:text-github-green-hover hover:no-underline text-sm"
          >
            Solve →
          </Button>
        </div>
      </div>
    </Link>
  );
};

interface RoadmapStepProps {
  step: {
    title: string;
    description: string;
  };
  index: number;
}

const RoadmapStep: FC<RoadmapStepProps> = ({ step, index }) => {
  return (
    <div className="flex">
      <div className="mr-4 flex flex-col items-center">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-github-green text-white font-bold text-sm">
          {index + 1}
        </div>
        {index < (dsaRoadmap.length - 1) && (
          <div className="w-0.5 h-full bg-github-green/30 my-1"></div>
        )}
      </div>
      <div className="bg-github-accent rounded-lg p-6 flex-1 border border-github-accent/50 transition-all duration-300 hover:border-github-green/50 hover-scale">
        <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
        <p className="text-github-light/70">{step.description}</p>
        <Button 
          variant="link" 
          className="text-github-green p-0 hover:text-github-green-hover hover:no-underline mt-4"
        >
          Start Learning →
        </Button>
      </div>
    </div>
  );
};

// Data
const categories = [
  "Arrays", 
  "Strings", 
  "Linked Lists", 
  "Trees", 
  "Graphs", 
  "Dynamic Programming", 
  "Competitive"
];

const problems = [
  {
    id: "1",
    title: "Two Sum",
    description: "Given an array of integers, return indices of the two numbers such that they add up to a specific target.",
    difficulty: "Easy",
    category: "Arrays"
  },
  {
    id: "2",
    title: "Valid Parentheses",
    description: "Given a string containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
    difficulty: "Easy",
    category: "Stacks"
  },
  {
    id: "3",
    title: "Merge k Sorted Lists",
    description: "Merge k sorted linked lists and return it as one sorted list.",
    difficulty: "Hard",
    category: "Linked Lists"
  },
  {
    id: "4",
    title: "Longest Substring Without Repeating Characters",
    description: "Find the length of the longest substring without repeating characters.",
    difficulty: "Medium",
    category: "Strings"
    
  },
  {
    id: "5",
    title: "Maximum Subarray",
    description: "Find the contiguous subarray which has the largest sum.",
    difficulty: "Medium",
    category: "Arrays"
  },
  {
    id: "6",
    title: "LRU Cache",
    description: "Design and implement a data structure for Least Recently Used (LRU) cache.",
    difficulty: "Hard",
    category: "Design"
  }
];

const dsaRoadmap = [
  {
    title: "Arrays & Strings",
    description: "Learn basic operations, searching, sorting, and common patterns."
  },
  {
    title: "Linked Lists",
    description: "Understand singly, doubly, and circular linked lists."
  },
  {
    title: "Trees & Binary Search Trees",
    description: "Master tree traversals, BST operations, and balancing."
  },
  {
    title: "Graphs",
    description: "Learn BFS, DFS, shortest path algorithms, and MST."
  },
  {
    title: "Dynamic Programming",
    description: "Solve problems using memoization and tabulation."
  }
];

const cpRoadmap = [
  {
    title: "Basic Problem Solving",
    description: "Focus on brute-force approaches and basic optimizations."
  },
  {
    title: "Advanced Data Structures",
    description: "Learn heaps, segment trees, and advanced graph techniques."
  },
  {
    title: "Algorithm Mastery",
    description: "Master greedy algorithms, divide and conquer, and backtracking."
  },
  {
    title: "Competition Strategies",
    description: "Learn time management, problem selection, and debugging under pressure."
  }
];

export default ProblemsPage;
