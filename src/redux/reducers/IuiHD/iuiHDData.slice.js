import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const initialState = {
    iuiHDDetails: {},
    iuiHDDataLoading: false,
    iIuiHDDataUpdate: false,
};


export const createIuiHDData = createAsyncThunk(
    "create-iuiHD-data",
    (props, { dispatch }) => {
        return new Promise((resolve, reject) => {
            const { locationId, id, moduleId, payload } = props;
            axios
                .post(
                    `iui-h-d/add-detail/${locationId}/${id}/${moduleId}`,
                    payload
                )
                .then((res) => {
                    if (res?.data?.err === 0) {
                        toast.success(res.data?.msg);
                        resolve(res?.data?.data);
                    }
                    else {
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

export const getIuiHDData = createAsyncThunk(
    "get-iuiHD-data",
    (props, { dispatch }) => {
        return new Promise((resolve, reject) => {
            const { location_id, patient_reg_id, module_id } = props;
            axios
                .post(
                    `iui-h-d/view/${location_id}/${patient_reg_id}/${module_id}`
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
)

export const editIuiHDData = createAsyncThunk(
    "edit-iuiHD-data",
    (props, { dispatch }) => {
        return new Promise((resolve, reject) => {
            const { location_id, _id, module_id, payload } = props;
            axios
                .patch(`iui-h-d/update/${location_id}/${_id}/${module_id}`, payload)
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

export const printIuiHDData = createAsyncThunk(
    "print-iuiHD-freezing",
    (props, { dispatch }) => {
        return new Promise((resolve, reject) => {
            const { module_id, patient_reg_id, location_id } = props;
            axios
                .post(`iui-h-d/print/${module_id}/${patient_reg_id}/${location_id}`)
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

export const iuiHDDataSlice = createSlice({
    name: "iuiHD-data-slice",
    initialState,
    reducers: {
        setIuiHDDataUpdate: (state, action) => {
            state.iIuiHDDataUpdate = action.payload;
        },
        setIuiHDDetails: (state, action) => {
            state.iuiHDDetails = action.payload;
        },
    },
    extraReducers: {
        [createIuiHDData.pending]: (state) => {
            state.iuiHDDetails = {};
            state.iIuiHDDataUpdate = false;
            state.iuiHDDataLoading = true;
        },
        [createIuiHDData.rejected]: (state) => {
            state.iuiHDDetails = {};
            state.iIuiHDDataUpdate = false;
            state.iuiHDDataLoading = false;
        },
        [createIuiHDData.fulfilled]: (state, action) => {
            state.iuiHDDetails = action.payload;
            state.iIuiHDDataUpdate = true;
            state.iuiHDDataLoading = false;
        },
        [getIuiHDData.pending]: (state) => {
            state.iuiHDDetails = {};
            state.iuiHDDataLoading = true;
        },
        [getIuiHDData.rejected]: (state) => {
            state.iuiHDDetails = {};
            state.iuiHDDataLoading = false;
        },
        [getIuiHDData.fulfilled]: (state, action) => {
            state.iuiHDDetails = action.payload;
            state.iuiHDDataLoading = false;
        },
        [editIuiHDData.pending]: (state) => {
            state.iuiHDDataLoading = true;
            state.iIuiHDDataUpdate = false;
        },
        [editIuiHDData.rejected]: (state) => {
            state.iuiHDDataLoading = false;
            state.iIuiHDDataUpdate = false;
        },
        [editIuiHDData.fulfilled]: (state) => {
            state.iuiHDDataLoading = false;
            state.iIuiHDDataUpdate = true;
        },
        [printIuiHDData.pending]: (state) => {
            state.iuiHDDataLoading = true;
        },
        [printIuiHDData.rejected]: (state) => {
            state.iuiHDDataLoading = false;
        },
        [printIuiHDData.fulfilled]: (state) => {
            state.iuiHDDataLoading = false;
        },
    },
});
export const { setIuiHDDetails, setIuiHDDataUpdate } =
    iuiHDDataSlice.actions;
export default iuiHDDataSlice.reducer;
