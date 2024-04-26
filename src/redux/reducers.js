import { combineReducers } from "@reduxjs/toolkit";

import auth from "./reducers/auths.slice";
import role from "./reducers/Role/role.slice";
import patientRegistration from "./reducers/PatientRegistration/patientRegistration.slice";
import patientBasicHistory from "./reducers/PatientBasicHistory/patientBasicHistory.slice";
import globalSearch from "./reducers/SearchPanel/globalSearch.slice";
import uploadImage from "./reducers/UploadImage/uploadImage.slice";
import patientExtendedHistory from "./reducers/PatientExtendedHistory/patientExtendedHistory.slice";
import maleInfertilityInvestigation from "./reducers/MaleInfertilityInvestigation/maleInfertilityInvestigation.slice";
import common from "./reducers/common.slice";
import ivfFlowSheet from "./reducers/IVFFlowSheet/IvfFlowSheet.slice";
import femaleInfertility from "../redux/reducers/FemaleInfertility/FemaleInfertility.slice";
import lutealPhase from "./reducers/LutealPhase/lutealPhase.slice";
import cycleOutcome from "./reducers/CycleOutCome/cycleOutCome.slice";
import finalOutcome from "./reducers/FinalOutCome/finalOutCome.slice";
import embryologyData from "./reducers/EmbryologyData/embryologyData.slice";
import dischargeCard from "./reducers/DischargeCard/dischargeCard.slice";
import tesaPesaDischargeCard from "./reducers/TesaPesaDischargeCard/tesaPesaDischargeCard.slice";
import pgsDischargeCard from "./reducers/PgsDischargeCard/pgsDischargeCard.slice";
import addDocument from "./reducers/AddDocument/addDocument.slice";
import semenAnalysisDataStore from "./reducers/SemenAnalysis/semenAnalysisData.slice";
import sFreezingDataStore from "./reducers/SFreezing/sFreezingData.slice";
import dnaDataStore from "./reducers/Dna/dnaData.slice";
import iuiHDDataStore from "./reducers/IuiHD/iuiHDData.slice";
import sstDataStore from "./reducers/Sst/sstData.slice";
import iuiReportDataStore from "./reducers/IuiReport/IuiReportData.slice";

export function createReducer(injectedReducers) {
  return combineReducers({
    ...injectedReducers,
    auth,
    role,
    patientRegistration,
    patientBasicHistory,
    patientExtendedHistory,
    maleInfertilityInvestigation,
    ivfFlowSheet,
    globalSearch,
    uploadImage,
    common,
    femaleInfertility,
    lutealPhase,
    cycleOutcome,
    finalOutcome,
    embryologyData,
    dischargeCard,
    tesaPesaDischargeCard,
    pgsDischargeCard,
    addDocument,
    semenAnalysisDataStore,
    sFreezingDataStore,
    dnaDataStore,
    iuiHDDataStore,
    sstDataStore,
    iuiReportDataStore
  });
}
