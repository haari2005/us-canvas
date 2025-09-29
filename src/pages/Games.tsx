import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScribbleGame } from "@/components/ScribbleGame";
import { TruthOrDare } from "@/components/TruthOrDare";
import { TicTacToe } from "@/components/TicTacToe";
import { CoupleTrivia } from "@/components/CoupleTrivia";
import { 
  Gamepad2, 
  Palette, 
  MessageSquare, 
  Grid3X3, 
  Brain,
  Trophy,
  Timer,
  Users
} from "lucide-react";

const Games = () => {
  return (
    <div className="min-h-screen pt-8 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-romantic p-4 rounded-full shadow-romantic">
              <Gamepad2 className="h-8 w-8 text-white animate-heartbeat" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Fun Games Together
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Play interactive games to have fun and learn more about each other. 
            Compete, laugh, and create beautiful moments together!
          </p>
        </div>

        {/* Game Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="text-center shadow-gentle">
            <CardContent className="pt-4">
              <Trophy className="h-6 w-6 text-primary mx-auto mb-2" />
              <div className="text-lg font-bold text-foreground">12</div>
              <p className="text-xs text-muted-foreground">Games played</p>
            </CardContent>
          </Card>

          <Card className="text-center shadow-gentle">
            <CardContent className="pt-4">
              <Timer className="h-6 w-6 text-primary mx-auto mb-2" />
              <div className="text-lg font-bold text-foreground">2h 34m</div>
              <p className="text-xs text-muted-foreground">Time playing</p>
            </CardContent>
          </Card>

          <Card className="text-center shadow-gentle">
            <CardContent className="pt-4">
              <Users className="h-6 w-6 text-primary mx-auto mb-2" />
              <div className="text-lg font-bold text-foreground">6-4</div>
              <p className="text-xs text-muted-foreground">Win record</p>
            </CardContent>
          </Card>

          <Card className="text-center shadow-gentle">
            <CardContent className="pt-4">
              <Brain className="h-6 w-6 text-primary mx-auto mb-2" />
              <div className="text-lg font-bold text-foreground">87%</div>
              <p className="text-xs text-muted-foreground">Compatibility</p>
            </CardContent>
          </Card>
        </div>

        {/* Games Tabs */}
        <Tabs defaultValue="scribble" className="w-full">
          <TabsList className="grid grid-cols-2 lg:grid-cols-4 w-full max-w-2xl mx-auto mb-8 bg-card shadow-gentle">
            <TabsTrigger value="scribble" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              <span className="hidden sm:inline">Scribble</span>
            </TabsTrigger>
            <TabsTrigger value="truth-dare" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Truth/Dare</span>
            </TabsTrigger>
            <TabsTrigger value="tic-tac-toe" className="flex items-center gap-2">
              <Grid3X3 className="h-4 w-4" />
              <span className="hidden sm:inline">Tic-Tac-Toe</span>
            </TabsTrigger>
            <TabsTrigger value="trivia" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              <span className="hidden sm:inline">Trivia</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="scribble">
            <Card className="shadow-romantic">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl">Scribble & Guess</CardTitle>
                <CardDescription className="text-lg">
                  Draw and guess each other's drawings in real-time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScribbleGame />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="truth-dare">
            <Card className="shadow-romantic">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl">Truth or Dare</CardTitle>
                <CardDescription className="text-lg">
                  Fun questions and challenges to get to know each other better
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TruthOrDare />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="tic-tac-toe">
            <Card className="shadow-romantic">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl">Tic-Tac-Toe Love</CardTitle>
                <CardDescription className="text-lg">
                  Classic game with a romantic twist - hearts vs kisses!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TicTacToe />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="trivia">
            <Card className="shadow-romantic">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl">Couple Trivia</CardTitle>
                <CardDescription className="text-lg">
                  Test how well you know each other with fun questions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CoupleTrivia />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Games;