import React, { useState, useEffect, useRef } from "react";
import Transcription from "./Transcription";
import Translation from "./Translation";

const TRANSCRIPTION = "transcription";
const TRANSLATION = "translation";
const SELECTLANG = "Select Language";
const INITIATE = "initiate";
const PROGRESS = "progress";
const UPDATE = "update";
const COMPLETE = "complete";

export default function Information(props) {
  const { output } = props;
  const [tab, setTab] = useState(TRANSCRIPTION);
  const [translation, setTranslation] = useState(null);
  const [toLanguage, setToLanguage] = useState(SELECTLANG);
  const [translating, setTranslating] = useState(null);
  const worker = useRef();
  useEffect(() => {
    if (!worker.current) {
      worker.current = new Worker(
        new URL("../utils/translate.worker.js", import.meta.url),
        {
          type: "module",
        }
      );
    }
    const onMessageRecieved = async (e) => {
      switch (e.data.status) {
        case INITIATE:
          console.log(INITIATE);
          break;
        case PROGRESS:
          console.log(PROGRESS);
          break;
        case UPDATE:
          setTranslation(e.data.output);
          console.log(e.data.output);
          break;
        case COMPLETE:
          setTranslating(false);
          console.log(COMPLETE);
          break;
      }
    };
    worker.current.addEventListener("message", onMessageRecieved);
    return () =>
      worker.current.removeEventListener("message", onMessageRecieved);
  });
  const textElement =
    tab === TRANSCRIPTION
      ? output.map((val) => val.text)
      : translation || "No Translation";
  function handleCopy() {
    navigator.clipboard.writeText(textElement);
  }
  function handleDownload() {
    const element = document.createElement("a");
    const file = new Blob([textElement], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `TransCriLation_${new Date().toString()}.txt`;
    document.body.appendChild(element);
    element.click();
  }
  function generateTranslation() {
    if (translating || toLanguage === SELECTLANG) {
      return;
    }
    setTranslating(true);
    worker.current.postMessage({
      text: output.map((val) => val.text),
      src_lang: "eng_Latn",
      tgt_lang: toLanguage,
    });
  }

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
            (tab === TRANSCRIPTION
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
            (tab === TRANSLATION
              ? "bg-blue-300 text-white"
              : "text-blue-400 hover:text-blue-600")
          }
        >
          Translation
        </button>
      </div>
      <div className="my-8 flex flex-col">
        {tab === TRANSCRIPTION ? (
          <Transcription {...props} textElement={textElement} />
        ) : (
          <Translation
            {...props}
            toLanguage={toLanguage}
            textElement={textElement}
            translating={translating}
            setToLanguage={setToLanguage}
            setTranslation={setTranslation}
            setTranslating={setTranslating}
            generateTranslation={generateTranslation}
          />
        )}
      </div>
      <div className="flex items-center gap-4 mx-auto">
        <button
          title="Copy"
          onClick={handleCopy}
          className="bg-white text-blue-300 px-2 aspect-square grid place-items-center rounded hover:text-blue-500 duration-200"
        >
          <i className="fa-solid fa-copy "></i>
        </button>
        <button
          title="Download"
          onClick={handleDownload}
          className="bg-white text-blue-300 px-2 aspect-square grid place-items-center rounded hover:text-blue-500 duration-200"
        >
          <i className="fa-solid fa-download "></i>
        </button>
      </div>
    </main>
  );
}
