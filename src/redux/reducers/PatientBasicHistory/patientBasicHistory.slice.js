import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

const initialState = {
  patientBasicLoading: false,
  isPatientBasicCreated: false,
  patientBasicHistoryDetail: {},
};
export const createPatientBasicHistoryDetails = createAsyncThunk(
  'admin/create-patient-basic-history-details',
  (props, { dispatch }) => {
    return new Promise((resolve, reject) => {
      const { locationId, patientRegId, moduleId, payload } = props;
      axios
        .post(
          `patient-basic-history/add-detail/${locationId}/${patientRegId}/${moduleId}`,
          payload,
        )
        .then(res => {
          if (res?.data?.err === 0) {
            toast.success(res.data?.msg);
            resolve(res.data);
          } else {
            toast.error(res?.data?.msg);
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

export const getPatientBasicHistoryData = createAsyncThunk(
  'admin/get-patient-basic-history-data',
  (props, { dispatch }) => {
    return new Promise((resolve, reject) => {
      const { locationId, patientRegId, moduleId } = props;
      axios
        .get(`patient-basic-history/view/${locationId}/${patientRegId}/${moduleId}`)
        .then(res => {
          if (res?.data?.err === 0) {
            if (Object.keys(res.data?.data).length > 0) {
              resolve(res.data.data);
            } else {
              resolve({});
            }
          } else {
            reject({});
            // toast.error(res.data.msg);
          }
        })
        .catch(error => {
          toast.error(error?.response?.data?.msg);
          reject(error);
        });
    });
  },
);
export const updatePatientBasicHistory = createAsyncThunk(
  'admin/update-patient-basic-history',
  (props, { dispatch }) => {
    return new Promise((resolve, reject) => {
      const { locationId, id, moduleId, payload } = props;
      axios
        .patch(
          `patient-basic-history/update/${locationId}/${id}/${moduleId}`,
          payload,
        )
        .then(res => {
          if (res?.data?.err === 0) {
            toast.success(res.data?.msg);
            resolve(res.data?.data);
          } else {
            toast.error(res.data?.msg);
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
export const patientBasicHistorySlice = createSlice({
  name: 'patient-basic-history',
  initialState,
  reducers: {
    setPatientBasicCreated: (state, action) => {
      state.isPatientBasicCreated = action.payload;
    },
    setPatientBasicHistoryDetail: (state, action) => {
      state.patientBasicHistoryDetail = action.payload;
    },
  },
  extraReducers: {
    [createPatientBasicHistoryDetails.pending]: state => {
      state.isPatientBasicCreated = false;
      state.patientBasicLoading = true;
    },
    [createPatientBasicHistoryDetails.rejected]: state => {
      state.isPatientBasicCreated = false;
      state.patientBasicLoading = false;
    },
    [createPatientBasicHistoryDetails.fulfilled]: state => {
      state.isPatientBasicCreated = true;
      state.patientBasicLoading = false;
    },
    [getPatientBasicHistoryData.pending]: state => {
      state.patientBasicHistoryDetail = {};
      state.patientBasicLoading = true;
    },
    [getPatientBasicHistoryData.rejected]: state => {
      state.patientBasicHistoryDetail = {};
      state.patientBasicLoading = false;
    },
    [getPatientBasicHistoryData.fulfilled]: (state, action) => {
      state.patientBasicHistoryDetail = action.payload;
      state.patientBasicLoading = false;
    },
  },
});

export const {
  setPatientBasicLoading,
  setPatientBasicCreated,
  setPatientBasicHistoryDetail,
} = patientBasicHistorySlice.actions;

export default patientBasicHistorySlice.reducer;
