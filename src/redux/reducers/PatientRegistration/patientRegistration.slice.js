import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const initialState = {
  patientLoading: false,
  isPatientCreated: false,
  isPatientUpdated: false,
  patientDetail: {},
};
export const createPatientDetails = createAsyncThunk(
  "admin/create-patient-details",
  (props, { dispatch }) => {
    return new Promise((resolve, reject) => {
      const { moduleId, payload } = props;
      axios
        .post(`patient-registration/add-detail/${moduleId}`, payload)
        .then((res) => {
          if (res?.data?.err === 0) {
            toast.success(res.data?.msg);
            resolve(res.data.data);
          } else {
            toast.error(res?.data?.msg);
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

export const getPatientData = createAsyncThunk(
  "admin/get-patient-data",
  (props, { dispatch }) => {
    return new Promise((resolve, reject) => {
      const { patientRegId, moduleId } = props;
      axios
        .get(`patient-registration/view/${patientRegId}/${moduleId}`)
        .then((res) => {
          if (res?.data?.err === 0) {
            if (Object.keys(res?.data?.data).length > 0) {
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

export const updatePatientDetails = createAsyncThunk(
  "admin/update-patient-details",
  (props, { dispatch }) => {
    return new Promise((resolve, reject) => {
      const { patientRegistrationId, moduleId, payload } = props;
      axios
        .patch(
          `patient-registration/update/${patientRegistrationId}/${moduleId}`,
          payload
        )
        .then((res) => {
          if (res?.data?.err === 0) {
            toast.success(res.data?.msg);
            resolve(res.data?.data);
          } else {
            toast.error(res?.data?.msg);
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

export const printPatientDetails = createAsyncThunk(
  "print-patient-registration-patient-details",
  (props, { dispatch }) => {
    return new Promise((resolve, reject) => {
      const { moduleId, payload } = props;
      axios
        .post(`patient-registration/print-registration/${moduleId}`, payload)
        .then((res) => {
          if (res?.data?.err === 0) {
            window.open(res.data.data.url, "_blank");
            resolve(res.data.data);
          } else {
            toast.error(res?.data?.msg);
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

export const printPatientInfosticker = createAsyncThunk(
  "print-patient-info-sticker",
  (props, { dispatch }) => {
    return new Promise((resolve, reject) => {
      const { moduleId, payload } = props;
      axios
        .post(`/patient-registration/print-sticker/${moduleId}`, payload)
        .then((res) => {
          if (res?.data?.err === 0) {
            window.open(res.data.data.url, "_blank");
            resolve(res.data.data);
          } else {
            toast.error(res?.data?.msg);
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

export const patientRegistrationSlice = createSlice({
  name: "patient-registration",
  initialState,
  reducers: {
    setPatientCreated: (state, action) => {
      state.isPatientCreated = action.payload;
    },
    setPatientDetail: (state, action) => {
      state.patientDetail = action.payload;
    },
    setIsPatientUpdated: (state, action) => {
      state.isPatientUpdated = action.payload;
    },
  },
  extraReducers: {
    [createPatientDetails.pending]: (state) => {
      state.isPatientCreated = false;
      state.patientLoading = true;
    },
    [createPatientDetails.rejected]: (state) => {
      state.isPatientCreated = false;
      state.patientLoading = false;
    },
    [createPatientDetails.fulfilled]: (state, action) => {
      state.isPatientCreated = true;
      state.patientLoading = false;
      state.patientDetail = action.payload;
    },
    [getPatientData.pending]: (state) => {
      state.patientDetail = {};
      state.patientLoading = true;
    },
    [getPatientData.rejected]: (state) => {
      state.patientDetail = {};
      state.patientLoading = false;
    },
    [getPatientData.fulfilled]: (state, action) => {
      state.patientDetail = action.payload;
      state.patientLoading = false;
    },
    [updatePatientDetails.pending]: (state) => {
      state.isPatientUpdated = false;
      state.patientLoading = true;
    },
    [updatePatientDetails.rejected]: (state) => {
      state.isPatientUpdated = false;
      state.patientLoading = false;
    },
    [updatePatientDetails.fulfilled]: (state) => {
      state.isPatientUpdated = true;
      state.patientLoading = false;
    },
    [printPatientDetails.pending]: (state) => {
      state.patientLoading = true;
    },
    [printPatientDetails.rejected]: (state) => {
      state.patientLoading = false;
    },
    [printPatientDetails.fulfilled]: (state) => {
      state.patientLoading = false;
    },
    [printPatientInfosticker.pending]: (state) => {
      state.patientLoading = true;
    },
    [printPatientInfosticker.rejected]: (state) => {
      state.patientLoading = false;
    },
    [printPatientInfosticker.fulfilled]: (state) => {
      state.patientLoading = false;
    },
  },
});

export const { setPatientCreated, setPatientDetail, setIsPatientUpdated } =
  patientRegistrationSlice.actions;

export default patientRegistrationSlice.reducer;
