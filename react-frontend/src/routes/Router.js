import React from "react";
import { Routes, Route} from "react-router-dom";
import BusPage from "../pages/BusPage";
import DriverPage from "../pages/DriverPage";
import PassengerPage from "../pages/PassengerPage";
import RoutePage from "../pages/RoutePage";
import SchedulePage from "../pages/SchedulePage";
import Dashboard from "../pages/DashBoard";
import SignUpPage from "../pages/SignUpPage";
import Login from "../components/Login/Login";
import BusPass from "../pages/BusPass";

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Login/>} />
      <Route path="/signup" element={<SignUpPage/>} />
      <Route path="/home" element={<Dashboard/>} />
      <Route path="/bus" element={<BusPage/>} />
      <Route path="/driver" element={<DriverPage/>} />
      <Route path="/passenger" element={<PassengerPage/>} />
      <Route path="/route" element={<RoutePage/>} />
      <Route path="/schedule" element={<SchedulePage/>} />
      <Route path="/buspass" element={<BusPass/>} />
    </Routes>
  );
};

export default Router;
