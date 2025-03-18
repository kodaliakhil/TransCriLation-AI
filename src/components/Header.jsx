import React from "react";

export default function Header() {
  return (
    <header className="flex items-center justify-between gap-4 p-4">
      <a href="/">
        <h1 className="font-medium">
          Trans<span className="text-blue-400 bold">Crilation</span> AI
        </h1>
      </a>
      <a
        href="/"
        className=" specialBtn flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-blue-400 cursor-pointer"
      >
        <p>New</p>
        <i className="fa-solid fa-plus"></i>
      </a>
    </header>
  );
}
