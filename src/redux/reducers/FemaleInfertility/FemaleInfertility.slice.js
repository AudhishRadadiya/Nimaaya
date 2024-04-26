import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const initialState = {
  femaleInfertilityList: [],
  femaleInfertilityLoading: false,
  femaleInfertilityDetails: {},
  femaleInfertilityUpdate: false,
};

export const createFemaleInfertility = createAsyncThunk(
  "admin/female-infertility/add-detail",
  (props, { dispatch }) => {
    return new Promise((resolve, reject) => {
      const { location_id, patient_reg_id, moduleId, payload } = props;
      axios
        .post(
          `female-infertility/add-detail/${location_id}/${patient_reg_id}/${moduleId}`,
          payload
        )
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

export const editFemaleInfertility = createAsyncThunk(
  "admin/female-infertility/update",
  (props, { dispatch }) => {
    return new Promise((resolve, reject) => {
      const { location_id, id, moduleId, payload } = props;
      axios
        .patch(
          `female-infertility/update/${location_id}/${id}/${moduleId}`,
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

export const getFemaleInfertility = createAsyncThunk(
  "admin/female-infertility/view",
  (props, { dispatch }) => {
    return new Promise((resolve, reject) => {
      const { location_id, patient_reg_id, moduleId } = props;
      axios
        .get(
          `female-infertility/view/${location_id}/${patient_reg_id}/${moduleId}`
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
export const femaleInfertilitySlice = createSlice({
  name: "female-Infertility",
  initialState,
  reducers: {
    setFemaleInfertilityUpdated: (state, action) => {
      state.femaleInfertilityUpdate = action.payload;
    },
    setFemaleInfertilityDetails: (state, action) => {
      state.femaleInfertilityDetails = action.payload;
    },
  },
  extraReducers: {
    [createFemaleInfertility.pending]: (state) => {
      state.femaleInfertilityUpdate = false;
      state.femaleInfertilityLoading = true;
    },
    [createFemaleInfertility.rejected]: (state) => {
      state.femaleInfertilityUpdate = false;
      state.femaleInfertilityLoading = false;
    },
    [createFemaleInfertility.fulfilled]: (state) => {
      state.femaleInfertilityUpdate = true;
      state.femaleInfertilityLoading = false;
    },
    [editFemaleInfertility.pending]: (state) => {
      state.femaleInfertilityUpdate = false;
      state.femaleInfertilityLoading = true;
    },
    [editFemaleInfertility.rejected]: (state) => {
      state.femaleInfertilityUpdate = false;
      state.femaleInfertilityLoading = false;
    },
    [editFemaleInfertility.fulfilled]: (state) => {
      state.femaleInfertilityUpdate = true;
      state.femaleInfertilityLoading = false;
    },
    [getFemaleInfertility.pending]: (state) => {
      state.femaleInfertilityDetails = {};
      state.femaleInfertilityLoading = true;
    },
    [getFemaleInfertility.rejected]: (state) => {
      state.femaleInfertilityDetails = {};
      state.femaleInfertilityLoading = false;
    },
    [getFemaleInfertility.fulfilled]: (state, action) => {
      state.femaleInfertilityDetails = action.payload;
      state.femaleInfertilityLoading = false;
    },
  },
});

export const {
  setFemaleInfertilityCreated,
  setFemaleInfertilityDetails,
  setFemaleInfertilityUpdated,
} = femaleInfertilitySlice.actions;
export default femaleInfertilitySlice.reducer;
