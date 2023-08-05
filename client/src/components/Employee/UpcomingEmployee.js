import { Container } from "react-bootstrap";

import UpcomingRetirementFilter from "../Filter/UpcomingRetirementFilter";
import NavBar from "../Navigation/NavBar";

const UpcomingEmployee = () => {
  return (
    <Container fluid>
      <NavBar />
      <Container>
        <UpcomingRetirementFilter />
      </Container>
    </Container>
  );
};

export default UpcomingEmployee;