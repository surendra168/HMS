import React from "react";
import { Route, Routes } from "react-router-dom";
import DocHome from "./pages/DocHome/DocHome";
import PatientHome from "./pages/PatientHome/PatientHome";
import Login from "./pages/LoginPage/Login";
import RegisterDoctor from "./pages/RegisterDoctor/RegisterDoctor";
import RegisterPatient from "./pages/RegisterPatient/RegisterPatient";
import Settings from "./pages/Settings/Settings";
import ViewOneHist from "./pages/ViewOneHist/ViewOneHist";
import ScheduleAppt from "./pages/ScheduleAppt/ScheduleAppt";
import Diagnose from "./pages/Diagnose/Diagnose";
import DoctorViewAppt from "./pages/DoctorViewAppt/DoctorViewAppt";
import PatientViewAppt from "./pages/PatientViewAppt/PatientViewAppt";
import ViewDiagnosis from "./pages/ViewDiagnosis/ViewDiagnosis";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/docHome" element={<DocHome />} />
      <Route path="/patientHome" element={<PatientHome />} />
      <Route path="/registerDoc" element={<RegisterDoctor />} />
      <Route path="/registerPatient" element={<RegisterPatient />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/viewMedicHistory" element={<ViewOneHist />} />
      <Route path="/scheduleAppt" element={<ScheduleAppt />} />
      <Route path="/diagnosis/:appointmentId" element={<Diagnose />} />
      <Route path="/viewDiagnosis/:appointmentId" element={<ViewDiagnosis />} />
      <Route path="/docViewAppt" element={<DoctorViewAppt />} />
      <Route path="/patientsViewAppt" element={<PatientViewAppt />} />
      <Route path="/" element={<Login />} />
    </Routes>
  );
}
