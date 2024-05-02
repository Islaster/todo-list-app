import { useState, useRef, useEffect } from "react";

export const useSpeechRecognition = (onTranscript) => {
  const [isListening, setIsListening] = useState(false);
  const speechRecognition = useRef(null);

  useEffect(() => {
    if ("webkitSpeechRecognition" in window) {
      speechRecognition.current = new window.webkitSpeechRecognition();
      speechRecognition.current.continuous = true;
      speechRecognition.current.interimResults = true;

      speechRecognition.current.onresult = (event) => {
        const transcript =
          event.results[event.resultIndex][0].transcript.trim();
        onTranscript(transcript);
      };
    }

    return () => {
      if (isListening) {
        speechRecognition.current.stop();
      }
    };
  }, [isListening, onTranscript]);

  const toggleListening = () => {
    if (isListening) {
      speechRecognition.current.stop();
    } else {
      speechRecognition.current.start();
    }
    setIsListening(!isListening);
  };

  return { isListening, toggleListening };
};
