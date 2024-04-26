import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const initialState = {
    sstDetails: {},
    sstLoading: false,
    sstDataUpdate: false,
};

export const createSstData = createAsyncThunk(
    "create-sst-data",
    (props, { dispatch }) => {
        return new Promise((resolve, reject) => {
            const { location_id, patient_reg_id, module_id, payload } = props;
            axios
                .post(
                    `sst/add-detail/${location_id}/${patient_reg_id}/${module_id}`,
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

export const getSstData = createAsyncThunk(
    "get-sst-Data",
    (props, { dispatch }) => {
        return new Promise((resolve, reject) => {
            const { location_id, patient_reg_id, module_id, payload } = props;
            axios
                .post(
                    `sst/view/${location_id}/${patient_reg_id}/${module_id}`, payload
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

export const printSst = createAsyncThunk(
    "print-sst",
    (props, { dispatch }) => {
        return new Promise((resolve, reject) => {
            const { module_id, patient_reg_id, location_id } = props;
            axios
                .post(
                    `sst/print/${module_id}/${patient_reg_id}/${location_id}`
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


export const editSstData = createAsyncThunk(
    "edit-sst-data",
    (props, { dispatch }) => {
        return new Promise((resolve, reject) => {
            const { location_id, _id, module_id, payload } = props;
            axios
                .patch(`sst/update/${location_id}/${_id}/${module_id}`, payload)
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


export const sstDataSlice = createSlice({
    name: "sst-data-slice",
    initialState,
    reducers: {
        setSstDataUpdate: (state, action) => {
            state.sstDataUpdate = action.payload;
        },
        setSstDetails: (state, action) => {
            state.sstDetails = action.payload;
        },
    },
    extraReducers: {
        [createSstData.pending]: (state) => {
            state.sstDetails = {};
            state.sstDataUpdate = false;
            state.sstLoading = true;
        },
        [createSstData.rejected]: (state) => {
            state.sstDetails = {};
            state.sstDataUpdate = false;
            state.sstLoading = false;
        },
        [createSstData.fulfilled]: (state, action) => {
            state.sstDetails = action.payload;
            state.sstDataUpdate = true;
            state.sstLoading = false;
        },
        [getSstData.pending]: (state) => {
            state.sstDetails = {};
            state.sstLoading = true;
        },
        [getSstData.rejected]: (state) => {
            state.sstDetails = {};
            state.sstLoading = false;
        },
        [getSstData.fulfilled]: (state, action) => {
            state.sstDetails = action.payload;
            state.sstLoading = false;
        },
        [editSstData.pending]: (state) => {
            state.sstDetails = {};
            state.sstLoading = true;
            state.sstDataUpdate = false;
        },
        [editSstData.rejected]: (state) => {
            state.sstDetails = {};
            state.sstLoading = false;
            state.sstDataUpdate = false;
        },
        [editSstData.fulfilled]: (state, action) => {
            state.sstDetails = action.payload;
            state.sstLoading = false;
            state.sstDataUpdate = true;
        },
        [printSst.pending]: (state) => {
            state.sstLoading = true;
        },
        [printSst.rejected]: (state) => {
            state.sstLoading = false;
        },
        [printSst.fulfilled]: (state) => {
            state.sstLoading = false;
        },

    },
});
export const { setSstDataUpdate, setSstDetails } =
    sstDataSlice.actions;
export default sstDataSlice.reducer;
