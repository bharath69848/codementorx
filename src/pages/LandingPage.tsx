
import { FC } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";

const LandingPage: FC = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(35,134,54,0.15),_transparent_50%)]"></div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 animate-fade-in">
              <span className="text-github-green">CodementorX</span>: Master Coding with AI as Your Guide
            </h1>
            <p className="text-xl text-github-light/80 mb-10 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              Whether you're learning Data Structures & Algorithms (DSA) or preparing for competitive programming, CodementorX is your ultimate AI-powered coding mentor.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-10 animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <Button 
                asChild
                className="bg-github-green hover:bg-github-green-hover text-white px-8 py-6 rounded-md button-glow text-lg"
              >
                <Link to="/problems">Start Coding for Free</Link>
              </Button>
              <Button 
                variant="outline" 
                asChild
                className="border-github-green text-github-green hover:bg-github-green/10 px-8 py-6 rounded-md text-lg"
              >
                <Link to="#features">Explore Features</Link>
              </Button>
            </div>
            <p className="text-github-light/60 animate-fade-in" style={{ animationDelay: "0.6s" }}>
              Join thousands of developers leveling up their coding skills
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-github-darker">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Why Choose CodementorX?</h2>
            <div className="w-24 h-1 bg-github-green mx-auto mt-4"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              title="Algorithm Teller (AI Tutor)"
              description="Stuck on a problem? Our AI Tutor breaks down solutions step by step, adapts to your skill level, and provides hints—not answers—to help you learn effectively."
              actionText="Learn More"
              delay={0}
            />
            <FeatureCard 
              title="Debugger (AI Code Fixer)"
              description="Say goodbye to frustrating bugs. Our AI Debugger identifies syntax and logical errors, explains them in plain English, and suggests fixes instantly."
              actionText="Try It Now"
              delay={0.1}
            />
            <FeatureCard 
              title="Time & Space Complexity Analyzer"
              description="Optimize your code like a pro. Our Complexity Analyzer rates your solution, compares it with optimal approaches, and suggests improvements for better performance."
              actionText="See It in Action"
              delay={0.2}
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">How CodementorX Works</h2>
            <div className="w-24 h-1 bg-github-green mx-auto mt-4"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <StepCard 
              number={1}
              title="Choose a Problem"
              description="Select from our curated problem sets or define your own challenge in the Code Playground."
              delay={0}
            />
            <StepCard 
              number={2}
              title="Write Your Code"
              description="Write your solution in your preferred programming language (Python, JavaScript, Java, C++, and more)."
              delay={0.1}
            />
            <StepCard 
              number={3}
              title="Get AI-Powered Guidance"
              description="Our AI Tutor provides hints, the Debugger fixes errors, and the Complexity Analyzer optimizes your code."
              delay={0.2}
            />
            <StepCard 
              number={4}
              title="Learn and Improve"
              description="Track your progress, compare your solutions with optimal ones, and level up your coding skills."
              delay={0.3}
            />
          </div>
          <div className="text-center mt-16">
            <Button 
              asChild
              className="bg-github-green hover:bg-github-green-hover text-white px-8 py-6 rounded-md button-glow text-lg"
            >
              <Link to="/problems">Start Your Coding Journey Today</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Target Audience Section */}
      <section className="py-20 bg-github-darker">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Who Is CodementorX For?</h2>
            <div className="w-24 h-1 bg-github-green mx-auto mt-4"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <AudienceCard 
              title="DSA Learners"
              description="Struggling with Data Structures & Algorithms? CodementorX simplifies complex concepts with step-by-step explanations and personalized guidance."
              actionText="Learn DSA"
              actionLink="/problems"
              delay={0}
            />
            <AudienceCard 
              title="Competitive Programmers"
              description="Preparing for coding competitions? CodementorX helps you optimize your solutions, debug efficiently, and tackle challenging problems with confidence."
              actionText="Practice Now"
              actionLink="/problems"
              delay={0.1}
            />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Frequently Asked Questions</h2>
            <div className="w-24 h-1 bg-github-green mx-auto mt-4"></div>
          </div>
          <div className="max-w-3xl mx-auto space-y-6">
            <FaqItem 
              question="What programming languages does CodementorX support?"
              answer="We currently support Python, JavaScript, Java, and C++. More languages are coming soon!"
              delay={0}
            />
            <FaqItem 
              question="Is CodementorX suitable for beginners?"
              answer="Absolutely! Our AI Tutor adapts to your skill level, making it perfect for beginners and experienced developers alike."
              delay={0.1}
            />
            <FaqItem 
              question="Can I use CodementorX for competitive programming?"
              answer="Yes! Our problem sets and complexity analyzer are designed to help you excel in competitive programming."
              delay={0.2}
            />
            <FaqItem 
              question="How does the AI-Powered Code Playground work?"
              answer="You can define custom problem statements, write code, and test it in real-time. Our AI generates test cases and provides guidance for your unique challenges."
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-github-darker">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Revolutionize Your Coding Skills?</h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                asChild
                className="bg-github-green hover:bg-github-green-hover text-white px-8 py-6 rounded-md button-glow text-lg"
              >
                <Link to="/problems">Start Coding for Free</Link>
              </Button>
              <Button 
                variant="outline" 
                asChild
                className="border-github-green text-github-green hover:bg-github-green/10 px-8 py-6 rounded-md text-lg"
              >
                <Link to="#features">Explore Features</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

interface FeatureCardProps {
  title: string;
  description: string;
  actionText: string;
  delay: number;
}

const FeatureCard: FC<FeatureCardProps> = ({ title, description, actionText, delay }) => {
  return (
    <div 
      className="feature-card animate-fade-in" 
      style={{ animationDelay: `${delay}s` }}
    >
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <p className="text-github-light/70 mb-6">{description}</p>
      <Button 
        variant="link" 
        className="text-github-green p-0 hover:text-github-green-hover hover:no-underline"
      >
        {actionText} →
      </Button>
    </div>
  );
};

interface StepCardProps {
  number: number;
  title: string;
  description: string;
  delay: number;
}

const StepCard: FC<StepCardProps> = ({ number, title, description, delay }) => {
  return (
    <div 
      className="bg-github-accent p-6 rounded-lg border border-github-accent/50 transition-all duration-300 hover:border-github-green/50 animate-fade-in" 
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="w-10 h-10 rounded-full bg-github-green flex items-center justify-center text-white font-bold mb-4">
        {number}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-github-light/70">{description}</p>
    </div>
  );
};

interface AudienceCardProps {
  title: string;
  description: string;
  actionText: string;
  actionLink: string;
  delay: number;
}

const AudienceCard: FC<AudienceCardProps> = ({ title, description, actionText, actionLink, delay }) => {
  return (
    <div 
      className="bg-github-accent p-8 rounded-lg border border-github-accent/50 transition-all duration-300 hover:border-github-green/50 hover:translate-y-[-5px] animate-fade-in" 
      style={{ animationDelay: `${delay}s` }}
    >
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <p className="text-github-light/70 mb-6">{description}</p>
      <Button 
        asChild
        className="bg-github-green hover:bg-github-green-hover text-white button-glow"
      >
        <Link to={actionLink}>{actionText}</Link>
      </Button>
    </div>
  );
};

interface FaqItemProps {
  question: string;
  answer: string;
  delay: number;
}

const FaqItem: FC<FaqItemProps> = ({ question, answer, delay }) => {
  return (
    <div 
      className="bg-github-accent p-6 rounded-lg transition-all duration-300 hover:border-github-green/50 animate-fade-in" 
      style={{ animationDelay: `${delay}s` }}
    >
      <h3 className="text-xl font-semibold mb-2">{question}</h3>
      <p className="text-github-light/70">{answer}</p>
    </div>
  );
};

export default LandingPage;
