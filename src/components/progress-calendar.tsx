"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { CalendarDays } from "lucide-react";

export function ProgressCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  // Mock data for completed tasks
  const completedDays = [
    new Date(2024, 6, 10),
    new Date(2024, 6, 15),
    new Date(2024, 6, 22),
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CalendarDays className="size-5 text-primary" />
          <CardTitle className="text-lg font-semibold">
            Progress Calendar
          </CardTitle>
        </div>
        <CardDescription>
          Your learning activity and milestones.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
          modifiers={{ completed: completedDays }}
          modifiersStyles={{
            completed: {
              border: "2px solid hsl(var(--primary))",
              borderRadius: '9999px',
            },
          }}
        />
      </CardContent>
    </Card>
  );
}
