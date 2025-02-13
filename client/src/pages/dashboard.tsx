import { useQuery } from "@tanstack/react-query";
import { Editor } from "@/components/ui/editor";
import { Scheduler } from "@/components/ui/scheduler";
import { Analytics } from "@/components/ui/analytics";
import { NoteCard } from "@/components/ui/note-card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { Note } from "@shared/schema";

export default function Dashboard() {
  const { data: notes } = useQuery<Note[]>({ queryKey: ["/api/notes"] });
  const { toast } = useToast();

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b px-4 py-3">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">EasyTweets</h1>
          <Button
            variant="outline"
            onClick={() => window.location.href = "/api/auth/logout"}
          >
            Logout
          </Button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-[2fr,1fr] gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">Create New Note</h2>
            <Editor />
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Your Notes</h2>
            <div className="space-y-4">
              {notes?.map((note) => (
                <NoteCard key={note.id} note={note} />
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">Schedule Posts</h2>
              <Scheduler />
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">Analytics</h2>
              <Analytics />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
