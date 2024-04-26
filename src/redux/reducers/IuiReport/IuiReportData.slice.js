import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const initialState = {
    iuiReportDetails: {},
    iuiReportisLoading: false,
    iuiReportisUpdate: false,
};

export const createIuiReportsData = createAsyncThunk(
    "create-iui-reports-data",
    (props, { dispatch }) => {
        return new Promise((resolve, reject) => {
            const { location_id, patient_reg_id, module_id, payload
            } = props;
            axios
                .post(
                    `iui-h-d/iui-result/add-detail/${location_id}/${patient_reg_id}/${module_id}`,
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

export const getIuiReporData = createAsyncThunk(
    "get-iui-repor-data",
    (props, { dispatch }) => {
        return new Promise((resolve, reject) => {
            const { location_id, patient_reg_id, module_id, payload } = props;
            axios
                .post(
                    `iui-h-d/iui-result/view/${location_id}/${patient_reg_id}/${module_id}`, payload
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

export const printIuiReporData = createAsyncThunk(
    "print-semen-analysis-data",
    (props, { dispatch }) => {
        return new Promise((resolve, reject) => {
            const { module_id, patient_reg_id, location_id } = props;
            axios
                .post(`semen-freezing/print/${module_id}/${patient_reg_id}/${location_id}`)
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


export const editIuiReporData = createAsyncThunk(
    "edit-semen-analysis-data",
    (props, { dispatch }) => {
        return new Promise((resolve, reject) => {
            const { location_id, _id, module_id, payload } = props;
            axios
                .patch(`iui-h-d/iui-result/update/${location_id}/${_id}/${module_id}`, payload)
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


export const IuiReportDataSlice = createSlice({
    name: "iui-report-data",
    initialState,
    reducers: {
        setIuiReportisUpdate: (state, action) => {
            state.iuiReportisUpdate = action.payload;
        },
        setIuiReportDetails: (state, action) => {
            state.iuiReportDetails = action.payload;
        },
    },
    extraReducers: {
        [createIuiReportsData.pending]: (state) => {
            state.iuiReportDetails = {};
            state.iuiReportisUpdate = false;
            state.iuiReportisLoading = true;
        },
        [createIuiReportsData.rejected]: (state) => {
            state.iuiReportDetails = {};
            state.iuiReportisUpdate = false;
            state.iuiReportisLoading = false;
        },
        [createIuiReportsData.fulfilled]: (state, action) => {
            state.iuiReportDetails = action.payload;
            state.iuiReportisUpdate = true;
            state.iuiReportisLoading = false;
        },
        [getIuiReporData.pending]: (state) => {
            state.iuiReportDetails = {};
            state.iuiReportisLoading = true;
        },
        [getIuiReporData.rejected]: (state) => {
            state.iuiReportDetails = {};
            state.iuiReportisLoading = false;
        },
        [getIuiReporData.fulfilled]: (state, action) => {
            state.iuiReportDetails = action.payload;
            state.iuiReportisLoading = false;
        },
        [editIuiReporData.pending]: (state) => {
            // state.iuiReportDetails = {};
            state.iuiReportisLoading = true;
            state.iuiReportisUpdate = false;
        },
        [editIuiReporData.rejected]: (state) => {
            // state.iuiReportDetails = {};
            state.iuiReportisLoading = false;
            state.iuiReportisUpdate = false;
        },
        [editIuiReporData.fulfilled]: (state, action) => {
            // state.iuiReportDetails = action.payload;
            state.iuiReportisLoading = false;
            state.iuiReportisUpdate = true;
        },
        [printIuiReporData.pending]: (state) => {
            state.iuiReportisLoading = true;
        },
        [printIuiReporData.rejected]: (state) => {
            state.iuiReportisLoading = false;
        },
        [printIuiReporData.fulfilled]: (state) => {
            state.iuiReportisLoading = false;
        },

    },
});
export const { setIuiReportisUpdate, setIuiReportDetails } =
    IuiReportDataSlice.actions;
export default IuiReportDataSlice.reducer;
