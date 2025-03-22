import React, { useState } from "react";
import Transcription from "./Transcription";
import Translation from "./Translation";

const TRANSCRIPTION = "transcription";
const TRANSLATION = "translation";

export default function Information(props) {
  const { output } = props;
  const [tab, setTab] = useState("transcription");
  return (
    <main className="flex-1 p-4 flex flex-col gap-3 text-center sm:gap-4 justify-center pb-20 max-w-prose w-full mx-auto">
      <h1 className="font-semibold text-4xl sm:text-5xl md:text-6xl whitespace-nowrap">
        Your<span className="text-blue-400 bold"> Transcription</span>
      </h1>
      <div className="grid grid-cols-2 mx-auto bg-white border-2 border-solid border-blue-400 shadow rounded-full overflow-hidden items-center ">
        <button
          onClick={() => setTab(TRANSCRIPTION)}
          className={
            "px-4 duration-200 py-1 " +
            (tab === "transcription"
              ? "bg-blue-300 text-white"
              : "text-blue-400 hover:text-blue-600")
          }
        >
          Transcription
        </button>
        <button
          onClick={() => setTab(TRANSLATION)}
          className={
            "px-4 duration-200 py-1 " +
            (tab === "translation"
              ? "bg-blue-300 text-white"
              : "text-blue-400 hover:text-blue-600")
          }
        >
          Translation
        </button>
      </div>
      <div className="my-8 flex flex-col">
        {tab === TRANSCRIPTION ? (
          <Transcription {...props} />
        ) : (
          <Translation {...props} />
        )}
      </div>
      <div className="flex items-center gap-4 mx-auto">
        <button
          title="Copy"
          className="bg-white text-blue-300 px-2 aspect-square grid place-items-center rounded hover:text-blue-500 duration-200"
        >
          <i className="fa-solid fa-copy "></i>
        </button>
        <button
          title="Download"
          className="bg-white text-blue-300 px-2 aspect-square grid place-items-center rounded hover:text-blue-500 duration-200"
        >
          <i className="fa-solid fa-download "></i>
        </button>
      </div>
    </main>
  );
}
