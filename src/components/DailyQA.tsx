import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Calendar, CheckCircle, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface QAEntry {
  id: string;
  question: string;
  date: string;
  partnerAAnswer?: string;
  partnerBAnswer?: string;
  isCompleted: boolean;
}

const dailyQuestions = [
  "What made you smile today?",
  "What's one thing you're grateful for about our relationship?",
  "If you could plan our perfect date night, what would it be?",
  "What's your favorite memory of us from this week?",
  "What's something new you'd like to try together?",
  "How did you feel loved by me today?",
  "What's one goal we should work on together?",
  "What's your favorite thing about coming home to me?",
  "If you could tell your past self one thing about love, what would it be?",
  "What's something about me that always makes you laugh?"
];

export const DailyQA = () => {
  const [currentQuestion] = useState(dailyQuestions[new Date().getDate() % dailyQuestions.length]);
  const [partnerAAnswer, setPartnerAAnswer] = useState("");
  const [partnerBAnswer, setPartnerBAnswer] = useState("");
  const [currentUser, setCurrentUser] = useState<"A" | "B">("A");
  
  const [qaHistory] = useState<QAEntry[]>([
    {
      id: "1",
      question: "What's your favorite memory of us from this week?",
      date: "2024-01-15",
      partnerAAnswer: "When we cooked dinner together and you made me laugh so hard I almost burned the pasta!",
      partnerBAnswer: "Dancing in the kitchen while waiting for the pasta to cook. Your silly moves always make my day better.",
      isCompleted: true
    },
    {
      id: "2", 
      question: "What made you smile today?",
      date: "2024-01-16",
      partnerAAnswer: "Your good morning text with that cute selfie!",
      partnerBAnswer: "",
      isCompleted: false
    }
  ]);

  const handleSubmitAnswer = () => {
    // In a real app, this would save to backend
    console.log(`Partner ${currentUser} answered:`, currentUser === "A" ? partnerAAnswer : partnerBAnswer);
    
    // Switch to other partner view
    setCurrentUser(currentUser === "A" ? "B" : "A");
  };

  const getCurrentAnswer = () => currentUser === "A" ? partnerAAnswer : partnerBAnswer;
  const setCurrentAnswer = (value: string) => 
    currentUser === "A" ? setPartnerAAnswer(value) : setPartnerBAnswer(value);

  return (
    <div className="space-y-6">
      {/* Today's Question */}
      <Card className="bg-gradient-romantic shadow-romantic border-0">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-white/20 p-3 rounded-full">
              <MessageCircle className="h-6 w-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-white text-xl">Today's Question</CardTitle>
          <p className="text-white/90 text-sm">{new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-white/10 p-4 rounded-lg">
            <p className="text-white text-lg font-medium text-center">
              "{currentQuestion}"
            </p>
          </div>
          
          {/* User Switcher */}
          <div className="flex justify-center space-x-2">
            <Button
              variant={currentUser === "A" ? "secondary" : "outline"}
              size="sm"
              onClick={() => setCurrentUser("A")}
              className={cn(
                "text-white border-white/20",
                currentUser === "A" && "bg-white/20"
              )}
            >
              Partner A
            </Button>
            <Button
              variant={currentUser === "B" ? "secondary" : "outline"}
              size="sm"
              onClick={() => setCurrentUser("B")}
              className={cn(
                "text-white border-white/20",
                currentUser === "B" && "bg-white/20"
              )}
            >
              Partner B
            </Button>
          </div>

          <div className="space-y-3">
            <Textarea
              placeholder={`Share your thoughts, Partner ${currentUser}...`}
              value={getCurrentAnswer()}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/60 min-h-[100px]"
            />
            <Button 
              onClick={handleSubmitAnswer}
              disabled={!getCurrentAnswer().trim()}
              className="w-full bg-white/20 hover:bg-white/30 text-white border-white/20"
            >
              Submit Answer
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Q&A History */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Our Q&A Journey</h3>
        </div>

        <div className="space-y-4">
          {qaHistory.map((entry) => (
            <Card key={entry.id} className="shadow-gentle">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base text-foreground">
                    {entry.question}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant={entry.isCompleted ? "default" : "secondary"} className="text-xs">
                      {entry.isCompleted ? (
                        <><CheckCircle className="h-3 w-3 mr-1" /> Complete</>
                      ) : (
                        <><Users className="h-3 w-3 mr-1" /> Pending</>
                      )}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{entry.date}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {entry.partnerAAnswer && (
                  <div className="bg-gradient-to-r from-primary/5 to-primary/10 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Heart className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium text-primary">Partner A</span>
                    </div>
                    <p className="text-sm text-foreground">{entry.partnerAAnswer}</p>
                  </div>
                )}
                
                {entry.partnerBAnswer && (
                  <div className="bg-gradient-to-r from-secondary/5 to-secondary/10 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Heart className="h-4 w-4 text-secondary" />
                      <span className="text-sm font-medium text-secondary">Partner B</span>
                    </div>
                    <p className="text-sm text-foreground">{entry.partnerBAnswer}</p>
                  </div>
                )}
                
                {!entry.isCompleted && (
                  <div className="text-center py-2">
                    <p className="text-xs text-muted-foreground">
                      Waiting for {!entry.partnerAAnswer ? "Partner A" : "Partner B"} to answer...
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
