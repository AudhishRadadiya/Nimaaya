import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getLocationData, setModuleList, setSelectedLocation } from 'redux/reducers/Role/role.slice';
import { logoutAction } from 'redux/reducers/auths.slice';
import { useNavigate } from 'react-router-dom';
import { getAuthToken, getSelectedLocationData } from 'Helper/AuthTokenHelper';
import { socket } from 'app';
export const sendDataToSocket = (en, data) => {
  var sendData = {
    en: en,
    data: data
  };
  socket.emit("req", sendData)
}

export const socketDataSend = () => {
  const userData = getAuthToken();
  const userLocation = getSelectedLocationData();
  if (userData && userLocation) {
    sendDataToSocket("JU",
      {
        user_id: userData?._id
      })
    sendDataToSocket("JUR",
      {
        room_id: userLocation
      })
  }
}

export const checkSocketConnection = () => {
  return socket && socket.connected ? true : false
};


const SocketComponent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    socket.on('res', (data) => {
      if (data.en === "PERMISSION" && data?.data?.length > 0) {
        dispatch(setModuleList(data?.data))
      }
      else if (data.en ===
        "LOCATION"
        && Object.keys(data?.data)?.length === 0) {
        dispatch(getLocationData());
      }
      else if (data.en === "PERMISSION" && data?.data?.length === 0) {
        localStorage.clear()
        dispatch(setSelectedLocation(''))
        dispatch(logoutAction());
        dispatch(setModuleList([]));
        navigate("/login");
      }
    })
  }, []);

  return (
    <></>
  )
}

export default SocketComponent
