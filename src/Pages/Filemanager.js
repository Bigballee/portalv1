import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useLocation } from "react-router-dom";
import { Button, Modal, Form } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { addFolder, setCurrentFolder, addFileToFolder, addSubFolder, deleteFile, deleteFolder } from '../Pages/foldercomp/folderSlice'; // Adjust the import path

const FileManagementPage = () => {
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [showFileModal, setShowFileModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [newFileName, setNewFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFolderId, setSelectedFolderId] = useState(null);

  const location = useLocation();
  const dispatch = useDispatch();
  const folders = useSelector((state) => state.folder.folders);
  const currentFolder = useSelector((state) => state.folder.currentFolder);
  const currentFiles = currentFolder ? currentFolder.files : [];

  const handleFolderSubmit = (e) => {
    e.preventDefault();
    if (!newFolderName) {
      alert("Please enter a folder name.");
      return;
    }

    const newFolder = {
      id: folders.length + 1,
      name: newFolderName,
      files: [],
      subFolders: [],
    };

    // If we are in a current folder, create a subfolder; otherwise, create a top-level folder
    if (currentFolder) {
      dispatch(addSubFolder({ parentFolderId: currentFolder.id, subFolder: newFolder }));
    } else {
      dispatch(addFolder(newFolder));  // Add folder to the top-level
    }

    setNewFolderName("");
    setShowFolderModal(false);
  };

  const handleFileSubmit = (e) => {
    e.preventDefault();
    if (!newFileName || !selectedFile) {
      alert("Please enter a file name and choose a file to upload.");
      return;
    }

    const newFile = {
      id: currentFiles.length + 1,
      name: newFileName,
      file: selectedFile,
    };

    dispatch(addFileToFolder({ folderId: currentFolder.id, file: newFile }));
    setNewFileName("");
    setSelectedFile(null);
    setShowFileModal(false);
  };

  const handleFolderClick = (folder) => {
    dispatch(setCurrentFolder(folder));  // Set the clicked folder as the current folder
  };

  const handleBackClick = () => {
    dispatch(setCurrentFolder(null));  // Go back to the root folder
  };

  // Delete file action
  const handleDeleteFile = (fileId) => {
    dispatch(deleteFile({ folderId: currentFolder.id, fileId }));
  };

  // Delete folder action
  const handleDeleteFolder = (folderId) => {
    dispatch(deleteFolder({ folderId }));
    if (currentFolder && currentFolder.id === folderId) {
      dispatch(setCurrentFolder(null));  // Go back to root folder if we delete the current folder
    }
  };

  const isActive = (path) => (location.pathname === path ? "bg-success" : "");

  return (
    <div>
      <nav className="navbar navbar-light bg-light">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">
            <img
              src="./Images/logo.png"
              alt="GoldenCore Logo"
              className="custom-logo"
              style={{ width: "150px", height: "auto" }}
            />
            GoldenCore
          </a>
        </div>
      </nav>

      <div className="d-flex">
        <div className="sidebar bg-dark text-white p-4" style={{ width: "250px" }}>
          <h4>Admin Dashboard</h4>
          <ul className="nav flex-column">
            <li className="nav-item">
              <Link to="/manage-users" className={`nav-link text-white ${isActive("/manage-users")}`}>
                Manage Carers
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/view-reports" className={`nav-link text-white ${isActive("/view-reports")}`}>
                View Reports
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/file-management" className={`nav-link ${isActive("/file-management")}`}>
                File Management
              </Link>
            </li>
          </ul>
        </div>

        <div className="container mt-5 flex-grow-1">
          <h1 className="text-center">File Management</h1>
          <p className="text-center">Manage your files and folders.</p>

          <div className="mb-4">
            <Button
              variant="outline-dark"
              onClick={() => setShowFolderModal(true)}
              className="mr-3"
            >
              Create Folder
            </Button>
            <Button
              variant="outline-dark"
              onClick={() => setShowFileModal(true)}
            >
              Upload File
            </Button>
          </div>

          {/* Folder Navigation */}
          <div className="d-flex mb-3">
            {currentFolder ? (
              <>
                <Button variant="link" onClick={handleBackClick}>Back</Button>
                <span className="ml-2">{currentFolder.name}</span>
              </>
            ) : (
              <span>No Folder Selected</span>
            )}
          </div>

          {/* Display Folders */}
          <div className="row">
            {folders.map((folder) => (
              <div className="col-md-3" key={folder.id}>
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">{folder.name}</h5>
                    <button className="btn btn-outline-primary" onClick={() => handleFolderClick(folder)}>Open Folder</button>
                    <button
                      className="btn btn-outline-danger mt-2"
                      onClick={() => handleDeleteFolder(folder.id)}
                    >
                      Delete Folder
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Display Files in Current Folder */}
          <div className="row">
            {currentFiles.length > 0 ? (
              currentFiles.map((file) => (
                <div className="col-md-3" key={file.id}>
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title">{file.name}</h5>
                      <button
                        className="btn btn-outline-danger mt-2"
                        onClick={() => handleDeleteFile(file.id)}
                      >
                        Delete File
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No files in this folder.</p>
            )}
          </div>
        </div>
      </div>

      {/* Folder Modal */}
      <Modal show={showFolderModal} onHide={() => setShowFolderModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create Folder</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleFolderSubmit}>
            <Form.Group controlId="folderName">
              <Form.Label>Folder Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter folder name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3">
              Create Folder
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* File Upload Modal */}
      <Modal show={showFileModal} onHide={() => setShowFileModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Upload File</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleFileSubmit}>
            <Form.Group controlId="fileName">
              <Form.Label>File Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter file name"
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="fileUpload" className="mt-3">
              <Form.Label>Upload File</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => setSelectedFile(e.target.files[0])}
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3">
              Upload File
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default FileManagementPage;
