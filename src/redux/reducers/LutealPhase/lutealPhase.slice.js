import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const initialState = {
  lutealPhaseData: {},
  lutealPhaseListLoading: false,
  lutealPhaseUpdate: false,
};

export const createLutealPhase = createAsyncThunk(
  "add-luteal-phase",
  (props, { dispatch }) => {
    return new Promise((resolve, reject) => {
      const { location_id, patient_reg_id, module_id, payload } = props;
      axios
        .post(
          `luteal-phase/add-detail/${location_id}/${patient_reg_id}/${module_id}`,
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
export const getLutealPhase = createAsyncThunk(
  "get-luteal-phase",
  (props, { dispatch }) => {
    return new Promise((resolve, reject) => {
      const { location_id, patient_reg_id, module_id, ivf_flow_id } = props;
      axios
        .get(
          `luteal-phase/view/${location_id}/${patient_reg_id}/${module_id}/${ivf_flow_id}`
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

export const editLutealPhase = createAsyncThunk(
  "luteal-phase-update",
  (props, { dispatch }) => {
    return new Promise((resolve, reject) => {
      const { location_id, _id, module_id, payload } = props;
      axios
        .patch(
          `luteal-phase/update/${location_id}/${_id}/${module_id}`,
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

export const lutealPhaseSlice = createSlice({
  name: "luteal-Phase",
  initialState,
  reducers: {
    setLutealPhaseUpdate: (state, action) => {
      state.lutealPhaseUpdate = action.payload;
    },
    setLutealPhaseDetails: (state, action) => {
      state.lutealPhaseData = action.payload;
    },
  },
  extraReducers: {
    [createLutealPhase.pending]: (state) => {
      state.lutealPhaseUpdate = false;
      state.lutealPhaseListLoading = true;
    },
    [createLutealPhase.rejected]: (state) => {
      state.lutealPhaseUpdate = false;
      state.lutealPhaseListLoading = false;
    },
    [createLutealPhase.fulfilled]: (state) => {
      state.lutealPhaseUpdate = true;
      state.lutealPhaseListLoading = false;
    },
    [getLutealPhase.pending]: (state) => {
      state.lutealPhaseData = {};
      state.lutealPhaseListLoading = true;
    },
    [getLutealPhase.rejected]: (state) => {
      state.lutealPhaseData = {};
      state.lutealPhaseListLoading = false;
    },
    [getLutealPhase.fulfilled]: (state, action) => {
      state.lutealPhaseData = action.payload;
      state.lutealPhaseListLoading = false;
    },
    [editLutealPhase.pending]: (state) => {
      state.lutealPhaseUpdate = false;
      state.lutealPhaseListLoading = true;
    },
    [editLutealPhase.rejected]: (state) => {
      state.lutealPhaseUpdate = false;
      state.lutealPhaseListLoading = false;
    },
    [editLutealPhase.fulfilled]: (state) => {
      state.lutealPhaseUpdate = true;
      state.lutealPhaseListLoading = false;
    },
  },
});

export const { setLutealPhaseUpdate, setLutealPhaseDetails } =
  lutealPhaseSlice.actions;
export default lutealPhaseSlice.reducer;
