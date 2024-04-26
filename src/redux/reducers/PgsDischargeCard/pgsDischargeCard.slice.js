import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const initialState = {
  pgsDischargeCardDetails: {},
  pgsDischargeCardLoading: false,
  pgsDischargeCardUpdate: false,
};

export const createPgsDischargeCard = createAsyncThunk(
  "add-pgs-discharge-card",
  (props, { dispatch }) => {
    return new Promise((resolve, reject) => {
      const { location_id, patient_reg_id, module_id, payload } = props;
      axios
        .post(
          `/pgs-discharge-card/add-detail/${location_id}/${patient_reg_id}/${module_id}`,
          payload
        )
        .then((res) => {
          if (res?.data?.err === 0) {
            toast.success(res.data?.msg);
            resolve(res.data.data);
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
export const getPgsDischargeCard = createAsyncThunk(
  "get-pgs-discharge-card",
  (props, { dispatch }) => {
    return new Promise((resolve, reject) => {
      const { location_id, patient_reg_id, module_id, ivf_flow_id } = props;
      axios
        .get(
          `/pgs-discharge-card/view/${location_id}/${patient_reg_id}/${module_id}/${ivf_flow_id}`
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

export const editPgsDischargeCard = createAsyncThunk(
  "update-pgs-discharge-card",
  (props, { dispatch }) => {
    return new Promise((resolve, reject) => {
      const { location_id, _id, module_id, payload } = props;
      axios
        .patch(
          `pgs-discharge-card/update/${location_id}/${_id}/${module_id}`,
          payload
        )
        .then((res) => {
          if (res?.data?.err === 0) {
            toast.success(res.data?.msg);
            resolve(res.data.data);
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

export const pgsDischargeCardSlice = createSlice({
  name: "pgs-discharge-card",
  initialState,
  reducers: {
    setPgsDischargeCardUpdate: (state, action) => {
      state.pgsDischargeCardUpdate = action.payload;
    },
    setPgsDischargeCardDetails: (stat, action) => {
      stat.pgsDischargeCardDetails = action.payload;
    },
  },
  extraReducers: {
    [createPgsDischargeCard.pending]: (state) => {
      state.pgsDischargeCardLoading = true;
    },
    [createPgsDischargeCard.rejected]: (state) => {
      state.pgsDischargeCardLoading = false;
    },
    [createPgsDischargeCard.fulfilled]: (state, action) => {
      state.pgsDischargeCardLoading = false;
      state.pgsDischargeCardDetails = action.payload
    },
    [getPgsDischargeCard.pending]: (state) => {
      state.pgsDischargeCardDetails = {};
      state.pgsDischargeCardLoading = true;
    },
    [getPgsDischargeCard.rejected]: (state) => {
      state.pgsDischargeCardDetails = {};
      state.pgsDischargeCardLoading = false;
    },
    [getPgsDischargeCard.fulfilled]: (state, action) => {
      state.pgsDischargeCardDetails = action.payload;
      state.pgsDischargeCardLoading = false;
    },
    [editPgsDischargeCard.pending]: (state) => {
      state.pgsDischargeCardLoading = true;
    },
    [editPgsDischargeCard.rejected]: (state) => {
      state.pgsDischargeCardLoading = false;
    },
    [editPgsDischargeCard.fulfilled]: (state, action) => {
      state.pgsDischargeCardDetails = action.payload;
      state.pgsDischargeCardLoading = false;
    },
  },
});

export const { setPgsDischargeCardUpdate, setPgsDischargeCardDetails } =
  pgsDischargeCardSlice.actions;
export default pgsDischargeCardSlice.reducer;
