import React, { useEffect } from "react";
const Footer = () => {
  const textToSpeak = "1234";

  useEffect(() => {
    const speakText = (text) => {
      if ("speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(utterance);
      } else {
        console.error("SpeechSynthesis is not supported in this browser.");
      }
    };

    const intervalId = setInterval(() => {
      speakText(textToSpeak);
      console.log(textToSpeak)
    }, 10000);
    return () => clearInterval(intervalId);
  }, [textToSpeak]);

  return (
    <footer
      style={{
        textAlign: "center",
        padding: "20px",
        backgroundColor: "#f8f9fa",
      }}
    >
      <p>این یک فوتر نمونه است.</p>
    </footer>
  );
};

export default Footer;
