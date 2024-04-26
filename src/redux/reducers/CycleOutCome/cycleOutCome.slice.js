import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const initialState = {
  cycleOutComeData: {},
  cycleOutComeLoading: false,
  cycleOutComeUpdate: false,
};

export const createCycleOutcome = createAsyncThunk(
  "add-cycle-outcome",
  (props, { dispatch }) => {
    return new Promise((resolve, reject) => {
      const { location_id, patient_reg_id, module_id, payload } = props;
      axios
        .post(
          `cycle-outcome/add-detail/${location_id}/${patient_reg_id}/${module_id}`,
          payload
        )
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
export const getCycleOutcome = createAsyncThunk(
  "get-cycle-outcome",
  (props, { dispatch }) => {
    return new Promise((resolve, reject) => {
      const { location_id, patient_reg_id, module_id, ivf_flow_id } = props;
      axios
        .get(
          `cycle-outcome/view/${location_id}/${patient_reg_id}/${module_id}/${ivf_flow_id}`
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

export const editCycleOutcome = createAsyncThunk(
  "update-cycle-outcome",
  (props, { dispatch }) => {
    return new Promise((resolve, reject) => {
      const { location_id, _id, module_id, payload } = props;
      axios
        .patch(
          `cycle-outcome/update/${location_id}/${_id}/${module_id}`,
          payload
        )
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

export const cycleOutcomeSlice = createSlice({
  name: "cycle-Outcome",
  initialState,
  reducers: {
    setCycleOutComeUpdate: (state, action) => {
      state.cycleOutComeUpdate = action.payload;
    },
    setCycleOutComeData: (stat, action) => {
      stat.cycleOutComeData = action.payload;
    },
  },
  extraReducers: {
    [createCycleOutcome.pending]: (state) => {
      state.cycleOutComeUpdate = false;
      state.cycleOutComeLoading = true;
    },
    [createCycleOutcome.rejected]: (state) => {
      state.cycleOutComeUpdate = false;
      state.cycleOutComeLoading = false;
    },
    [createCycleOutcome.fulfilled]: (state) => {
      state.cycleOutComeUpdate = true;
      state.cycleOutComeLoading = false;
    },
    [getCycleOutcome.pending]: (state) => {
      state.cycleOutComeData = {};
      state.cycleOutComeLoading = true;
    },
    [getCycleOutcome.rejected]: (state) => {
      state.cycleOutComeData = {};
      state.cycleOutComeLoading = false;
    },
    [getCycleOutcome.fulfilled]: (state, action) => {
      state.cycleOutComeData = action.payload;
      state.cycleOutComeLoading = false;
    },
    [editCycleOutcome.pending]: (state) => {
      state.cycleOutComeUpdate = false;
      state.cycleOutComeLoading = true;
    },
    [editCycleOutcome.rejected]: (state) => {
      state.cycleOutComeUpdate = false;
      state.cycleOutComeLoading = false;
    },
    [editCycleOutcome.fulfilled]: (state) => {
      state.cycleOutComeUpdate = true;
      state.cycleOutComeLoading = false;
    },
  },
});

export const { setCycleOutComeUpdate, setCycleOutComeData } =
  cycleOutcomeSlice.actions;
export default cycleOutcomeSlice.reducer;
