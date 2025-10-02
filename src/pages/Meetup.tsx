import React from "react";

const MeetUp = () => {
  return (
    <div className="min-h-screen pt-8 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-center">Meet Up</h1>
        <div className="aspect-[16/9] w-full bg-muted rounded-lg overflow-hidden border">
          <iframe
            title="Google Meet"
            src="https://meet.google.com/new"
            className="w-full h-full"
            allow="camera; microphone; fullscreen; autoplay; display-capture"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
};

export default MeetUp;
