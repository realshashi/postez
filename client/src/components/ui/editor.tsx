import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertNoteSchema } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function Editor() {
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(insertNoteSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: { title: string; content: string }) => {
      const res = await apiRequest("POST", "/api/notes", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notes"] });
      form.reset();
      toast({
        title: "Note created",
        description: "Your note has been saved successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          className="fixed bottom-4 right-4 h-14 w-14 rounded-full shadow-lg bg-amber-400/90 hover:bg-amber-400 text-white transition-all duration-200 hover:scale-105"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] bg-[#f9eed9]/40 backdrop-blur-sm">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
            className="mt-8 space-y-6"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-light text-amber-800">Title</FormLabel>
                  <FormControl>
                    <Input {...field} className="bg-white/60 border-amber-200/50 focus:border-amber-300 font-light placeholder:text-amber-700/30" placeholder="Enter note title..." />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-light text-amber-800">Content</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      rows={8} 
                      className="bg-white/60 border-amber-200/50 focus:border-amber-300 font-light placeholder:text-amber-700/30" 
                      placeholder="Write your note content here..."
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              disabled={mutation.isPending}
              className="w-full bg-amber-400/90 hover:bg-amber-400 text-white font-light transition-all duration-200 hover:scale-[1.02]"
            >
              {mutation.isPending ? "Creating..." : "Create Note"}
            </Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}