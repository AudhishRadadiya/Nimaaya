import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const initialState = {
    sFreezingDetails: {},
    sFreezingLoading: false,
    sFreezingUpdate: false,
};

export const createSFreezingData = createAsyncThunk(
    "create-s-freezing-data",
    (props, { dispatch }) => {
        return new Promise((resolve, reject) => {
            const { locationId, id, moduleId, payload } = props;
            axios
                .post(
                    `semen-freezing/add-detail/${locationId}/${id}/${moduleId}`,
                    payload
                )
                .then((res) => {
                    if (res?.data?.err === 0) {
                        toast.success(res.data?.msg);
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

export const getSFreezingData = createAsyncThunk(
    "get-s-freezing-data",
    (props, { dispatch }) => {
        return new Promise((resolve, reject) => {
            const { location_id, patient_reg_id, module_id } = props;
            axios
                .post(
                    `semen-freezing/view/${location_id}/${patient_reg_id}/${module_id}`
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

export const editSFreezingData = createAsyncThunk(
    "edit-s-freezing-data",
    (props, { dispatch }) => {
        return new Promise((resolve, reject) => {
            const { location_id, _id, module_id, payload } = props;
            axios
                .patch(`semen-freezing/update/${location_id}/${_id}/${module_id}`, payload)
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

export const printSFreezing = createAsyncThunk(
    "print-s-freezing",
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



export const sFreezingDataSlice = createSlice({
    name: "s-freezing-data",
    initialState,
    reducers: {
        setSFreezingDataUpdate: (state, action) => {
            state.sFreezingUpdate = action.payload;
        },
        setSFreezingDetailsData: (state, action) => {
            state.sFreezingDetails = action.payload;
        },
    },
    extraReducers: {
        [createSFreezingData.pending]: (state) => {
            state.sFreezingDetails = {};
            state.sFreezingUpdate = false;
            state.sFreezingLoading = true;
        },
        [createSFreezingData.rejected]: (state) => {
            state.sFreezingDetails = {};
            state.sFreezingUpdate = false;
            state.sFreezingLoading = false;
        },
        [createSFreezingData.fulfilled]: (state, action) => {
            state.sFreezingDetails = action.payload;
            state.sFreezingUpdate = true;
            state.sFreezingLoading = false;
        },
        [getSFreezingData.pending]: (state) => {
            state.sFreezingDetails = {};
            state.sFreezingLoading = true;
        },
        [getSFreezingData.rejected]: (state) => {
            state.sFreezingDetails = {};
            state.sFreezingLoading = false;
        },
        [getSFreezingData.fulfilled]: (state, action) => {
            state.sFreezingDetails = action.payload;
            state.sFreezingLoading = false;
        },
        [editSFreezingData.pending]: (state) => {
            state.sFreezingLoading = true;
            state.sFreezingUpdate = false;
        },
        [editSFreezingData.rejected]: (state) => {
            state.sFreezingLoading = false;
            state.sFreezingUpdate = false;
        },
        [editSFreezingData.fulfilled]: (state) => {
            state.sFreezingLoading = false;
            state.sFreezingUpdate = true;
        },
        [printSFreezing.pending]: (state) => {
            state.sFreezingLoading = true;
        },
        [printSFreezing.rejected]: (state) => {
            state.sFreezingLoading = false;
        },
        [printSFreezing.fulfilled]: (state) => {
            state.sFreezingLoading = false;
        },
    },
});
export const { setSFreezingDataUpdate, setSFreezingDetailsData } =
    sFreezingDataSlice.actions;
export default sFreezingDataSlice.reducer;
