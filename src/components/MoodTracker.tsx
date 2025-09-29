import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Smile, Meh, Frown, Star, TrendingUp } from "lucide-react";

const moods = [
  { emoji: "😍", label: "In Love", value: 5, color: "text-pink-500" },
  { emoji: "😊", label: "Happy", value: 4, color: "text-green-500" },
  { emoji: "😌", label: "Content", value: 3, color: "text-blue-500" },
  { emoji: "😐", label: "Neutral", value: 2, color: "text-gray-500" },
  { emoji: "😔", label: "Low", value: 1, color: "text-orange-500" },
];

export const MoodTracker = () => {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-dreamy shadow-gentle">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <TrendingUp className="h-6 w-6" />
            Daily Mood Check-in
          </CardTitle>
          <p className="text-muted-foreground">
            Track your emotional journey together
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-4 mb-6">
            {moods.map((mood) => (
              <Button
                key={mood.value}
                onClick={() => setSelectedMood(mood.value)}
                variant={selectedMood === mood.value ? "default" : "outline"}
                className="h-20 flex-col gap-2"
              >
                <span className="text-2xl">{mood.emoji}</span>
                <span className="text-xs">{mood.label}</span>
              </Button>
            ))}
          </div>
          
          {selectedMood && (
            <div className="text-center">
              <Button variant="romantic">Save Mood</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};