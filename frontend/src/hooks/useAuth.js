import { useState, createContext, useContext } from "react";
import * as userService from "../services/userService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(userService.getUser());

  const login = async (email, password, isDoc) => {
    try {
      const user = await userService.login(email, password, isDoc);
      setUser(user);
    } catch (err) {
      alert(err.response.data);
    }
  };

  const register = async (data, isDoc) => {
    try {
      const user = await userService.register(data, isDoc);
      setUser(user);
    } catch (err) {
      alert(err.response.data);
    }
  };

  const changePassword = async (oldPassword, newPassword, email, isDoc) => {
    try {
      const data = await userService.changePassword(
        oldPassword,
        newPassword,
        email,
        isDoc
      );
      alert(data.message);
    } catch (err) {
      alert(err.response.data);
    }
  };

  const logout = () => {
    userService.logout();
    setUser(null);
  };

  const getHistoryPatient = async (email) => {
    try {
      const data = await userService.getHistoryPatient(email);
      return data;
    } catch (err) {
      alert(err.response.data);
    }
  };

  const getDiagnosisPatient = async (email) => {
    try {
      const data = await userService.getDiagnosisPatient(email);
      return data;
    } catch (err) {
      alert(err.response.data);
    }
  };

  const getDocInfo = async () => {
    try {
      const data = await userService.getDocInfo();
      return data;
    } catch (err) {
      alert(err.response.data);
    }
  };

  const attemptAppointment = async (data) => {
    try {
      const result = await userService.attemptAppointment(data);
      alert(result.message);
      return result;
    } catch (err) {
      alert(err.response.data);
    }
  };

  const getDiagnosis = async (data) => {
    try {
      const result = await userService.getDiagnosis(data);
      return result;
    } catch (err) {
      alert(err.response.data);
    }
  };

  const fillDiagnosis = async (data) => {
    try {
      const result = await userService.fillDiagnosis(data);
      alert(result.message);
    } catch (err) {
      alert(err.response.data);
    }
  };

  const getApptListDoc = async (data) => {
    try {
      const result = await userService.getApptListDoc(data);
      return result;
    } catch (err) {
      alert(err.response.data);
    }
  };

  const getApptListPat = async (data) => {
    try {
      const result = await userService.getApptListPat(data);
      return result;
    } catch (err) {
      alert(err.response.data);
    }
  };

  const deleteAppointment = async (data) => {
    try {
      const result = await userService.deleteAppointment(data);
      alert(result.message);
    } catch (err) {
      alert(err.response.data);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        register,
        changePassword,
        getHistoryPatient,
        getDiagnosisPatient,
        getDocInfo,
        attemptAppointment,
        getDiagnosis,
        fillDiagnosis,
        getApptListDoc,
        getApptListPat,
        deleteAppointment,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
