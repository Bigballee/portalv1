import React from "react";

const File = ({ file }) => {
  return (
    <div
      className="file-box"
      style={{
        border: "1px solid #ddd",
        padding: "5px",
        margin: "5px 0",
        background: "#f9f9f9",
        cursor: "pointer"
      }}
    >
      <p>{file.name}</p>
    </div>
  );
};

export default File;
