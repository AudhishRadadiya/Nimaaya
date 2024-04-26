import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const initialState = {
  isAddDocumentsLoading: false,
  isDocumentCreated: false,
  getUploadImage: "",
  documentList: [],
  totalDocuments: 0,
  pageSize: 10,
};

export const addDocuments = createAsyncThunk(
  "add-documents",
  (props, { dispatch }) => {
    const { locationId, patientRegId, moduleId, payload } = props;
    return new Promise((resolve, reject) => {
      axios
        .post(
          `add-documents/add-detail/${locationId}/${patientRegId}/${moduleId}`,
          payload
        )
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

export const getDocumentsList = createAsyncThunk(
  "get-documents-slist",
  (props, { dispatch }) => {
    const { locationId, patientRegId, moduleId, start, limit } = props;
    return new Promise((resolve, reject) => {
      axios
        .get(
          `add-documents/list/${locationId}/${patientRegId}/${moduleId}/${start}/${limit}`
        )
        .then((res) => {
          if (res?.data?.err === 0) {
            resolve(res.data?.data);
          } else {
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

export const deleteDocumentsList = createAsyncThunk(
  "delete-documents-list",
  (props, { dispatch }) => {
    const { moduleId, locationId, id } = props;
    return new Promise((resolve, reject) => {
      axios
        .delete(`/add-documents/delete/${moduleId}/${locationId}/${id}`)
        .then((res) => {
          if (res?.data?.err === 0) {
            toast.success(res.data?.msg);
            resolve(res.data?.data);
          } else {
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

export const updateDocuments = createAsyncThunk(
  "updat-documents",
  (props, { dispatch }) => {
    const { locationId, id, moduleId, payload } = props;
    return new Promise((resolve, reject) => {
      axios
        .patch(`/add-documents/update/${locationId}/${id}/${moduleId}`, payload)
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

export const addDocumentSlice = createSlice({
  name: "addDocument",
  initialState,
  reducers: {
    setUploadImageLoading: (state, action) => {
      state.isAddDocumentsLoading = action.payload;
    },

    setUploadImageDetail: (state, action) => {
      state.getUploadImage = action.payload;
    },

    steIsDocumentCreated: (state, action) => {
      state.isDocumentCreated = action.payload;
    },

    setDocumentList: (state, action) => {
      state.documentList = action.payload;
    },

    setTotalDocuments: (state, action) => {
      state.totalDocuments = action.payload;
    },
  },
  extraReducers: {
    [addDocuments.pending]: (state) => {
      state.isDocumentCreated = false;
      state.isAddDocumentsLoading = true;
      state.getUploadImage = {};
    },
    [addDocuments.rejected]: (state) => {
      state.isDocumentCreated = false;
      state.isAddDocumentsLoading = false;
      state.getUploadImage = {};
    },
    [addDocuments.fulfilled]: (state, action) => {
      state.isDocumentCreated = true;
      state.isAddDocumentsLoading = false;
      state.getUploadImage = action.payload;
    },

    [getDocumentsList.pending]: (state) => {
      state.isAddDocumentsLoading = true;
    },
    [getDocumentsList.rejected]: (state) => {
      state.isAddDocumentsLoading = false;
      state.documentList = [];
      state.totalDocuments = 0;
    },
    [getDocumentsList.fulfilled]: (state, action) => {
      let totalDocuments = 0;
      let documents = [];
      documents = action?.payload?.documents;
      totalDocuments = action?.payload?.total_documents;
      state.isAddDocumentsLoading = false;
      state.documentList = documents;
      state.totalDocuments = totalDocuments;
    },

    [deleteDocumentsList.pending]: (state) => {
      state.isAddDocumentsLoading = true;
    },
    [deleteDocumentsList.rejected]: (state) => {
      state.isAddDocumentsLoading = true;
    },
    [deleteDocumentsList.fulfilled]: (state) => {
      state.isAddDocumentsLoading = false;
    },
  },
});

export const {
  setUploadImageLoading,
  setIsUploadImageUpdated,
  setUploadImageDetail,
  steIsDocumentCreated,
  setDocumentList,
  setTotalDocuments,
} = addDocumentSlice.actions;

export default addDocumentSlice.reducer;
