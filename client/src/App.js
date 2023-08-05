import { BrowserRouter, Route, Routes } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "./style.css";

import EmployeeDirectory from "./components/Employee/EmployeeDirectory";
import UpcomingEmployee from "./components/Employee/UpcomingEmployee";
import EmployeeCreate from "./components/Employee/EmployeeCreate";
import EmployeeDetail from "./components/Employee/EmployeeDetail";
import EmployeeUpdate from "./components/Employee/EmployeeUpdate";

const App = () => {
  return (
    // add routing
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<EmployeeDirectory />} />
      </Routes>
      <Routes>
        <Route path="/employee/create" element={<EmployeeCreate />} />
      </Routes>
      <Routes>
        <Route
          path="/employee/upcoming/retirement"
          element={<UpcomingEmployee />}
        />
      </Routes>
      <Routes>
        <Route path="/employee/edit/:employeeId" element={<EmployeeUpdate />} />
      </Routes>
      <Routes>
        <Route
          path="/employee/detail/:employeeId"
          element={<EmployeeDetail />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
