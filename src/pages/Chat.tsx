import { ChatInterface } from "@/components/ChatInterface";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, Heart, Smile, Phone, Video } from "lucide-react";

const Chat = () => {
  return (
    <div className="min-h-screen pt-8 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-romantic p-4 rounded-full shadow-romantic">
              <MessageCircle className="h-8 w-8 text-white animate-heartbeat" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Stay Connected
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Chat, share moments, and stay close no matter the distance. 
            Express your love with emojis, GIFs, and sweet messages.
          </p>
        </div>

        {/* Chat Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="text-center shadow-gentle hover:shadow-romantic transition-smooth">
            <CardContent className="pt-4">
              <MessageCircle className="h-6 w-6 text-primary mx-auto mb-2" />
              <div className="text-lg font-bold text-foreground">1,247</div>
              <p className="text-xs text-muted-foreground">Messages sent</p>
            </CardContent>
          </Card>

          <Card className="text-center shadow-gentle hover:shadow-romantic transition-smooth">
            <CardContent className="pt-4">
              <Heart className="h-6 w-6 text-primary mx-auto mb-2" />
              <div className="text-lg font-bold text-foreground">203</div>
              <p className="text-xs text-muted-foreground">Hearts shared</p>
            </CardContent>
          </Card>

          <Card className="text-center shadow-gentle hover:shadow-romantic transition-smooth">
            <CardContent className="pt-4">
              <Smile className="h-6 w-6 text-primary mx-auto mb-2" />
              <div className="text-lg font-bold text-foreground">89</div>
              <p className="text-xs text-muted-foreground">Emojis used</p>
            </CardContent>
          </Card>

          <Card className="text-center shadow-gentle hover:shadow-romantic transition-smooth">
            <CardContent className="pt-4">
              <Video className="h-6 w-6 text-primary mx-auto mb-2" />
              <div className="text-lg font-bold text-foreground">12</div>
              <p className="text-xs text-muted-foreground">Video calls</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Chat Interface */}
        <ChatInterface />
      </div>
    </div>
  );
};

export default Chat;