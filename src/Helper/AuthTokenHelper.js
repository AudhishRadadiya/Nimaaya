import axios from "axios";

export const saveToken = (user_data) => {
  const settings = {
    ...user_data,
  };
  setAuthToken(user_data?.token);
  localStorage.setItem(
    "UserPreferences",
    window.btoa(JSON.stringify(settings))
  );
};
export const setAuthToken = (access_Token) => {
  try {
    axios.defaults.headers.common["Authorization"] = `Bearer ` + access_Token;
  } catch (e) {
    console.log("Error while setup token", e);
  }
};

export const getAuthToken = () => {
  let userPreferences = localStorage.getItem("UserPreferences");
  if (userPreferences) {
    try {
      const decodedPreferences = JSON.parse(window.atob(userPreferences));
      return decodedPreferences;
    } catch (error) {
      console.error("Error parsing user preferences:", error);
    }
  }
};

export const getSelectedLocationData = () => {
  let userSelectedLocation = localStorage.getItem("userLocation");
  if (userSelectedLocation) {
    try {
      const decodedPreferences = JSON.parse(window.atob(userSelectedLocation));
      return decodedPreferences;
    } catch (error) {
      console.error("Error parsing user preferences:", error);
    }
  }
};

export const clearToken = () => {
  localStorage.removeItem("UserPreferences");
  localStorage.removeItem("userLocation");
  clearAuthToken();
};

const clearAuthToken = () => {
  delete axios.defaults.headers.common["Authorization"];
};
