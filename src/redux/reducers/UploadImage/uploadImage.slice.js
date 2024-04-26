import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const initialState = {
  uploadImageLoading: false,
  isUploadImageUpdated: false,
  getUploadImage: "",
};

export const uploadImage = createAsyncThunk(
  "admin/upload-image",
  (file, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .post("upload-file", file)
        .then((res) => {
          if (res?.data?.err === 0) {
            toast.success(res.data?.msg);
            resolve(res.data?.data);
          } else {
            toast.error(res.data?.msg);
            reject({});
          }
        })
        .catch((error) => {
          toast.error(error?.response?.data?.msg);
          reject(error);
        });
    });
  }
);

export const uploadImageSlice = createSlice({
  name: "uploadImage",
  initialState,
  reducers: {
    setUploadImageLoading: (state, action) => {
      state.uploadImageLoading = action.payload;
    },
    setIsUploadImageUpdated: (state, action) => {
      state.isUploadImageUpdated = action.payload;
    },
    setUploadImageDetail: (state, action) => {
      state.getUploadImage = action.payload;
    },
  },
  extraReducers: {
    [uploadImage.pending]: (state) => {
      state.uploadImageLoading = true;
      state.isUploadImageUpdated = false;
      state.getUploadImage = {};
    },
    [uploadImage.rejected]: (state) => {
      state.uploadImageLoading = false;
      state.isUploadImageUpdated = false;
      state.getUploadImage = {};
    },
    [uploadImage.fulfilled]: (state, action) => {
      state.uploadImageLoading = false;
      state.isUploadImageUpdated = true;
      state.getUploadImage = action.payload;
    },
  },
});

export const {
  setUploadImageLoading,
  setIsUploadImageUpdated,
  setUploadImageDetail,
} = uploadImageSlice.actions;

export default uploadImageSlice.reducer;
