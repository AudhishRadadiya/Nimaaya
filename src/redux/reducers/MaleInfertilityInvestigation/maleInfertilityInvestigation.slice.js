import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const initialState = {
  malePatientList: {},
  malePatientListLoding: false,
  isCreateMalePatient: false,
  malePatientListUpdateLoading: false,
  maleInfertilityDataUpdate: false,
};

export const getMaleIntinfertility = createAsyncThunk(
  "admin/get-male-infertilit",
  (props, { dispatch }) => {
    return new Promise((resolve, reject) => {
      const { location_id, patientRegId, moduleId } = props;
      axios
        .get(`male-infertility/view/${location_id}/${patientRegId}/${moduleId}`)
        .then((res) => {
          if (res?.data?.err === 0) {
            if (Object.keys(res?.data?.data)?.length > 0) {
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

export const editMaleInfterlity = createAsyncThunk(
  "admin/edit-male-infertilit",
  (props, { dispatch }) => {
    return new Promise((resolve, reject) => {
      const { location_id, id, moduleId, payload } = props;
      axios
        .patch(
          `male-infertility/update/${location_id}/${id}/${moduleId}`,
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

export const createMaleIntinfertility = createAsyncThunk(
  "admin/create-male-infertilit",
  (props, { dispatch }) => {
    return new Promise((resolve, reject) => {
      const { location_id, id, moduleId, payload } = props;

      axios
        .post(
          `male-infertility/add-detail/${location_id}/${id}/${moduleId}`,
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

export const maleInfertilityInvestigationSlice = createSlice({
  name: "MaleInfertilityInvestigation",
  initialState,
  reducers: {
    setMaleIntinfertilityUpdated: (state, action) => {
      state.maleInfertilityDataUpdate = action.payload;
    },
    setMaleIntinfertilityDetail: (state, action) => {
      state.malePatientListLoding = action.payload;
    },
    setMalePatientList: (state, action) => {
      state.malePatientList = action.payload;
    },
    setIsCreateMalePatient: (state, action) => {
      state.isCreateMalePatient = action.payload;
    },
  },
  extraReducers: {
    [getMaleIntinfertility.pending]: (state) => {
      state.malePatientList = {};
      state.malePatientListLoding = true;
    },
    [getMaleIntinfertility.rejected]: (state) => {
      state.malePatientList = {};
      state.malePatientListLoding = false;
    },
    [getMaleIntinfertility.fulfilled]: (state, action) => {
      state.malePatientList = action.payload || {};
      state.malePatientListLoding = false;
    },
    [createMaleIntinfertility.pending]: (state) => {
      state.maleInfertilityDataUpdatek = false;
      state.malePatientListLoding = true;
    },
    [createMaleIntinfertility.rejected]: (state) => {
      state.maleInfertilityDataUpdate = false;
      state.malePatientListLoding = false;
    },
    [createMaleIntinfertility.fulfilled]: (state) => {
      state.maleInfertilityDataUpdate = true;
      state.malePatientListLoding = false;
    },
    [editMaleInfterlity.pending]: (state) => {
      state.maleInfertilityDataUpdate = false;
      state.malePatientListLoding = true;
    },
    [editMaleInfterlity.rejected]: (state) => {
      state.maleInfertilityDataUpdate = false;
      state.malePatientListLoding = false;
    },
    [editMaleInfterlity.fulfilled]: (state) => {
      state.maleInfertilityDataUpdate = true;
      state.malePatientListLoding = false;
    },
  },
});

export const {
  malePatientList,
  malePatientListLoding,
  malePatientListUpdateLoading,
  setMaleIntinfertilityDetail,
  setMaleIntinfertilityUpdated,
  setMalePatientList,
  setIsCreateMalePatient,
} = maleInfertilityInvestigationSlice.actions;

export default maleInfertilityInvestigationSlice.reducer;
