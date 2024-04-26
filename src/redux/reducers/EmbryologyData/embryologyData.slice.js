import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const initialState = {
  embryologyData: {},
  embryologyDataLoading: false,
  embryologyDataUpdate: false,
  patientList: []
};

export const createEmbryologyData = createAsyncThunk(
  "add-embryology-data",
  (props, { dispatch }) => {
    return new Promise((resolve, reject) => {
      const { location_id, patient_reg_id, module_id, payload } = props;
      axios
        .post(
          `embryology/add-detail/${location_id}/${patient_reg_id}/${module_id}`,
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

export const getEmbryologyData = createAsyncThunk(
  "get-embryology-data",
  (props, { dispatch }) => {
    return new Promise((resolve, reject) => {
      const { location_id, patient_reg_id, module_id, ivf_flow_id } = props;
      axios
        .get(
          `embryology/view/${location_id}/${patient_reg_id}/${module_id}/${ivf_flow_id}`
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

export const printEmbryologyFlowSheet = createAsyncThunk(
  "embryology-data-print",
  (props, { dispatch }) => {
    return new Promise((resolve, reject) => {
      const { moduleId, patientRegId, ivfFlowId } = props;
      axios
        .post(`/embryology/print/${moduleId}/${patientRegId}/${ivfFlowId}`)
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

export const printEmbryoWarming = createAsyncThunk(
  "embryology-warming-data-print",
  (props, { dispatch }) => {
    return new Promise((resolve, reject) => {
      const { moduleId, patientRegId, ivfFlowId } = props;
      axios
        .post(`/embryo-warming/print/${moduleId}/${patientRegId}/${ivfFlowId}`)
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

export const printVitrificationReport = createAsyncThunk(
  "print-vitrification-report",
  (props, { dispatch }) => {
    return new Promise((resolve, reject) => {
      const { moduleId, patientRegId, ivfFlowId, payload } = props;
      axios
        .post(
          `vitrification-report/print/${moduleId}/${patientRegId}/${ivfFlowId}`, payload
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

export const editEmbryologyData = createAsyncThunk(
  "luteal-embryology-data",
  (props, { dispatch }) => {
    return new Promise((resolve, reject) => {
      const { location_id, _id, module_id, payload } = props;
      axios
        .patch(`embryology/update/${location_id}/${_id}/${module_id}`, payload)
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


export const getPatientSearch = createAsyncThunk(
  'get-global-search-data',
  (props, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .post('patient-registration/search', props)
        .then(res => {
          if (res?.data?.err === 0) {
            if (Object.keys(res?.data?.data).length > 0) {
              resolve(res?.data?.data);
            } else {
              resolve([]);
            }
          } else {
            reject([]);
          }
        })
        .catch(error => {
          toast.error(error?.response?.data?.msg);
          reject(error);
        });
    });
  },
);

export const embryologyDataSlice = createSlice({
  name: "embryology-Data",
  initialState,
  reducers: {
    setEmbryologyDataUpdate: (state, action) => {
      state.embryologyDataUpdate = action.payload;
    },
    setEmbryologyData: (state, action) => {
      state.embryologyData = action.payload;
    },
    setPatientListData: (state, action) => {
      state.patientList = action.payload;
    },
  },
  extraReducers: {
    [createEmbryologyData.pending]: (state) => {
      state.embryologyDataUpdate = false;
      state.embryologyDataLoading = true;
    },
    [createEmbryologyData.rejected]: (state) => {
      state.embryologyDataUpdate = false;
      state.embryologyDataLoading = false;
    },
    [createEmbryologyData.fulfilled]: (state) => {
      state.embryologyDataUpdate = true;
      state.embryologyDataLoading = false;
    },
    [getEmbryologyData.pending]: (state) => {
      state.embryologyData = {};
      state.embryologyDataLoading = true;
    },
    [getEmbryologyData.rejected]: (state) => {
      state.embryologyData = {};
      state.embryologyDataLoading = false;
    },
    [getEmbryologyData.fulfilled]: (state, action) => {
      state.embryologyData = action.payload;
      state.embryologyDataLoading = false;
    },
    [editEmbryologyData.pending]: (state) => {
      state.embryologyDataLoading = true;
      state.embryologyDataUpdate = false;
    },
    [editEmbryologyData.rejected]: (state) => {
      state.embryologyDataLoading = false;
      state.embryologyDataUpdate = false;
    },
    [editEmbryologyData.fulfilled]: (state) => {
      state.embryologyDataLoading = false;
      state.embryologyDataUpdate = true;
    },

    [printEmbryologyFlowSheet.pending]: (state) => {
      state.embryologyDataLoading = true;
    },
    [printEmbryologyFlowSheet.rejected]: (state) => {
      state.embryologyDataLoading = false;
    },
    [printEmbryologyFlowSheet.fulfilled]: (state) => {
      state.embryologyDataLoading = false;
    },

    [printEmbryoWarming.pending]: (state) => {
      state.embryologyDataLoading = true;
    },
    [printEmbryoWarming.rejected]: (state) => {
      state.embryologyDataLoading = false;
    },
    [printEmbryoWarming.fulfilled]: (state) => {
      state.embryologyDataLoading = false;
    },

    [printVitrificationReport.pending]: (state) => {
      state.embryologyDataLoading = true;
    },
    [printVitrificationReport.rejected]: (state) => {
      state.embryologyDataLoading = false;
    },
    [printVitrificationReport.fulfilled]: (state) => {
      state.embryologyDataLoading = false;
    },
    [getPatientSearch.pending]: (state) => {
      state.embryologyDataLoading = true;
    },
    [getPatientSearch.rejected]: (state) => {
      state.patientList = [];
      state.embryologyDataLoading = false;
    },
    [getPatientSearch.fulfilled]: (state, action) => {
      state.embryologyDataLoading = false;
      state.patientList = action.payload;;
    },
  },
});
export const { setEmbryologyDataUpdate, setEmbryologyData, setPatientListData } =
  embryologyDataSlice.actions;
export default embryologyDataSlice.reducer;
