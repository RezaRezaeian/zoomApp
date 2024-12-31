import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";

import ZoomMtgEmbedded from "@zoom/meetingsdk/embedded";

const Watermark = () => {
  const [timestamp, setTimestamp] = useState(new Date().toLocaleString());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimestamp(new Date().toLocaleString());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div
      id="persistent-watermark"
      className="fixed inset-0 w-screen h-screen pointer-events-none z-[9999] flex flex-col justify-between p-5 font-sans bg-black/20"
    >
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(5)].map((_, index) => (
          <div
            key={`diagonal-${index}`}
            className={`absolute top-1/2 -translate-y-1/2 -rotate-45 text-white/30 text-4xl whitespace-nowrap select-none shadow-lg`}
            style={{
              left: `${index * 25}%`,
              transform: "translate(-50%, -50%) rotate(-45deg)",
            }}
          >
            CONFIDENTIAL
          </div>
        ))}
      </div>

      <div className="absolute top-5 right-5 text-white/70 text-sm text-right shadow-md bg-black/40 p-2 rounded select-none">
        <div>{timestamp}</div>
        <div>rreza.rezaeiann@gmail.com</div>
      </div>
    </div>
  );
};

function Zoom() {
  const audioRef = useRef(null);
  const speechSynthRef = useRef(null);
  const zoomContainerRef = useRef(null);
  const [showWatermark, setShowWatermark] = useState(true);

  const setupTextToSpeech = () => {
    if (!window.speechSynthesis) {
      console.error("Speech synthesis not supported");
      return null;
    }

    const speakWatermark = () => {
      if (speechSynthRef.current) {
        speechSynthesis.cancel();
      }

      const text = "This is a confidential meeting. Recording is prohibited.";
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.volume = 0.1;
      utterance.rate = 0.9;
      utterance.pitch = 0.8;

      speechSynthRef.current = utterance;
      window.speechSynthesis.speak(utterance);
      console.log("paly audio");
    };

    return setInterval(speakWatermark, 1000);
  };

  // Setup mutation observer to ensure watermark persists
  useEffect(() => {
    const meetingSDKElement = document.getElementById("meetingSDKElement");

    // Create a mutation observer to watch for DOM changes
    const observer = new MutationObserver((mutations) => {
      const watermark = document.getElementById("persistent-watermark");
      if (!watermark && showWatermark) {
        // If watermark is missing but should be shown, reinsert it
        const zoomRoot = meetingSDKElement.querySelector(".zm-host");
        if (zoomRoot) {
          const watermarkContainer = document.createElement("div");
          watermarkContainer.id = "watermark-container";
          zoomRoot.appendChild(watermarkContainer);

          // Use ReactDOM to render the watermark
          const root = ReactDOM.createRoot(watermarkContainer);
          root.render(<Watermark />);
        }
      }
    });

    // Start observing the meeting SDK element
    if (meetingSDKElement) {
      observer.observe(meetingSDKElement, {
        childList: true,
        subtree: true,
      });
    }

    return () => observer.disconnect();
  }, [showWatermark]);

  useEffect(() => {
    const client = ZoomMtgEmbedded.createClient();
    const meetingSDKElement = document.getElementById("meetingSDKElement");

    client.init({
      zoomAppRoot: meetingSDKElement,
      language: "en-US",
    });

    client
      .join({
        sdkKey: "w7BZAw6_QSakJxBx9nd7DQ",
        signature:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZGtLZXkiOiJ3N0JaQXc2X1FTYWtKeEJ4OW5kN0RRIiwiaWF0IjoxNzM1NjYwMzY5LCJleHAiOjE3MzU2Njc1NjksIm1uIjo4ODkzMTk1NDQwNiwicm9sZSI6MH0.4nnpLQJ4Cbcc97LSh16bre0pGW8ARGaOTIDkKJvufz8",
        meetingNumber: "88931954406",
        password: "n6858Q",
        userName: "Rezmx",
        userEmail: "rreza.rezaeiann@gmail.com",
        success: (success) => {
          console.log("Join Meeting Success", success);
          setShowWatermark(true);
          audioRef.current = setupTextToSpeech();
        },
      })
      .catch((error) => {
        console.error(error);
      });

    return () => {
      if (audioRef.current) {
        clearInterval(audioRef.current);
      }
      if (speechSynthRef.current) {
        window.speechSynthesis.cancel();
      }
      client.leaveMeeting();
    };
  }, []);

  return (
    <div
      id="meetingSDKElement"
      ref={zoomContainerRef}
      className="h-screen w-screen relative"
    >
      {showWatermark && <Watermark />}
    </div>
  );
}

export default Zoom;
