import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Camera, Heart, Calendar, MapPin, Plus, Upload } from "lucide-react";
import { toast } from "sonner";

interface Memory {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  tags: string[];
  imageUrl: string;
  uploadedBy: "You" | "Partner";
}

export const MemoryGallery = () => {
  const [memories, setMemories] = useState<Memory[]>([
    {
      id: "1",
      title: "Our First Date",
      description: "The café where it all began. Your smile was so beautiful that day! ☕️💕",
      date: "2024-01-15",
      location: "Downtown Café",
      tags: ["first date", "coffee", "beginning"],
      imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop",
      uploadedBy: "You",
    },
    {
      id: "2",
      title: "Beach Sunset",
      description: "That magical evening when we watched the sunset together. Perfect end to a perfect day! 🌅",
      date: "2024-01-10",
      location: "Sunset Beach",
      tags: ["sunset", "beach", "romantic"],
      imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop",
      uploadedBy: "Partner",
    },
    {
      id: "3",
      title: "Cooking Together",
      description: "Our attempt at making pasta together. It was messy but so much fun! Next time we'll definitely order pizza 😂",
      date: "2024-01-08",
      location: "Home",
      tags: ["cooking", "home", "fun", "disaster"],
      imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
      uploadedBy: "You",
    },
  ]);

  const [newMemory, setNewMemory] = useState({
    title: "",
    description: "",
    location: "",
    tags: "",
  });

  const addMemory = () => {
    if (!newMemory.title.trim() || !newMemory.description.trim()) {
      toast("Please fill in the title and description!");
      return;
    }

    // In a real app, this would handle file upload
    toast("Photo upload coming soon! For now, enjoy browsing your memories 📸");
  };

  const tagColors = [
    "bg-pink-100 text-pink-800 border-pink-200",
    "bg-blue-100 text-blue-800 border-blue-200",
    "bg-green-100 text-green-800 border-green-200",
    "bg-purple-100 text-purple-800 border-purple-200",
    "bg-orange-100 text-orange-800 border-orange-200",
  ];

  return (
    <div className="space-y-6">
      {/* Upload New Memory */}
      <Card className="bg-gradient-dreamy shadow-gentle">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Add a New Memory
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
            <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-2">Click to upload a photo</p>
            <p className="text-sm text-muted-foreground">Or drag and drop your image here</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Memory title"
              value={newMemory.title}
              onChange={(e) => setNewMemory({ ...newMemory, title: e.target.value })}
            />
            <Input
              placeholder="Location"
              value={newMemory.location}
              onChange={(e) => setNewMemory({ ...newMemory, location: e.target.value })}
            />
          </div>
          
          <Input
            placeholder="Description of this special moment..."
            value={newMemory.description}
            onChange={(e) => setNewMemory({ ...newMemory, description: e.target.value })}
          />
          
          <Input
            placeholder="Tags (separate with commas)"
            value={newMemory.tags}
            onChange={(e) => setNewMemory({ ...newMemory, tags: e.target.value })}
          />
          
          <Button onClick={addMemory} className="w-full" variant="romantic">
            <Plus className="h-4 w-4 mr-2" />
            Add Memory
          </Button>
        </CardContent>
      </Card>

      {/* Memory Grid */}
      <div className="space-y-4">
        <h3 className="text-2xl font-semibold text-foreground flex items-center gap-2">
          <Heart className="h-6 w-6" />
          Your Beautiful Memories
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {memories.map((memory, index) => (
            <Card key={memory.id} className="group hover:shadow-romantic transition-smooth hover:-translate-y-1 overflow-hidden">
              <div className="aspect-video overflow-hidden">
                <img
                  src={memory.imageUrl}
                  alt={memory.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-4 space-y-3">
                <div className="space-y-1">
                  <h4 className="font-semibold text-lg">{memory.title}</h4>
                  <p className="text-sm text-muted-foreground">{memory.description}</p>
                </div>
                
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(memory.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {memory.location}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {memory.tags.map((tag, tagIndex) => (
                    <Badge
                      key={tag}
                      className={`text-xs ${tagColors[tagIndex % tagColors.length]}`}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="text-xs text-muted-foreground">
                  Uploaded by {memory.uploadedBy}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="text-center py-8">
        <p className="text-muted-foreground">
          📸 Every moment with you is worth remembering 📸
        </p>
      </div>
    </div>
  );
};