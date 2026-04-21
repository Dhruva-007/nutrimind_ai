import React, { useState, useEffect } from 'react';

const VoiceInput: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [errorStr, setErrorStr] = useState('');

  let recognition: any = null;

  useEffect(() => {
    const sr = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (sr) {
      recognition = new sr();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        processCommand(text);
      };

      recognition.onerror = (event: any) => {
        setErrorStr("Sorry, I didn't catch that");
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const toggleListen = () => {
    if (isListening) {
      recognition?.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      setErrorStr('');
      recognition?.start();
      setIsListening(true);
    }
  };

  const processCommand = (cmd: string) => {
    const text = cmd.toLowerCase();
    if (text.includes("what should i eat")) {
      window.location.href = '/dashboard'; 
    } else if (text.includes("health score")) {
      window.location.href = '/analytics';
    } else if (text.includes("scan")) {
      window.location.href = '/scan';
    } else {
      setErrorStr(`Command not recognized: "${cmd}". Try "What should I eat?"`);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      {transcript && !errorStr && (
        <div className="bg-gray-900 text-white px-4 py-2 rounded-2xl text-sm shadow-lg max-w-[200px] animate-fade-in">
          "{transcript}"
        </div>
      )}
      {errorStr && (
        <div className="bg-red-500 text-white px-4 py-2 rounded-2xl text-sm shadow-lg max-w-[200px] animate-fade-in">
          {errorStr}
        </div>
      )}
      <button 
        onClick={toggleListen}
        aria-label="Voice command"
        className={`w-14 h-14 rounded-full flex items-center justify-center text-white text-2xl shadow-xl transition-all ${isListening ? 'bg-red-500 animate-pulse' : 'bg-primary hover:bg-green-600 hover:scale-105'}`}
      >
        🎙️
      </button>
    </div>
  );
};

export default VoiceInput;
