import React, { useState, useRef } from "react";

const VoiceRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioElementRef = useRef(null);

  // Start recording
  const startRecording = async () => {
    try {
      // Request permission to access the microphone
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Create a new MediaRecorder instance
      mediaRecorderRef.current = new MediaRecorder(stream);

      // Set up the event listener to capture audio data
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      // When the recording stops, create a Blob from the collected audio chunks
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        const audioURL = URL.createObjectURL(audioBlob);
        setAudioURL(audioURL); // Set the audio URL to play it
        audioChunksRef.current = []; // Clear the chunks for next recording
      };

      // Start recording
      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing the microphone", err);
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div>
      <h1>Voice Recorder</h1>
      <button onClick={isRecording ? stopRecording : startRecording}>
        {isRecording ? "Stop Recording" : "Start Recording"}
      </button>

      {audioURL && (
        <div>
          <h2>Recording:</h2>
          <audio ref={audioElementRef} controls>
            <source src={audioURL} type="audio/wav" />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
    </div>
  );
};

export default VoiceRecorder;
