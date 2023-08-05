import { Container } from "react-bootstrap";

import EmployeeFilter from "../Filter/EmployeeFilter";
import NavBar from "../Navigation/NavBar";

const EmployeeDirectory = () => {
  return (
    <Container fluid>
      <NavBar />
      <Container>
        <EmployeeFilter />
      </Container>
    </Container>
  );
};

export default EmployeeDirectory;
