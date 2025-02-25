import { configureStore } from "@reduxjs/toolkit";
import folderReducer from "./folderSlice";


const store = configureStore({
  reducer: {
    folder: folderReducer,
  },
});

export default store;
