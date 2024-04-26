import { useCallback, useEffect, useMemo } from "react";
import {
  getPatientBasicHistoryData,
  setPatientBasicHistoryDetail,
} from "redux/reducers/PatientBasicHistory/patientBasicHistory.slice";
import { useDispatch, useSelector } from "react-redux";
import PatientBasicInformation from "./PatientBasicInformation";
import DonorMalePatientHistory from "./DonorMalePatientHistory";
import DonorFemalePatientHistory from "./DonorFemalePatientHistory";
import { useLocation } from "react-router-dom";
import { getGlobalSearch } from "redux/reducers/SearchPanel/globalSearch.slice";
import { setSelectedPatient } from "redux/reducers/common.slice";

export default function PatientBasicHistory() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { patientBasicHistoryDetail, isPatientBasicCreated } = useSelector(
    ({ patientBasicHistory }) => patientBasicHistory
  );
  const { selectedPatient } = useSelector(({ common }) => common);
  const { moduleList, selectedLocation, userType } = useSelector(
    ({ role }) => role
  );
  const moduleDetail = useMemo(() => {
    const moduleDetails =
      moduleList?.find((item) => item?.module_name === location.pathname) || {};
    return moduleDetails;
  }, [moduleList, location]);

  useEffect(() => {
    if (moduleDetail?._id && selectedPatient?._id) {
      dispatch(
        getPatientBasicHistoryData({
          locationId: selectedLocation,
          patientRegId: selectedPatient._id,
          moduleId: moduleDetail._id,
        })
      );
    }
    return () => {
      dispatch(setPatientBasicHistoryDetail({}));
    };
  }, [dispatch, selectedPatient]);
  const getNewSelectedPatientData = useCallback(async () => {
    if (
      isPatientBasicCreated &&
      Object.keys(selectedPatient)?.length > 0 &&
      Object.keys(patientBasicHistoryDetail)?.length === 0
    ) {
      const { payload } = await dispatch(
        getGlobalSearch({
          patient_reg_id: selectedPatient._id,
          patient_name: selectedPatient.patient_full_name,
          location_id: selectedLocation,
        })
      );
      if (payload.length > 0) dispatch(setSelectedPatient(payload[0]));
    }
  }, [
    dispatch,
    selectedLocation,
    isPatientBasicCreated,
    patientBasicHistoryDetail,
    selectedPatient,
  ]);
  useEffect(() => {
    getNewSelectedPatientData();
  }, [isPatientBasicCreated]);
  return (
    <>
      {selectedPatient?.type_of_patient === 3 ? (
        <DonorMalePatientHistory
          userType={userType}
          locationId={selectedLocation}
          selectedPatient={selectedPatient}
          moduleDetail={moduleDetail}
          patientBasicHistoryDetail={patientBasicHistoryDetail}
          isPatientBasicCreated={isPatientBasicCreated}
        />
      ) : selectedPatient?.type_of_patient === 4 ? (
        <DonorFemalePatientHistory
          userType={userType}
          locationId={selectedLocation}
          selectedPatient={selectedPatient}
          moduleDetail={moduleDetail}
          patientBasicHistoryDetail={patientBasicHistoryDetail}
          isPatientBasicCreated={isPatientBasicCreated}
        />
      ) : (
        <PatientBasicInformation
          userType={userType}
          locationId={selectedLocation}
          selectedPatient={selectedPatient}
          moduleDetail={moduleDetail}
          patientBasicHistoryDetail={patientBasicHistoryDetail}
          isPatientBasicCreated={isPatientBasicCreated}
        />
      )}
    </>
  );
}
