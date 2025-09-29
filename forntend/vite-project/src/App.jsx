import { createContext, useState } from "react";
import "./App.css";
import EmployeeDashboard from "./components/employee/EmployeeDashboard";
import Login from "./components/Login";
// import Header from "./components/Header";
// import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import Project from "./project";
// import DashboardWidgets from "./components/DashboardWidgets";

export let GlobalVariableContext = createContext();

function App() {
  const [count, setCount] = useState(0);
  let [token, setToken] = useState(localStorage.getItem("token"));

  return (
    <>
      <GlobalVariableContext.Provider
        value={{ token: token, setToken: setToken }}
      >
        <Project />
        {/* <EmployeeDashboard/> */}
        
      </GlobalVariableContext.Provider>
    </>
  );
}

export default App;
