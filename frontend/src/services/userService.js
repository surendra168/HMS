import axios from "axios";

export const getUser = () =>
  localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

export const login = async (email, password, isDoc) => {
  const path = isDoc ? "/doclogin" : "/login";
  const { data } = await axios.post(path, {
    email,
    password,
  });
  localStorage.setItem("user", JSON.stringify(data));
  return data;
};

export const register = async (registerData, isDoc) => {
  const path = isDoc ? "/registerDoctor" : "/registerPatient";
  const { data } = await axios.post(path, registerData);
  localStorage.setItem("user", JSON.stringify(data));
  return data;
};

export const changePassword = async (
  oldPassword,
  newPassword,
  email,
  isDoc
) => {
  const path = isDoc ? "/changePasswordDoc" : "/changePasswordPatient";
  const { data } = await axios.post(path, { email, oldPassword, newPassword });
  return data;
};

export const getHistoryPatient = async (email) => {
  const { data } = await axios.post("/getOneHistory", { email });
  return data;
};

export const getDocInfo = async () => {
  const { data } = await axios.post("/getDocInfo");
  return data;
};

export const attemptAppointment = async (apptData) => {
  const { data } = await axios.post("/attemptAppt", apptData);
  return data;
};

export const getDiagnosis = async (apptId) => {
  const { data } = await axios.get(`/getDiagnosis?apptId=${apptId}`);
  return data;
};

export const getDiagnosisPatient = async (email) => {
  const { data } = await axios.get(`/getOneDiagnosis?patEmail=${email}`);
  return data;
};

export const fillDiagnosis = async (diagData) => {
  const { data } = await axios.post("/fillDiagnosis", diagData);
  return data;
};

export const getApptListDoc = async (email) => {
  const { data } = await axios.get(`/getApptListDoc?docEmail=${email}`);
  return data;
};

export const getApptListPat = async (email) => {
  const { data } = await axios.get(`/getApptListPat?patEmail=${email}`);
  return data;
};

export const deleteAppointment = async (apptId) => {
  const { data } = await axios.post("/deleteAppt", { apptId });
  return data;
};

export const logout = () => {
  localStorage.removeItem("user");
};
