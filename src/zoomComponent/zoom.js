import React, { useEffect } from "react";
import ZoomMtgEmbedded from "@zoom/meetingsdk/embedded";

function Zoom() {
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
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZGtLZXkiOiJ3N0JaQXc2X1FTYWtKeEJ4OW5kN0RRIiwiaWF0IjoxNzM1NzQ4Mzc0LCJleHAiOjE3MzU3NTU1NzQsIm1uIjo2ODQ5NTg2MzQ4LCJyb2xlIjowfQ.wIsjw5fzfuG6Ks7tyx3BJyoh5HbHDFGm6yNwQXmBzZs",
        meetingNumber: "6849586348",
        password: "123456",
        userName: "Rezmx",
        userEmail: "rreza.rezaeiann@gmail.com",
        success: (success) => {
          console.log("Join Meeting Success", success);
        },
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return <div id="meetingSDKElement"></div>;
}

export default Zoom;
