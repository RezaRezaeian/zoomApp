import React, { useEffect } from "react";
import ZoomMtgEmbedded from "@zoom/meetingsdk/embedded";

function Zoom() {
  useEffect(() => {
    const client = ZoomMtgEmbedded.createClient();

    let meetingSDKElement = document.getElementById("meetingSDKElement");

    // Initialize client with watermark settings
    client.init({
      zoomAppRoot: meetingSDKElement,
      language: "en-US",
      // Add video watermark settings
      videoWatermark: {
        enable: true,
        text: "Confidential Meeting", // Custom watermark text
        fontSize: 24,
        fontColor: "#ffffff",
        opacity: 0.7,
        position: 2, // Position: 1-top left, 2-top right, 3-bottom left, 4-bottom right
        displayMode: 1 // 1-always show, 2-show on hover
      },
      // Add audio watermark settings
      audioWatermark: {
        enable: true,
        audio: "watermark.mp3" // Path to your audio watermark file
      }
    });

    client
      .join({
        sdkKey: "w7BZAw6_QSakJxBx9nd7DQ",
        signature:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZGtLZXkiOiJ3N0JaQXc2X1FTYWtKeEJ4OW5kN0RRIiwiaWF0IjoxNzM1NTg0ODgxLCJleHAiOjE3MzU1OTIwODEsIm1uIjo4MjMzMjI1MTQ3Miwicm9sZSI6MH0.Ay9XRlYToYst8H_MIFnF3Ztt7CU-8cLrokYul7Iwlac",
        meetingNumber: "82332251472",
        password: "711145",
        userName: "Rezmx",
        userEmail: "rreza.rezaeiann@gmail.com"
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <div
      id="meetingSDKElement"
      style={{ height: "100vh", width: "100vw" }}
    ></div>
  );
}

export default Zoom;