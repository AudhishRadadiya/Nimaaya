import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const initialState = {
  IvfFlowsheetList: [],
  IvfFlowsheetListLoding: false,
  ivfFlowSheetUpdate: false,
  ivfFlowSheetData: false,
  IvfFlowsheetDetailLoading: false,
};

export const getIvfFlowsheetDetail = createAsyncThunk(
  "admin/ivf-flow-List",
  (props, { dispatch }) => {
    return new Promise((resolve, reject) => {
      const { locationId, ivfFlowId, moduleId } = props;
      axios
        .get(`ivf-flow/view/${locationId}/${ivfFlowId}/${moduleId}`)
        .then((res) => {
          if (res?.data?.err === 0) {
            if (Object.keys(res?.data?.data)?.length > 0) {
              resolve(res?.data?.data);
            } else {
              resolve({});
            }
          } else {
            reject({});
            // toast.error(res.data.msg);
          }
        })
        .catch((error) => {
          toast.error(error.response.data.msg);
          reject(error);
        });
    });
  }
);


export const AddIvfFlowsheetDetail = createAsyncThunk(
  "ivf-flow-add-detail",
  (props, { dispatch }) => {
    return new Promise((resolve, reject) => {
      const { locationId, id, moduleId, payload } = props;
      axios
        .post(`ivf-flow/add-detail/${locationId}/${id}/${moduleId}`, payload)
        .then((res) => {
          if (res?.data?.err === 0) {
            toast.success(res.data?.msg);
            resolve(res.data);
          } else {
            toast.success(res?.data?.msg);
            reject({ message: res?.data?.msg });
          }
        })
        .catch((error) => {
          toast.error(error?.response?.data?.msg);
          reject(error);
        });
    });
  }
);

export const editIvfFlowsheetDetail = createAsyncThunk(
  "ivf-flow-update-detail",
  (props, { dispatch }) => {
    const { locationId, _id, moduleId, payload } = props;
    return new Promise((resolve, reject) => {
      axios
        .patch(`ivf-flow/update/${locationId}/${_id}/${moduleId}`, payload)
        .then((res) => {
          if (res?.data?.err === 0) {
            toast.success(res.data?.msg);
            resolve(res.data);
          } else {
            toast.success(res?.data?.msg);
            reject({ message: res?.data?.msg });
          }
        })
        .catch((error) => {
          toast.error(error?.response?.data?.msg);
          reject(error);
        });
    });
  }
);

export const ivfFlowSheetSlice = createSlice({
  name: "ivf-flow-sheet",
  initialState,
  reducers: {
    setivfFlowSheetUpdated: (state, action) => {
      state.ivfFlowSheetUpdate = action.payload;
    },
    setivfFlowSheetDetail: (state, action) => {
      state.IvfFlowsheetDetailLoading = action.payload;
    },
    setIvfFlowsheetList: (state, action) => {
      state.IvfFlowsheetList = action.payload;
    },
  },
  extraReducers: {
    [getIvfFlowsheetDetail.pending]: (state) => {
      state.IvfFlowsheetList = {};
      state.IvfFlowsheetListLoding = true;
    },
    [getIvfFlowsheetDetail.rejected]: (state) => {
      state.IvfFlowsheetList = {};
      state.IvfFlowsheetListLoding = false;
    },
    [getIvfFlowsheetDetail.fulfilled]: (state, action) => {
      state.IvfFlowsheetList = action.payload || {};
      state.IvfFlowsheetListLoding = false;
    },
    [AddIvfFlowsheetDetail.pending]: (state) => {
      state.ivfFlowSheetUpdate = false;
      state.IvfFlowsheetListLoding = true;
    },
    [AddIvfFlowsheetDetail.rejected]: (state) => {
      state.ivfFlowSheetUpdate = false;
      state.IvfFlowsheetListLoding = false;
    },
    [AddIvfFlowsheetDetail.fulfilled]: (state, action) => {
      state.ivfFlowSheetUpdate = true;
      state.IvfFlowsheetListLoding = false;
    },
    [editIvfFlowsheetDetail.pending]: (state) => {
      state.ivfFlowSheetUpdate = false;
      state.IvfFlowsheetListLoding = true;
    },
    [editIvfFlowsheetDetail.rejected]: (state) => {
      state.ivfFlowSheetUpdate = false;
      state.IvfFlowsheetListLoding = false;
    },
    [editIvfFlowsheetDetail.fulfilled]: (state, action) => {
      state.ivfFlowSheetUpdate = true;
      state.IvfFlowsheetListLoding = false;
    },
  },
});

export const {
  setivfFlowSheetUpdated,
  setivfFlowSheetDetail,
  setIvfFlowsheetList,
  setIvfFlowsheetDetailList,
} = ivfFlowSheetSlice.actions;

export default ivfFlowSheetSlice.reducer;
