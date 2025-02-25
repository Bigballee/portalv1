import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  folders: [],
  currentFolder: null,
  files: [],
};

const folderSlice = createSlice({
  name: "folder",
  initialState,
  reducers: {
    addFolder: (state, action) => {
      state.folders.push(action.payload);
    },
    setCurrentFolder: (state, action) => {
      state.currentFolder = action.payload;
    },
    addFileToFolder: (state, action) => {
      const folder = state.folders.find(
        (folder) => folder.id === action.payload.folderId
      );
      if (folder) {
        folder.files.push(action.payload.file);  // Add file to folder
      }
    },
    addSubFolder: (state, action) => {
      const parentFolder = state.folders.find(
        (folder) => folder.id === action.payload.parentFolderId
      );
      if (parentFolder) {
        parentFolder.subFolders.push(action.payload.subFolder);  // Add subfolder
      }
    },
    deleteFile: (state, action) => {
      const folder = state.folders.find(
        (folder) => folder.id === action.payload.folderId
      );
      if (folder) {
        folder.files = folder.files.filter(
          (file) => file.id !== action.payload.fileId
        );  // Remove file from folder
      }
    },
    deleteFolder: (state, action) => {
      // Remove the folder
      state.folders = state.folders.filter(
        (folder) => folder.id !== action.payload.folderId
      );
      // If the folder had subfolders, remove them as well
      state.folders.forEach((folder) => {
        folder.subFolders = folder.subFolders.filter(
          (subFolder) => subFolder.id !== action.payload.folderId
        );
      });
    },
  },
});

export const {
  addFolder,
  setCurrentFolder,
  addFileToFolder,
  addSubFolder,
  deleteFile,
  deleteFolder,
} = folderSlice.actions;

export default folderSlice.reducer;
