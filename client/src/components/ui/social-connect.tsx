import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { SiGoogledocs } from "react-icons/si";
import { TwitterIcon } from "lucide-react";

export function SocialConnect() {
  const { toast } = useToast();

  const connectGoogle = useMutation({
    mutationFn: async () => {
      window.location.href = "/api/auth/google";
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to connect Google Notes",
        variant: "destructive",
      });
    },
  });

  const connectTwitter = useMutation({
    mutationFn: async () => {
      window.location.href = "/api/auth/twitter";
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to connect Twitter",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="flex flex-col gap-2">
      <Button
        variant="outline"
        className="flex items-center gap-2 w-full hover:bg-amber-100 border-amber-200 text-amber-800 transition-colors duration-200"
        onClick={() => connectGoogle.mutate()}
        disabled={connectGoogle.isPending}
      >
        <SiGoogledocs className="h-4 w-4 text-amber-600" />
        <span className="text-sm">Connect Google Notes</span>
      </Button>
      <Button
        variant="outline"
        className="flex items-center gap-2 w-full hover:bg-sky-100 border-sky-200 text-sky-800 transition-colors duration-200"
        onClick={() => connectTwitter.mutate()}
        disabled={connectTwitter.isPending}
      >
        <TwitterIcon className="h-4 w-4 text-sky-600" />
        <span className="text-sm">Connect Twitter</span>
      </Button>
    </div>
  );
}