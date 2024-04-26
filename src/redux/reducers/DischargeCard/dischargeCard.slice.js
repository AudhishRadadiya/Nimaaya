import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const initialState = {
  dischargeCardData: {},
  dischargeCardLoading: false,
  dischargeCardUpdate: false,
};

export const createDischargeCard = createAsyncThunk(
  "add-discharge-card",
  (props, { dispatch }) => {
    return new Promise((resolve, reject) => {
      const { location_id, patient_reg_id, module_id, payload } = props;
      axios
        .post(
          `/discharge-card/add-detail/${location_id}/${patient_reg_id}/${module_id}`,
          payload
        )
        .then((res) => {
          if (res?.data?.err === 0) {
            toast.success(res.data?.msg);
            resolve(res?.data?.data);
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
export const getDischargeCard = createAsyncThunk(
  "get-discharge-card",
  (props, { dispatch }) => {
    return new Promise((resolve, reject) => {
      const { location_id, patient_reg_id, module_id, ivf_flow_id } = props;
      axios
        .get(
          `/discharge-card/view/${location_id}/${patient_reg_id}/${module_id}/${ivf_flow_id}`
        )
        .then((res) => {
          if (res?.data?.err === 0) {
            if (Object.keys(res?.data?.data).length > 0) {
              resolve(res.data?.data);
            } else {
              resolve({});
            }
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

export const editDischargeCard = createAsyncThunk(
  "update-discharge-card",
  (props, { dispatch }) => {
    return new Promise((resolve, reject) => {
      const { location_id, _id, module_id, payload } = props;
      axios
        .patch(
          `/discharge-card/update/${location_id}/${_id}/${module_id}`,
          payload
        )
        .then((res) => {
          if (res?.data?.err === 0) {
            toast.success(res.data?.msg);
            resolve(res?.data?.data);
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

export const printEmbryoTransfer = createAsyncThunk(
  "print-patient-registration-patient-details",
  (props, { dispatch }) => {
    return new Promise((resolve, reject) => {
      const { moduleId, location_id, patientRegId, ivfFlowId } = props;
      axios
        .post(`/discharge-card/print/${moduleId}/${location_id}/${patientRegId}/${ivfFlowId}`)
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

export const printOvumPickup = createAsyncThunk(
  "print-patient-registration-patient-details",
  (props, { dispatch }) => {
    return new Promise((resolve, reject) => {
      const { moduleId, patientRegId, ivfFlowId } = props;
      axios
        .post(
          `/ovum-pickup-summary/print/${moduleId}/${patientRegId}/${ivfFlowId}`
        )
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

export const cycleOutcomeSlice = createSlice({
  name: "discharge-card",
  initialState,
  reducers: {
    setDischargeCardUpdate: (state, action) => {
      state.dischargeCardUpdate = action.payload;
    },
    setDischargeCardData: (stat, action) => {
      stat.dischargeCardData = action.payload;
    },
  },
  extraReducers: {
    [createDischargeCard.pending]: (state) => {
      state.dischargeCardUpdate = false;
      state.dischargeCardLoading = true;
    },
    [createDischargeCard.rejected]: (state) => {
      state.dischargeCardUpdate = false;
      state.dischargeCardLoading = false;
    },
    [createDischargeCard.fulfilled]: (state, action) => {
      state.dischargeCardUpdate = true;
      state.dischargeCardLoading = false;
      state.dischargeCardData = action.payload;
    },
    [getDischargeCard.pending]: (state) => {
      state.dischargeCardData = {};
      state.dischargeCardLoading = true;
    },
    [getDischargeCard.rejected]: (state) => {
      state.dischargeCardData = {};
      state.dischargeCardLoading = false;
    },
    [getDischargeCard.fulfilled]: (state, action) => {
      state.dischargeCardData = action.payload;
      state.dischargeCardLoading = false;
    },
    [editDischargeCard.pending]: (state) => {
      state.dischargeCardLoading = true;
    },
    [editDischargeCard.rejected]: (state) => {
      state.dischargeCardLoading = false;
    },
    [editDischargeCard.fulfilled]: (state, action) => {
      state.dischargeCardData = action.payload;
      state.dischargeCardLoading = false;
    },
  },
});

export const { setDischargeCardUpdate, setDischargeCardData } =
  cycleOutcomeSlice.actions;
export default cycleOutcomeSlice.reducer;
