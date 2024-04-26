import axios from 'axios';
import { toast } from 'react-toastify';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { saveToken } from 'Helper/AuthTokenHelper';

const initialState = {
  authLoading: false,
  isUserSignup: false,
  isUserLogin: false,
  isUserLogout: false,
  isResetViaEmail: false,
  isResetViaSMS: false,
  isVerifyOTP: false,
  isResetPassword: false,
  isResetPasswordLoading: true,
  isValidToken: false,
  isSetPassword: false,
  isSetPasswordLoading: false,
};

export const signupAction = createAsyncThunk(
  'auth/signup',
  (dataProp, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .post('user/registration', dataProp)
        .then(res => {
          if (res?.data?.err === 0) {
            resolve(res.data?.data);
            toast.success(res.data?.msg);
          } else {
            toast.error(res?.data?.msg);
            reject({ message: res?.data?.msg });
          }
        })
        .catch(error => {
          toast.error(error?.response?.data?.msg);
          reject(error);
        });
    });
  },
);

export const loginAction = createAsyncThunk(
  'auth/login',
  (dataProp, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .post('user/login', dataProp)
        .then(res => {
          if (res?.data?.err === 0) {
            resolve(res.data?.data);
            dispatch(setIsLogin(true));
            dispatch(saveToken(res.data?.data));
            toast.success(res.data?.msg);
          } else {
            toast.error(res?.data?.msg);
            reject({ message: res?.data?.msg });
          }
        })
        .catch(error => {
          toast.error(error?.response?.data?.msg);
          reject(error);
        });
    });
  },
);

export const resetViaEmail = createAsyncThunk(
  'auth/reset-via-email',
  (dataProp, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .post('user/forgot-password', dataProp)
        .then(res => {
          if (res?.data?.err === 0) {
            resolve(res.data?.data);
            toast.success(res.data?.msg);
          } else {
            toast.error(res?.data?.msg);
            reject({ message: res?.data?.msg });
          }
        })
        .catch(error => {
          toast.error(error?.response?.data?.msg);
          reject(error);
        });
    });
  },
);

export const resetViaSMS = createAsyncThunk(
  'auth/reset-via-sms',
  (dataProp, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .post('user/forgot-password', dataProp)
        .then(res => {
          if (res?.data?.err === 0) {
            resolve(res.data?.data);
            toast.success(res.data?.msg);
          } else {
            toast.error(res?.data?.msg);
            reject({ message: res?.data?.msg });
          }
        })
        .catch(error => {
          toast.error(error?.response?.data?.msg);
          reject(error);
        });
    });
  },
);

export const verifyOTP = createAsyncThunk(
  'auth/verify-OTP',
  (dataProp, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .post('user/verify-otp', dataProp)
        .then(res => {
          if (res?.data?.err === 0) {
            resolve(res.data?.data);
            toast.success(res.data?.msg);
          } else {
            toast.error(res?.data?.msg);
            reject({ message: res?.data?.msg });
          }
        })
        .catch(error => {
          toast.error(error?.response?.data?.msg);
          reject(error);
        });
    });
  },
);
export const verifyToken = createAsyncThunk(
  'auth/verify-token',
  (dataProp, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .get(`user/set-password/token-valid/${dataProp}`)
        .then(res => {
          if (res?.data?.err === 0) {
            resolve({ tokenValidate: true });
            toast.success(res.data?.msg);
          } else {
            toast.error(res?.data?.msg);
            reject({ tokenValidate: false });
          }
        })
        .catch(error => {
          toast.error(error?.response?.data?.msg);
          reject(error);
        });
    });
  },
);

export const setPassword = createAsyncThunk(
  'auth/set-password',
  (dataProp, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .post('user/set-password', dataProp)
        .then(res => {
          if (res?.data?.err === 0) {
            resolve(res.data?.data);
            toast.success(res.data?.msg);
          } else {
            toast.error(res?.data?.msg);
            reject({ message: res?.data?.msg });
          }
        })
        .catch(error => {
          toast.error(error?.response?.data?.msg);
          reject(error);
        });
    });
  },
);
export const resetPassword = createAsyncThunk(
  'auth/reset-password',
  (dataProp, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .post('user/reset-password', dataProp)
        .then(res => {
          if (res?.data?.err === 0) {
            resolve(res.data?.data);
            toast.success(res.data?.msg);
          } else {
            toast.error(res?.data?.msg);
            reject({ message: res?.data?.msg });
          }
        })
        .catch(error => {
          toast.error(error?.response?.data?.msg);
          reject(error);
        });
    });
  },
);

export const logoutAction = createAsyncThunk(
  'auth/logout',
  (dataProp, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .get('user/logout')
        .then(res => {
          if (res?.data?.err === 0) {
            resolve(res?.data?.data);
            toast.success(res?.data?.msg);
          } else {
            toast.error(res?.data?.msg);
            reject({ message: res?.data?.msg });
          }
        })
        .catch(error => {
          toast.error(error?.response?.data?.msg);
          reject(error);
        });
    });
  },
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setIsSignup: (state, action) => {
      state.isUserSignup = action.payload;
    },
    setAuthLoading: (state, action) => {
      state.authLoading = action.payload;
    },
    setIsSetPassword: (state, action) => {
      state.isSetPassword = action.payload;
    },
    setIsLogin: (state, action) => {
      state.isUserLogin = action.payload;
    },
    setIsLogout: (state, action) => {
      state.isUserLogout = action.payload;
    },
    setIsResetViaEmail: (state, action) => {
      state.isResetViaEmail = action.payload;
    },
    setIsResetViaSMS: (state, action) => {
      state.isResetViaSMS = action.payload;
    },
    setIsVerifyOTP: (state, action) => {
      state.isVerifyOTP = action.payload;
    },
    setIsResetPassword: (state, action) => {
      state.isResetPassword = action.payload;
    },
  },
  extraReducers: {
    [signupAction.pending]: state => {
      state.isUserSignup = false;
      state.authLoading = true;
    },
    [signupAction.rejected]: state => {
      state.isUserSignup = false;
      state.authLoading = false;
    },
    [signupAction.fulfilled]: (state, action) => {
      state.authLoading = false;
      state.isUserSignup = true;
    },
    [loginAction.pending]: state => {
      state.isUserLogin = false;
      state.authLoading = true;
    },
    [loginAction.rejected]: state => {
      state.isUserLogin = false;
      state.authLoading = false;
    },
    [loginAction.fulfilled]: (state, action) => {
      state.isUserLogin = true;
      state.authLoading = false;
    },
    [resetViaEmail.pending]: state => {
      state.isResetViaEmail = false;
      state.authLoading = true;
    },
    [resetViaEmail.rejected]: state => {
      state.isResetViaEmail = false;
      state.authLoading = false;
    },
    [resetViaEmail.fulfilled]: (state, action) => {
      state.authLoading = false;
      state.isResetViaEmail = true;
    },
    [resetViaSMS.pending]: state => {
      state.isResetViaSMS = false;
      state.authLoading = true;
    },
    [resetViaSMS.rejected]: state => {
      state.isResetViaSMS = false;
      state.authLoading = false;
    },
    [resetViaSMS.fulfilled]: (state, action) => {
      state.authLoading = false;
      state.isResetViaSMS = true;
    },
    [verifyOTP.pending]: state => {
      state.isVerifyOTP = false;
      state.authLoading = true;
    },
    [verifyOTP.rejected]: state => {
      state.isVerifyOTP = false;
      state.authLoading = false;
    },
    [verifyOTP.fulfilled]: (state, action) => {
      state.authLoading = false;
      state.isVerifyOTP = true;
    },
    [verifyToken.pending]: state => {
      state.isValidToken = false;
      state.isResetPasswordLoading = true;
    },
    [verifyToken.rejected]: state => {
      state.isValidToken = false;
      state.isResetPasswordLoading = false;
    },
    [verifyToken.fulfilled]: (state, action) => {
      state.isValidToken = true;
      state.isResetPasswordLoading = false;
    },
    [setPassword.pending]: state => {
      state.isSetPassword = false
      state.isSetPasswordLoading = true
    },
    [setPassword.rejected]: state => {
      state.isSetPassword = false
      state.isSetPasswordLoading = false
    },
    [setPassword.fulfilled]: (state, action) => {
      state.isSetPassword = true;
      state.isSetPasswordLoading = false;
    },
    [resetPassword.pending]: state => {
      state.isResetPassword = false;
      state.authLoading = true;
    },
    [resetPassword.rejected]: state => {
      state.isResetPassword = false;
      state.authLoading = false;
    },
    [resetPassword.fulfilled]: (state, action) => {
      state.authLoading = false;
      state.isResetPassword = true;
    },
    [logoutAction.pending]: state => {
      state.isUserLogout = false;
      state.authLoading = true;
    },
    [logoutAction.rejected]: state => {
      state.isUserLogout = false;
      state.authLoading = false;
    },
    [logoutAction.fulfilled]: (state, action) => {
      state.isUserLogout = true;
      state.authLoading = false;
    },
  },
});

export const {
  setAuthLoading,
  setIsSignup,
  setIsLogin,
  setIsResetViaEmail,
  setIsResetViaSMS,
  setIsVerifyOTP,
  setIsResetPassword,
  setIsLogout,
  setIsSetPassword
} = authSlice.actions;

export default authSlice.reducer;
