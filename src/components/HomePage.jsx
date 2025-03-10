import React, { useState, useEffect, useRef } from "react";

export default function HomePage({ setFile, setAudioStream }) {
  const [recordingStatus, setRecordingStatus] = useState("inactive");
  const [audioChunks, setAudioChunks] = useState([]);
  const [duration, setDuration] = useState(0);
  const mediaRecorder = useRef(null);
  const mimeType = "audio/webm";

  async function startRecording() {
    let tempStream;
    console.log("Start recording");
    try {
      const streamData = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
      tempStream = streamData;
    } catch (error) {
      console.log(error);
      return;
    }
    setRecordingStatus("recording");
    // Create a MediaRecorder instance using the stream
    const media = new MediaRecorder(tempStream, { type: mimeType });
    mediaRecorder.current = media;

    mediaRecorder.current.start();
    let localAudioChunks = [];
    mediaRecorder.current.ondataavailable = (e) => {
      if (typeof e.data === "undefined" || e.data.size === 0) {
        return;
      }
      localAudioChunks.push(e.data);
    };
    setAudioChunks(localAudioChunks);
  }
  async function stopRecording() {
    setRecordingStatus("inactive");
    console.log("Stop recording");
    mediaRecorder.current.stop();
    mediaRecorder.current.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: mimeType });
      setAudioStream(audioBlob);
      setAudioChunks([]);
      setDuration(0);
    };
  }
  useEffect(() => {
    if (recordingStatus === "inactive") {
      return;
    }
    const interval = setInterval(() => {
      setDuration((curr) => curr + 1);
    }, 1000);
    return () => clearInterval(interval);
  });
  return (
    <main className="flex-1 p-4 flex flex-col gap-3 text-center sm:gap-4 justify-center pb-20">
      <h1 className="font-semibold text-5xl sm:text-6xl md:text-7xl">
        Trans<span className="text-blue-400 bold">Crilation</span> AI
      </h1>
      <h3 className="font-medium md:text-lg">
        Record <span className="text-blue-400">&rarr;</span> Transcribe{" "}
        <span className="text-blue-400">&rarr;</span> Translate
      </h3>
      <button
        onClick={
          recordingStatus === "inactive" ? startRecording : stopRecording
        }
        className="specialBtn px-4 py-2 rounded-xl text-blue-400 cursor-pointer flex items-center gap-4 text-base justify-between mx-auto w-72 max-w-full my-4"
      >
        <p>{recordingStatus === "inactive" ? "Record" : `Stop recording`}</p>
        <div className="flex items-center gap-2">
          {duration > 0 && <p className="text-sm">{duration}s</p>}
        </div>
        <i
          className={
            "fa-solid duration-200 fa-microphone " +
            (recordingStatus === "recording" && "text-rose-200")
          }
        ></i>
      </button>
      <p className="text-base">
        Or{" "}
        <label className="text-blue-400 cursor-pointer hover:text-blue-600 duration-200">
          Upload{" "}
          <input
            onChange={(e) => setFile(e.target.files[0])}
            className="hidden"
            type="file"
            accept=".mp3,.wave,.m4a"
          />
        </label>{" "}
        a mp3 file
      </p>
    </main>
  );
}
