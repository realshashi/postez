import { useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Calendar } from "lucide-react";
import type { Note } from "@shared/schema";

interface NoteCardProps {
  note: Note;
}

export function NoteCard({ note }: NoteCardProps) {
  const { toast } = useToast();

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", `/api/notes/${note.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notes"] });
      toast({
        title: "Note deleted",
        description: "Your note has been deleted successfully.",
      });
    },
  });

  return (
    <Card className="group hover:shadow-md transition-all duration-200 bg-white/60 border-[#f9dee9]/20">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <h3 className="text-lg font-medium text-amber-800">{note.title}</h3>
          <p className="text-xs text-amber-600/80 flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {new Date(note.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Button variant="ghost" size="icon" className="hover:bg-amber-50">
            <Pencil className="h-4 w-4 text-amber-700" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => deleteMutation.mutate()}
            disabled={deleteMutation.isPending}
            className="hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-amber-900/80 font-light leading-relaxed">{note.content}</p>
      </CardContent>
    </Card>
  );
}