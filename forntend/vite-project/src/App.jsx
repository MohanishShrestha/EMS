import { useState } from "react";
import "./App.css";
import EmployeeDashboard from "./components/employee/EmployeeDashboard";
// import Login from "./components/Login";
// import Header from "./components/Header";
// import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
// import DashboardWidgets from "./components/DashboardWidgets";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      {/* <Login /> */}
      {/* <Sidebar />
      <Header /> */}
      <Dashboard />
      {/* <EmployeeDashboard /> */}
    </>
  );
}

export default App;
