import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const initialState = {
  tesaPesaDischargeCardDetails: {},
  tesaPesaDischargeCardLoading: false,
  tesaPesaDischargeCardUpdate: false,
};

export const createTesaPesaDischargeCard = createAsyncThunk(
  "add-tesa-pesa-discharge-card",
  (props, { dispatch }) => {
    return new Promise((resolve, reject) => {
      const { location_id, patient_reg_id, module_id, payload } = props;
      axios
        .post(
          `/tesa-pesa-discharge-card/add-detail/${location_id}/${patient_reg_id}/${module_id}`,
          payload
        )
        .then((res) => {
          if (res?.data?.err === 0) {
            toast.success(res.data?.msg);
            resolve(res.data?.data);
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
export const getTesaPesaDischargeCard = createAsyncThunk(
  "get-tesa-pesa-discharge-card",
  (props, { dispatch }) => {
    return new Promise((resolve, reject) => {
      const { location_id, patient_reg_id, module_id, ivf_flow_id } = props;
      axios
        .get(
          `/tesa-pesa-discharge-card/view/${location_id}/${patient_reg_id}/${module_id}/${ivf_flow_id}`
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

export const editTesaPesaDischargeCard = createAsyncThunk(
  "update-tesa-pesa-discharge-card",
  (props, { dispatch }) => {
    return new Promise((resolve, reject) => {
      const { location_id, _id, module_id, payload } = props;
      axios
        .patch(
          `/tesa-pesa-discharge-card/update/${location_id}/${_id}/${module_id}`,
          payload
        )
        .then((res) => {
          if (res?.data?.err === 0) {
            toast.success(res.data?.msg);
            resolve(res.data?.data);
            // resolve(res.data);
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

export const printTesaPesadDischargeCardData = createAsyncThunk(
  "tesa-pesa-discharge-card-print",
  (props, { dispatch }) => {
    return new Promise((resolve, reject) => {
      const { moduleId, patientRegId, ivfFlowId } = props;
      axios
        .post(
          `/tesa-pesa-discharge-card/print/${moduleId}/${patientRegId}/${ivfFlowId}`
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

export const tesaPesaDischargeCardSlice = createSlice({
  name: "tesaPesa-discharge-card",
  initialState,
  reducers: {
    setTesaPesaDischargeCardUpdate: (state, action) => {
      state.dischargeCardUpdate = action.payload;
    },
    setTesaPesaDischargeCardDetails: (stat, action) => {
      stat.tesaPesaDischargeCardDetails = action.payload;
    },
  },
  extraReducers: {
    [createTesaPesaDischargeCard.pending]: (state) => {
      state.tesaPesaDischargeCardLoading = true;
    },
    [createTesaPesaDischargeCard.rejected]: (state) => {
      state.tesaPesaDischargeCardLoading = false;
    },
    [createTesaPesaDischargeCard.fulfilled]: (state, action) => {
      state.tesaPesaDischargeCardDetails = action.payload;
      state.tesaPesaDischargeCardLoading = false;
    },
    [getTesaPesaDischargeCard.pending]: (state) => {
      state.tesaPesaDischargeCardDetails = {};
      state.tesaPesaDischargeCardLoading = true;
    },
    [getTesaPesaDischargeCard.rejected]: (state) => {
      state.tesaPesaDischargeCardDetails = {};
      state.tesaPesaDischargeCardLoading = false;
    },
    [getTesaPesaDischargeCard.fulfilled]: (state, action) => {
      state.tesaPesaDischargeCardDetails = action.payload;
      state.tesaPesaDischargeCardLoading = false;
    },
    [editTesaPesaDischargeCard.pending]: (state) => {
      state.tesaPesaDischargeCardLoading = true;
    },
    [editTesaPesaDischargeCard.rejected]: (state) => {
      state.tesaPesaDischargeCardLoading = false;
    },
    [editTesaPesaDischargeCard.fulfilled]: (state, action) => {
      state.tesaPesaDischargeCardDetails = action.payload;
      state.tesaPesaDischargeCardLoading = false;
    },
    [printTesaPesadDischargeCardData.pending]: (state) => {
      state.tesaPesaDischargeCardLoading = true;
    },
    [printTesaPesadDischargeCardData.rejected]: (state) => {
      state.tesaPesaDischargeCardLoading = false;
    },
    [printTesaPesadDischargeCardData.fulfilled]: (state, action) => {
      state.tesaPesaDischargeCardLoading = false;
    },
  },
});

export const {
  setTesaPesaDischargeCardUpdate,
  setTesaPesaDischargeCardDetails,
} = tesaPesaDischargeCardSlice.actions;
export default tesaPesaDischargeCardSlice.reducer;
