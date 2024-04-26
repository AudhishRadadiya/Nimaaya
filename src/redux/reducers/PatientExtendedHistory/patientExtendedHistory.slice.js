import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

const initialState = {
  extendedHistoryLoading: false,
  extendedHistoryUpdated: false,
  extendedHistoryDetail: {},
};
export const createExtendedHistory = createAsyncThunk(
  'admin/create-extended-history',
  (props, { dispatch }) => {
    return new Promise((resolve, reject) => {
      const { location_id, patient_reg_id, moduleId, payload } = props;
      axios
        .post(`patient-extended-history/add-detail/${location_id}/${patient_reg_id}/${moduleId}`, payload)
        .then(res => {
          if (res?.data?.err === 0) {
            toast.success(res.data?.msg);
            resolve(res.data);
          } else {
            toast.success(res?.data?.msg);
            reject({ message: res?.data?.msg });
          }
        })
        .catch(error => {
          toast.error(error?.response?.data?.msg);
          reject(error);
        });
    });
  },
);

export const editExtendedHistory = createAsyncThunk(
  'admin/edit-extended-history',
  (props, { dispatch }) => {
    return new Promise((resolve, reject) => {
      const { location_id, id, moduleId, payload } = props;
      axios
        .patch(`patient-extended-history/update/${location_id}/${id}/${moduleId}`, payload)
        .then(res => {
          if (res?.data?.err === 0) {
            toast.success(res.data?.msg);
            resolve(res.data);
          } else {
            toast.success(res?.data?.msg);
            reject({ message: res?.data?.msg });
          }
        })
        .catch(error => {
          toast.error(error?.response?.data?.msg);
          reject(error);
        });
    });
  },
);

export const getExtendedHistoryData = createAsyncThunk(
  'admin/get-extended-history-data',
  (props, { dispatch }) => {
    return new Promise((resolve, reject) => {
      const { locationId, patientRegId, moduleId } = props;
      axios
        .get(`patient-extended-history/view/${locationId}/${patientRegId}/${moduleId}`)
        .then(res => {
          if (res?.data?.err === 0) {
            if (Object.keys(res?.data?.data).length > 0) {
              resolve(res.data?.data);
            } else {
              resolve({});
            }
          } else {
            reject({});
            // toast.success(res.data.msg);
          }
        })
        .catch(error => {
          toast.error(error?.response?.data?.msg);
          reject(error);
        });
    });
  },
);

export const patientExtendedHistorySlice = createSlice({
  name: 'patient-extended-history',
  initialState,
  reducers: {
    setExtendedHistoryUpdated: (state, action) => {
      state.extendedHistoryUpdated = action.payload;
    },
    setExtendedHistoryDetail: (state, action) => {
      state.extendedHistoryDetail = action.payload;
    },
  },
  extraReducers: {
    [createExtendedHistory.pending]: state => {
      state.extendedHistoryUpdated = false;
      state.extendedHistoryLoading = true;
    },
    [createExtendedHistory.rejected]: state => {
      state.extendedHistoryUpdated = false;
      state.extendedHistoryLoading = false;
    },
    [createExtendedHistory.fulfilled]: state => {
      state.extendedHistoryUpdated = true;
      state.extendedHistoryLoading = false;
    },
    [editExtendedHistory.pending]: state => {
      state.extendedHistoryUpdated = false;
      state.extendedHistoryLoading = true;
    },
    [editExtendedHistory.rejected]: state => {
      state.extendedHistoryUpdated = false;
      state.extendedHistoryLoading = false;
    },
    [editExtendedHistory.fulfilled]: state => {
      state.extendedHistoryUpdated = true;
      state.extendedHistoryLoading = false;
    },
    [getExtendedHistoryData.pending]: state => {
      state.extendedHistoryDetail = {};
      state.extendedHistoryLoading = true;
    },
    [getExtendedHistoryData.rejected]: state => {
      state.extendedHistoryDetail = {};
      state.extendedHistoryLoading = false;
    },
    [getExtendedHistoryData.fulfilled]: (state, action) => {
      state.extendedHistoryDetail = action.payload;
      state.extendedHistoryLoading = false;
    },
  },
});

export const { setExtendedHistoryUpdated, setExtendedHistoryDetail } =
  patientExtendedHistorySlice.actions;

export default patientExtendedHistorySlice.reducer;
