import React from "react";
import File from "./File";

const Folder = ({ folder, setCurrentFolder, files }) => {
  return (
    <div
      className="folder-box"
      onClick={() => setCurrentFolder(folder)}
      style={{
        border: "1px solid #ddd",
        padding: "10px",
        margin: "10px",
        cursor: "pointer",
        width: "150px"
      }}
    >
      <h5>{folder.name}</h5>
      <div>
        {files.length > 0 ? (
          files.map((file) => <File key={file.id} file={file} />)
        ) : (
          <p>No files in this folder.</p>
        )}
      </div>
    </div>
  );
};

export default Folder;
