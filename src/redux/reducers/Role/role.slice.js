import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const initialState = {
  userList: [],
  seniorConsultantUserList: [],
  moduleList: [],
  userLoading: false,
  typeWiseUserLoading: false,
  isUserCreated: false,
  isUserUpdated: false,
  userDetail: {},
  userType: "",
  totolOfUser: 0,
  isLocationUpdated: false,
  isLocationLoading: false,
  permissionLocationWiseLoading: false,
  locationData: [],
  selectedLocation: "",
  selectedModule: ""

};

export const getTypeWiseUserListData = createAsyncThunk(
  "admin/get-type-wise-user-list",
  (data, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .post(`user/list/${null}/${null}`, data)
        .then((res) => {
          if (res?.data?.err === 0) {
            if (res.data?.data?.users?.length > 0) {
              resolve(res.data.data);
            } else {
              resolve([]);
            }
          } else {
            reject([]);
            // toast.error(res.data.msg);
          }
        })
        .catch((error) => {
          toast.error(error?.response?.data?.msg);
          reject(error);
        });
    });
  }
);

export const getUserListData = createAsyncThunk(
  "admin/get-user-list",
  (props, { dispatch }) => {
    return new Promise((resolve, reject) => {
      const { start, limit } = props;
      const obj = props?.locationId
        ? props.locationId !== "all"
          ? { location_id: props.locationId }
          : {}
        : {};
      axios
        .post(
          `user/list/${start}/${limit}`,
          Object.keys(obj)?.length > 0 && obj
        )
        .then((res) => {
          if (res?.data?.err === 0) {
            if (res.data?.data?.users?.length > 0) {
              resolve(res.data.data);
            } else {
              resolve([]);
            }
          } else {
            reject([]);
            toast.error(res?.data?.msg);
          }
        })
        .catch((error) => {
          toast.error(error?.response?.data?.msg);
          reject(error);
        });
    });
  }
);

export const getModuleListData = createAsyncThunk(
  "admin/get-module-list-data",
  (user, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .get("module/list")
        .then((res) => {
          if (res.data.err === 0) {
            if (res.data.data.length > 0) {
              // localStorage.setItem('module', JSON.stringify(res.data.data));
              resolve(res.data.data);
            } else {
              resolve([]);
            }
          } else {
            reject([]);
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

export const createUser = createAsyncThunk(
  "admin/create-user",
  (user, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .post("user/add-member", user)
        .then((res) => {
          if (res?.data?.err === 0) {
            toast.success(res.data?.msg);
            resolve(res.data?.data);
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

export const viewUser = createAsyncThunk(
  "admin/view-user",
  (props, { dispatch }) => {
    const { id, userLocation } = props;
    return new Promise((resolve, reject) => {
      axios
        .get(`user/view/${id}/${userLocation}`)
        .then((res) => {
          if (res?.data?.err === 0) {
            resolve(res.data?.data);
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

export const updateUser = createAsyncThunk(
  "admin/update-user",
  (props, { dispatch }) => {
    return new Promise((resolve, reject) => {
      const { id, user } = props;
      axios
        .patch(`user/update/${id}`, user)
        .then((res) => {
          if (res?.data?.err === 0) {
            toast.success(res.data?.msg);
            resolve(res.data?.data);
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
export const createLocation = createAsyncThunk(
  "admin/create-location",
  (user, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .post("/location/add", user)
        .then((res) => {
          dispatch(setIsLocationUpdated(true));
          if (res?.data?.err === 0) {
            toast.success(res.data?.msg);
            resolve(res.data?.data);
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
export const updateLocation = createAsyncThunk(
  "admin/update-location",
  (user, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .patch("/location/update", user)
        .then((res) => {
          dispatch(setIsLocationUpdated(true));
          if (res?.data?.err === 0) {
            toast.success(res.data?.msg);
            resolve(res.data?.data);
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
export const getLocationData = createAsyncThunk(
  "admin/get-location",
  (props, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .get("/location/list")
        .then((res) => {
          if (res?.data?.err === 0) {
            resolve(res.data.data);
          } else {
            reject([]);
          }
        })
        .catch((error) => {
          toast.error(error?.response?.data?.msg);
          reject(error);
        });
    });
  }
);
export const getPermissionLocationWise = createAsyncThunk(
  "admin/get-permission-location-wise",
  (locationId, { dispatch }) => {
    return new Promise((resolve, reject) => {
      axios
        .get(`user/permission/${locationId}`)
        .then((res) => {
          if (res?.data?.err === 0) {
            resolve(res?.data?.data);
          } else {
            reject([]);
          }
        })
        .catch((error) => {
          toast.error(error?.response?.data?.msg);
          reject(error);
        });
    });
  }
);

export const roleSlice = createSlice({
  name: "role",
  initialState,
  reducers: {
    setIsUserCreated: (state, action) => {
      state.isUserCreated = action.payload;
    },
    setIsUserUpdated: (state, action) => {
      state.isUserUpdated = action.payload;
    },
    setUserDetail: (state, action) => {
      state.userDetail = action.payload;
    },
    setTotolOfUser: (state, action) => {
      state.totolOfUser = action.payload;
    },
    setIsLocationUpdated: (state, action) => {
      state.isLocationUpdated = action.payload;
    },
    setLocationData: (state, action) => {
      state.locationData = action.payload;
    },
    setSelectedLocation: (state, action) => {
      state.selectedLocation = action.payload;
    },
    setSelectedModule: (state, action) => {
      state.selectedModule = action.payload;
    },
    setUserList: (state, action) => {
      state.userList = action.payload;
    },
    setModuleList: (state, action) => {
      state.moduleList = action.payload;
    },

  },
  extraReducers: {
    [getUserListData.pending]: (state) => {
      state.userList = [];
      state.userLoading = true;
    },
    [getUserListData.rejected]: (state) => {
      state.userList = [];
      state.userLoading = false;
    },
    [getUserListData.fulfilled]: (state, action) => {
      let userListData = [];
      let userListTotal = 0;
      if (action.payload?.users?.length > 0) {
        userListData = action.payload.users;
        userListTotal = action.payload.total_users;
      }
      state.userList = userListData;
      state.totolOfUser = userListTotal;
      state.userLoading = false;
    },
    [getTypeWiseUserListData.pending]: (state) => {
      state.seniorConsultantUserList = [];
      state.typeWiseUserLoading = true;
    },
    [getTypeWiseUserListData.rejected]: (state) => {
      state.seniorConsultantUserList = [];
      state.typeWiseUserLoading = false;
    },
    [getTypeWiseUserListData.fulfilled]: (state, action) => {
      state.seniorConsultantUserList = action.payload.users;
      state.typeWiseUserLoading = false;
    },
    [getModuleListData.pending]: (state) => {
      state.moduleList = [];
      state.userLoading = true;
    },
    [getModuleListData.rejected]: (state) => {
      state.moduleList = [];
      state.userLoading = false;
    },
    [getModuleListData.fulfilled]: (state, action) => {
      state.moduleList = action.payload;
      state.userLoading = false;
    },
    [getPermissionLocationWise.pending]: (state) => {
      state.moduleList = [];
      state.permissionLocationWiseLoading = true;
    },
    [getPermissionLocationWise.rejected]: (state) => {
      state.moduleList = [];
      state.permissionLocationWiseLoading = false;
    },
    [getPermissionLocationWise.fulfilled]: (state, action) => {
      state.moduleList = action.payload;
      state.permissionLocationWiseLoading = false;
    },
    [getLocationData.pending]: (state) => {
      state.locationData = [];
      state.isLocationLoading = true;
    },
    [getLocationData.rejected]: (state) => {
      state.locationData = [];
      state.isLocationLoading = false;
    },
    [getLocationData.fulfilled]: (state, action) => {
      let locationList = [...action.payload] || [];
      locationList = locationList?.map((location, indx) => {
        return { ...location, srNo: ++indx };
      });
      state.locationData = locationList || [];
      state.userType =
        action?.payload?.length > 0
          ? action.payload[0]?.user_type
            ? action.payload[0].user_type
            : ""
          : "";
      state.isLocationLoading = false;
    },
    [createLocation.pending]: (state) => {
      state.isLocationLoading = true;
    },
    [createLocation.rejected]: (state) => {
      state.isLocationLoading = false;
    },
    [createLocation.fulfilled]: (state, action) => {
      state.isLocationUpdated = true;
      state.isLocationLoading = false;
    },
    [updateLocation.pending]: (state) => {
      state.isLocationLoading = true;
    },
    [updateLocation.rejected]: (state) => {
      state.isLocationLoading = false;
    },
    [updateLocation.fulfilled]: (state, action) => {
      state.isLocationUpdated = true;
      state.isLocationLoading = false;
    },
    [createUser.pending]: (state) => {
      state.isUserCreated = false;
      state.userLoading = true;
    },
    [createUser.rejected]: (state) => {
      state.isUserCreated = false;
      state.userLoading = false;
    },
    [createUser.fulfilled]: (state) => {
      state.isUserCreated = true;
      state.userLoading = false;
    },
    [updateUser.pending]: (state) => {
      state.isUserUpdated = false;
      state.userLoading = true;
    },
    [updateUser.rejected]: (state) => {
      state.isUserUpdated = false;
      state.userLoading = false;
    },
    [updateUser.fulfilled]: (state) => {
      state.isUserUpdated = true;
      state.userLoading = false;
    },
    [viewUser.pending]: (state) => {
      state.userDetail = {};
      state.userLoading = true;
    },
    [viewUser.rejected]: (state) => {
      state.userDetail = {};
      state.userLoading = false;
    },
    [viewUser.fulfilled]: (state, action) => {
      state.userDetail = action.payload || {};
      state.userLoading = false;
    },
  },
});

export const {
  setIsUserCreated,
  setIsUserUpdated,
  setUserDetail,
  setTotolOfUser,
  setIsLocationUpdated,
  setLocationData,
  setSelectedLocation,
  setSelectedModule,
  setUserList,
  setModuleList,
} = roleSlice.actions;

export default roleSlice.reducer;
