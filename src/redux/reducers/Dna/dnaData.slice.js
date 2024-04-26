import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const initialState = {
    dnaDetails: {},
    dnaDataLoading: false,
    dnaDataUpdate: false,
};

export const createDna = createAsyncThunk(
    "create-dna-data",
    (props, { dispatch }) => {
        return new Promise((resolve, reject) => {
            const { location_id, patient_reg_id, module_id, payload } = props;
            axios
                .post(
                    `/dna/add-detail/${location_id}/${patient_reg_id}/${module_id}`,
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

export const getDnaData = createAsyncThunk(
    "get-dna-data",
    (props, { dispatch }) => {
        return new Promise((resolve, reject) => {
            const { location_id, patient_reg_id, module_id } = props;
            axios
                .post(
                    `dna/view/${location_id}/${patient_reg_id}/${module_id}`
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

export const printDna = createAsyncThunk(
    "print-dna",
    (props, { dispatch }) => {
        return new Promise((resolve, reject) => {
            const { module_id, patient_reg_id, location_id } = props;
            axios
                .post(`dna/print/${module_id}/${patient_reg_id}/${location_id}`)
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

export const editDnaData = createAsyncThunk(
    "edit-dna-data",
    (props, { dispatch }) => {
        return new Promise((resolve, reject) => {
            const { location_id, _id, module_id, payload } = props;
            axios
                .patch(`dna/update/${location_id}/${_id}/${module_id}`, payload)
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
            const { location_id, patient_reg_id, module_id } = props;
            axios
                .post(`dna/update/${location_id}/${patient_reg_id}/${module_id}`, props)
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

export const dnaDataSlice = createSlice({
    name: "dna-data",
    initialState,
    reducers: {
        setDnaDataUpdate: (state, action) => {
            state.dnaDataUpdate = action.payload;
        },
        setDnaDetails: (state, action) => {
            state.dnaDetails = action.payload;
        },
    },
    extraReducers: {
        [createDna.pending]: (state) => {
            state.dnaDetails = {};
            state.dnaDataUpdate = false;
            state.dnaDataLoading = true;
        },
        [createDna.rejected]: (state) => {
            state.dnaDetails = {};
            state.dnaDataUpdate = false;
            state.dnaDataLoading = false;
        },
        [createDna.fulfilled]: (state, action) => {
            state.dnaDetails = action.payload;
            state.dnaDataUpdate = true;
            state.dnaDataLoading = false;
        },
        [getDnaData.pending]: (state) => {
            state.dnaDetails = {};
            state.dnaDataLoading = true;
        },
        [getDnaData.rejected]: (state) => {
            state.dnaDetails = {};
            state.dnaDataLoading = false;
        },
        [getDnaData.fulfilled]: (state, action) => {
            state.dnaDetails = action.payload;
            state.dnaDataLoading = false;
        },
        [editDnaData.pending]: (state) => {
            state.dnaDataLoading = true;
            state.dnaDataUpdate = false;
        },
        [editDnaData.rejected]: (state) => {
            state.dnaDataLoading = false;
            state.dnaDataUpdate = false;
        },
        [editDnaData.fulfilled]: (state) => {
            state.dnaDataLoading = false;
            state.dnaDataUpdate = true;
        },
        [printDna.pending]: (state) => {
            state.dnaDataLoading = true;
        },
        [printDna.rejected]: (state) => {
            state.dnaDataLoading = false;
        },
        [printDna.fulfilled]: (state) => {
            state.dnaDataLoading = false;
        },

    },
});
export const { setDnaDataUpdate, setDnaDetails } =
    dnaDataSlice.actions;
export default dnaDataSlice.reducer;
