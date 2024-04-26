import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const initialState = {
    semenAnalysisDetails: {},
    semenAnalysisLoading: false,
    semenAnalysisUpdate: false,
};

export const createSemenAnalysisData = createAsyncThunk(
    "create-semen-analysis-data",
    (props, { dispatch }) => {
        return new Promise((resolve, reject) => {
            const { locationId, id, moduleId, payload } = props;
            axios
                .post(
                    `/semen-analysis/add-detail/${locationId}/${id}/${moduleId}`,
                    payload
                )
                .then((res) => {
                    if (res?.data?.err === 0) {
                        toast.success(res?.data?.msg);
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

export const getSemenAnalysisData = createAsyncThunk(
    "get-semen-analysis-data",
    (props, { dispatch }) => {
        return new Promise((resolve, reject) => {
            const { location_id, patient_reg_id, module_id } = props;
            axios
                .post(
                    `/semen-analysis/view/${location_id}/${patient_reg_id}/${module_id}`
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

export const printSemenAnalysisData = createAsyncThunk(
    "print-semen-analysis-data",
    (props, { dispatch }) => {
        return new Promise((resolve, reject) => {
            const { module_id, patient_reg_id, location_id } = props;
            axios
                .post(`semen-analysis/print/${module_id}/${patient_reg_id}/${location_id}`)
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


export const editSemenAnalysisData = createAsyncThunk(
    "edit-semen-analysis-data",
    (props, { dispatch }) => {
        return new Promise((resolve, reject) => {
            const { locationId, id, moduleId, payload } = props;
            axios
                .patch(`/semen-analysis/update/${locationId}/${id}/${moduleId}`, payload)
                .then((res) => {
                    if (res?.data?.err === 0) {
                        console.log('res.data', res.data);
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


export const semenAnalysisDataSlice = createSlice({
    name: "semen-analysis-data",
    initialState,
    reducers: {
        setSemenAnalysisUpdate: (state, action) => {
            state.semenAnalysisUpdate = action.payload;
        },
        setSemenAnalysisDetails: (state, action) => {
            state.semenAnalysisDetails = action.payload;
        },
    },
    extraReducers: {
        [createSemenAnalysisData.pending]: (state) => {
            state.semenAnalysisDetails = {};
            state.semenAnalysisUpdate = false;
            state.semenAnalysisLoading = true;
        },
        [createSemenAnalysisData.rejected]: (state) => {
            state.semenAnalysisDetails = {};
            state.semenAnalysisUpdate = false;
            state.semenAnalysisLoading = false;
        },
        [createSemenAnalysisData.fulfilled]: (state, action) => {
            state.semenAnalysisDetails = action.payload;
            state.semenAnalysisUpdate = true;
            state.semenAnalysisLoading = false;
        },
        [getSemenAnalysisData.pending]: (state) => {
            state.semenAnalysisDetails = {};
            state.semenAnalysisLoading = true;
        },
        [getSemenAnalysisData.rejected]: (state) => {
            state.semenAnalysisDetails = {};
            state.semenAnalysisLoading = false;
        },
        [getSemenAnalysisData.fulfilled]: (state, action) => {
            state.semenAnalysisDetails = action.payload;
            state.semenAnalysisLoading = false;
        },
        [editSemenAnalysisData.pending]: (state) => {
            state.semenAnalysisLoading = true;
            state.semenAnalysisUpdate = false;
        },
        [editSemenAnalysisData.rejected]: (state) => {
            state.semenAnalysisLoading = false;
            state.semenAnalysisUpdate = false;
        },
        [editSemenAnalysisData.fulfilled]: (state) => {
            state.semenAnalysisLoading = false;
            state.semenAnalysisUpdate = true;
        },
        [printSemenAnalysisData.pending]: (state) => {
            state.semenAnalysisLoading = true;
        },
        [printSemenAnalysisData.rejected]: (state) => {
            state.semenAnalysisLoading = false;
        },
        [printSemenAnalysisData.fulfilled]: (state) => {
            state.semenAnalysisLoading = false;
        },

    },
});
export const { setSemenAnalysisDetails, setEmbryologyData, setSemenAnalysisUpdate, setPatientListData } =
    semenAnalysisDataSlice.actions;
export default semenAnalysisDataSlice.reducer;
