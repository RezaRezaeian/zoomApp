import React, { useEffect, useState } from "react";

const Footer = () => {
  const textToSpeak = "1234";
  const [currentIndex, setCurrentIndex] = useState(0);

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
      speakText(textToSpeak[currentIndex]);
      console.log(textToSpeak[currentIndex]);

      setCurrentIndex((prevIndex) =>
        prevIndex + 1 < textToSpeak.length ? prevIndex + 1 : 0
      );
    }, 10000);

    return () => clearInterval(intervalId);
  }, [currentIndex, textToSpeak]);

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
