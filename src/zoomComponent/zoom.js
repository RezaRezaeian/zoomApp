import React, { useEffect, useRef } from "react";
import ZoomMtgEmbedded from "@zoom/meetingsdk/embedded";

function Zoom() {
  const audioRef = useRef(null);
  const watermarkInterval = useRef(null);

  useEffect(() => {
    const client = ZoomMtgEmbedded.createClient();
    let meetingSDKElement = document.getElementById("meetingSDKElement");

    // Create watermark overlay
    const createWatermark = () => {
      const watermarkDiv = document.createElement('div');
      watermarkDiv.style.position = 'fixed';
      watermarkDiv.style.top = '0';
      watermarkDiv.style.left = '0';
      watermarkDiv.style.width = '100%';
      watermarkDiv.style.height = '100%';
      watermarkDiv.style.pointerEvents = 'none';
      watermarkDiv.style.zIndex = '9999';

      // Add timestamp and user info
      const timestamp = new Date().toLocaleString();
      const userEmail = "rreza.rezaeiann@gmail.com";
      watermarkDiv.innerHTML = `
        <div style="
          position: absolute;
          top: 20px;
          right: 20px;
          color: rgba(255, 255, 255, 0.5);
          font-size: 14px;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
        ">
          ${timestamp}<br>${userEmail}
        </div>
        <div style="
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          color: rgba(255, 255, 255, 0.3);
          font-size: 24px;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
        ">
          CONFIDENTIAL
        </div>
      `;

      return watermarkDiv;
    };

    // Setup audio watermark
    const setupAudioWatermark = () => {
      const audio = new Audio();
      audio.src = 'data:audio/mp3;base64,...'; // Base64 encoded short audio watermark
      audio.volume = 0.1; // Adjust volume (0.0 to 1.0)

      // Play audio watermark every 30 seconds
      const playAudioWatermark = () => {
        if (audio.paused) {
          audio.play().catch(err => console.log('Audio watermark playback failed:', err));
        }
      };

      return setInterval(playAudioWatermark, 30000); // Every 30 seconds
    };

    client.init({
      zoomAppRoot: meetingSDKElement,
      language: "en-US",
    });

    client
      .join({
        sdkKey: "w7BZAw6_QSakJxBx9nd7DQ",
        signature: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZGtLZXkiOiJ3N0JaQXc2X1FTQWtKeEJ4OW5kN0RRIiwiaWF0IjoxNzM1NTg0ODgxLCJleHAiOjE3MzU1OTIwODEsIm1uIjo4MjMzMjI1MTQ3Miwicm9sZSI6MH0.Ay9XRlYToYst8H_MIFnF3Ztt7CU-8cLrokYul7Iwlac",
        meetingNumber: "82332251472",
        password: "711145",
        userName: "Rezmx",
        userEmail: "rreza.rezaeiann@gmail.com",
        success: (success) => {
          console.log('Join Meeting Success', success);

          // Add watermark after successful join
          const watermark = createWatermark();
          document.body.appendChild(watermark);

          // Update watermark timestamp periodically
          watermarkInterval.current = setInterval(() => {
            document.body.removeChild(watermark);
            const newWatermark = createWatermark();
            document.body.appendChild(newWatermark);
          }, 1000); // Update every second

          // Setup audio watermark
          audioRef.current = setupAudioWatermark();
        }
      })
      .catch((error) => {
        console.error(error);
      });

    // Cleanup function
    return () => {
      if (watermarkInterval.current) {
        clearInterval(watermarkInterval.current);
      }
      if (audioRef.current) {
        clearInterval(audioRef.current);
      }
      const watermarkElements = document.querySelectorAll('[data-watermark]');
      watermarkElements.forEach(element => element.remove());
      client.leaveMeeting();
    };
  }, []);

  return (
    <div
      id="meetingSDKElement"
      style={{ height: "100vh", width: "100vw" }}
    ></div>
  );
}

export default Zoom;