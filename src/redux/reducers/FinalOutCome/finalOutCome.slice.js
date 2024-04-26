import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const initialState = {
  finalOutComeData: {},
  finalOutComeLoading: false,
  finalOutComeUpdate: false,
};

export const createFinalOutcome = createAsyncThunk(
  "add-final-outcome",
  (props, { dispatch }) => {
    return new Promise((resolve, reject) => {
      const { location_id, patient_reg_id, module_id, payload } = props;
      axios
        .post(
          `final-outcome/add-detail/${location_id}/${patient_reg_id}/${module_id}`,
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

export const getFinalOutcome = createAsyncThunk(
  "get-final-outcome",
  (props, { dispatch }) => {
    return new Promise((resolve, reject) => {
      const { location_id, patient_reg_id, module_id, ivf_flow_id } = props;
      axios
        .get(
          `final-outcome/view/${location_id}/${patient_reg_id}/${module_id}/${ivf_flow_id}`
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

export const editFinalOutcome = createAsyncThunk(
  "update-final-outcome",
  (props, { dispatch }) => {
    return new Promise((resolve, reject) => {
      const { location_id, _id, module_id, payload } = props;
      axios
        .patch(
          `final-outcome/update/${location_id}/${_id}/${module_id}`,
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

export const finalOutcomeSlice = createSlice({
  name: "final-Outcome",
  initialState,
  reducers: {
    setFinalOutComeUpdate: (state, action) => {
      state.finalOutComeUpdate = action.payload;
    },
    setFinalOutComeData: (stat, action) => {
      stat.finalOutComeData = action.payload;
    },
  },
  extraReducers: {
    [createFinalOutcome.pending]: (state) => {
      state.finalOutComeUpdate = false;
      state.finalOutComeLoading = true;
    },
    [createFinalOutcome.rejected]: (state) => {
      state.finalOutComeUpdate = false;
      state.finalOutComeLoading = false;
    },
    [createFinalOutcome.fulfilled]: (state) => {
      state.finalOutComeUpdate = true;
      state.finalOutComeLoading = false;
    },
    [getFinalOutcome.pending]: (state) => {
      state.finalOutComeData = {};
      state.finalOutComeLoading = true;
    },
    [getFinalOutcome.rejected]: (state) => {
      state.finalOutComeData = {};
      state.finalOutComeLoading = false;
    },
    [getFinalOutcome.fulfilled]: (state, action) => {
      state.finalOutComeData = action.payload;
      state.finalOutComeLoading = false;
    },
    [editFinalOutcome.pending]: (state) => {
      state.finalOutComeUpdate = false;
      state.finalOutComeLoading = true;
    },
    [editFinalOutcome.rejected]: (state) => {
      state.finalOutComeUpdate = false;
      state.finalOutComeLoading = false;
    },
    [editFinalOutcome.fulfilled]: (state) => {
      state.finalOutComeUpdate = true;
      state.finalOutComeLoading = false;
    },
  },
});

export const { setFinalOutComeUpdate, setFinalOutComeData } =
  finalOutcomeSlice.actions;
export default finalOutcomeSlice.reducer;
