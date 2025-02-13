import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b px-4 py-3">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">EasyTweets</h1>
          <div className="space-x-4">
            <Link href="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Button
              onClick={() => window.location.href = "/api/auth/guest"}
              variant="secondary"
            >
              Try as Guest
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-16">
        <section className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Automate Your Social Media Presence
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transform your Google Notes into engaging tweets with AI-powered rephrasing.
            Schedule your content and track performance, all in one place.
          </p>
          <div className="space-x-4 mt-8">
            <Link href="/login">
              <Button size="lg">Get Started</Button>
            </Link>
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => window.location.href = "/api/auth/guest"}
            >
              Try as Guest
            </Button>
          </div>
        </section>

        <section className="grid md:grid-cols-3 gap-8 mb-16">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-2">Smart Rephrasing</h3>
              <p className="text-muted-foreground">
                Our AI automatically rephrases your notes into engaging tweets while
                maintaining your message.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-2">Easy Scheduling</h3>
              <p className="text-muted-foreground">
                Set up your posting schedule once and let our platform handle the rest
                automatically.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-2">Performance Tracking</h3>
              <p className="text-muted-foreground">
                Monitor your tweet performance with real-time analytics and engagement
                metrics.
              </p>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}