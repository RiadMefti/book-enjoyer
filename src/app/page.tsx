import { Button } from "@/components/ui/button";
import {
  Book,
  BookMarked,
  Brain,
  Library,
  Sparkles,
  MessageSquareMore,
  Target,
} from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-b before:from-primary/5 before:to-background/0">
        <div className="container mx-auto relative flex flex-col items-center justify-center gap-6 py-20 md:py-28 text-center px-4">
          <div className="space-y-4 max-w-3xl">
            <div className="inline-flex items-center justify-center px-4 py-1.5 text-sm font-medium rounded-full border bg-background/50 backdrop-blur-sm text-primary border-primary/20">
              <Sparkles className="w-4 h-4 mr-2" /> Powered by AI
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Your Smart Reading
              <span className="block text-primary">Companion</span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Organize your reading journey, take smart notes, and get
              AI-powered insights about any book in your collection.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md mx-auto">
            <Button className="w-full sm:w-auto" size="lg" asChild>
              <Link href="/login">Start Your Journey</Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
              asChild
            >
              <Link href="/books">Explore Library</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Organize Your Reading Journey
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Keep track of your books and enhance your reading experience with
              AI assistance
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
            <FeatureCard
              icon={<Library />}
              title="Reading List Management"
              description="Organize your books into 'To Read', 'In Progress', and 'Finished' categories. Never lose track of your reading progress."
            />
            <FeatureCard
              icon={<Book />}
              title="Smart Note Taking"
              description="Create and organize notes for each book. Capture your thoughts, quotes, and insights with easy categorization and searching."
            />
            <FeatureCard
              icon={<BookMarked />}
              title="Progress Tracking"
              description="Mark your progress in each book, set reading goals, and track your reading speed and habits over time."
            />
          </div>
        </div>
      </section>

      {/* AI Features Section */}
      <section className="bg-primary/5 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              AI-Powered Reading Assistant
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get deeper insights and personalized recommendations for your
              reading journey
            </p>
          </div>
          <div className="grid gap-8 lg:grid-cols-2 max-w-7xl mx-auto">
            <div className="space-y-6">
              <div className="grid gap-6">
                <FeatureRow
                  icon={<MessageSquareMore />}
                  title="Book Insights & Summaries"
                  description="Ask AI to summarize chapters or entire books, explain complex concepts, or provide historical context. Get answers to your specific questions about the book."
                />
                <FeatureRow
                  icon={<Brain />}
                  title="Smart Recommendations"
                  description="Receive personalized book recommendations based on your reading history, notes, and preferences. Discover new books that align with your interests."
                />
                <FeatureRow
                  icon={<Target />}
                  title="Reading Analysis"
                  description="Get insights about themes and patterns in your reading choices, and understand how different books connect to each other."
                />
              </div>
            </div>
            <div className="relative rounded-lg border bg-background p-6 md:p-8 h-fit">
              <div className="absolute -top-4 -left-4 -right-4 -bottom-4 rounded-lg bg-gradient-to-r from-primary/50 to-primary/10 opacity-20 blur-xl" />
              <div className="relative space-y-4">
                <h3 className="text-2xl font-bold">
                  Ask Your AI Reading Assistant
                </h3>
                <ul className="space-y-3">
                  {[
                    "Summarize any chapter or the entire book",
                    "Explain complex themes and concepts",
                    "Generate discussion questions",
                    "Find similar books based on themes",
                    "Get historical context and background",
                    "Analyze writing style and narrative structure",
                    "Connect ideas across different books",
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 shrink-0 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              How It Works
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
            <StepCard
              number="1"
              title="Add Books"
              description="Add books to your reading list and organize them into categories: To Read, In Progress, or Finished."
            />
            <StepCard
              number="2"
              title="Track & Take Notes"
              description="Track your progress as you read and create notes. Capture your thoughts, questions, and favorite quotes."
            />
            <StepCard
              number="3"
              title="Get AI Assistance"
              description="Ask AI to help you understand the book better, get summaries, and discover similar books you'll love."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center gap-6 text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to transform your reading?
            </h2>
            <p className="text-lg text-muted-foreground">
              Join readers who are enhancing their reading experience with
              AI-powered insights and smart organization.
            </p>
            <Button size="lg" asChild>
              <Link href="/login">Get Started Today</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-lg border bg-background p-6 hover:border-primary/50 transition-colors">
      <div className="flex flex-col gap-3">
        <div className="p-2.5 rounded-lg bg-primary/10 text-primary w-fit">
          {icon}
        </div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

function FeatureRow({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="p-2 rounded-lg bg-primary/10 text-primary h-fit shrink-0">
        {icon}
      </div>
      <div className="space-y-1">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

function StepCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-lg border bg-background p-6">
      <div className="flex flex-col gap-3">
        <div className="text-4xl font-bold text-primary/50">{number}</div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
