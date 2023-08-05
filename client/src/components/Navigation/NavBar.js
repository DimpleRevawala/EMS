import { Nav } from "react-bootstrap";

const NavBar = () => {
  return (
    <Nav variant="tabs" defaultActiveKey="/home">
      <Nav.Item>
        <Nav.Link href="/">Home</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link href="/employee/create">Create Employee</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link href="/employee/upcoming/retirement">
          UpComing Retirement
        </Nav.Link>
      </Nav.Item>
    </Nav>
  );
};

export default NavBar;