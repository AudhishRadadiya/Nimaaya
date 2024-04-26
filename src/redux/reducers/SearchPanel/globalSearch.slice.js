import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

const initialState = {
  globalSearchData: [],
  globalSearchLoading: false,
  globalSearchFileValue: {},
};
export const getGlobalSearch = createAsyncThunk(
  'admin/get-global-search-data',
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

export const globalSearchSlice = createSlice({
  name: 'globalSearch',
  initialState,
  reducers: {
    clearData: state => {
      return initialState;
    },
    setGlobalSearchFileValue: (state, action) => {
      state.globalSearchFileValue = action.payload;
    },
  },
  extraReducers: {
    [getGlobalSearch.pending]: state => {
      state.globalSearchLoading = true;
    },
    [getGlobalSearch.rejected]: state => {
      state.globalSearchData = [];
      state.globalSearchLoading = false;
    },
    [getGlobalSearch.fulfilled]: (state, action) => {
      state.globalSearchData = action.payload;
      state.globalSearchLoading = false;
    },
  },
});

export const { clearData, setGlobalSearchFileValue } = globalSearchSlice.actions;

export default globalSearchSlice.reducer;
