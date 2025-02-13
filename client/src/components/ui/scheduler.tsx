import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export function Scheduler() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [frequency, setFrequency] = useState("daily");
  const { toast } = useToast();

  const handleSchedule = () => {
    toast({
      title: "Schedule updated",
      description: "Your posting schedule has been updated successfully.",
    });
  };

  return (
    <div className="space-y-4">
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md border"
      />

      <Select value={frequency} onValueChange={setFrequency}>
        <SelectTrigger>
          <SelectValue placeholder="Select frequency" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="daily">Daily</SelectItem>
          <SelectItem value="weekly">Weekly</SelectItem>
          <SelectItem value="monthly">Monthly</SelectItem>
        </SelectContent>
      </Select>

      <Button onClick={handleSchedule} className="w-full">
        Update Schedule
      </Button>
    </div>
  );
}
