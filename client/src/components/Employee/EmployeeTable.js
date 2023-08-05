import { useState } from "react";

import { Button, Container, Table } from "react-bootstrap";
import { Link } from "react-router-dom";

import CustomModal from "../Modal/CustomModal";

const EmployeeTable = ({ employeeListProps, upcomingRetirement }) => {
  const [showModal, setShowModal] = useState(false);

  const handleDelete = async (employeeId, currentStatus) => {
    const query = `
      mutation Mutation($id: String) {
        deleteEmployee(_id: $id) {
          firstName
        }
      }
    `;

    if (currentStatus) {
      setShowModal(true);
    } else {
      // sent the data through GraphQL api for delete the employee
      await fetch("http://localhost:8000/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
          variables: {
            id: employeeId,
          },
        }),
      }).then(() => {
        window.location.reload();
      });
    }
  };

  //check if employee list is empty then show some meaningful message otherwise display table
  return employeeListProps.length === 0 ? (
    <Container>
      <h2 className="text-center mb-4 mt-4">List of Employees</h2>
      {upcomingRetirement ? (
        <h5 className="text-center mb-4 mt-4 fw-light">
          There are currently no employee data available in the database whose
          retirement is coming in next six month! or <br /> <br /> based on your
          search from the above table
        </h5>
      ) : (
        <h5 className="text-center mb-4 mt-4 fw-light">
          There are currently no employee data available in the database or the
          filtered data that you have searched from the above form! <br />{" "}
          <br />
          If you want to add employee data then you can go to the{" "}
          <Link to="/employee/create" className="createEmployeeLink">
            Create Employee
          </Link>{" "}
          page.
        </h5>
      )}
    </Container>
  ) : (
    <Container>
      <CustomModal show={showModal} setShowModal={setShowModal} />
      <h2 className="text-center mb-4 mt-4">List of Employees</h2>
      <Table striped bordered hover className="mb-5">
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Age</th>
            <th>Date of Joining</th>
            <th>Title</th>
            <th>Department</th>
            <th>Employee Type</th>
            <th>Current Status</th>
            <th>More Info</th>
            <th>Edit Action</th>
            <th>Delete Action</th>
          </tr>
        </thead>
        {employeeListProps.map((employee, index) => {
          return (
            <tbody key={index}>
              <tr>
                <td>{employee.firstName}</td>
                <td>{employee.lastName}</td>
                <td>{employee.age}</td>
                <td>
                  {new Date(parseInt(employee.dateOfJoining))
                    .toUTCString()
                    .split(" ", 4, 4)
                    .join(" ")}
                </td>
                <td>{employee.title}</td>
                <td>{employee.department}</td>
                <td>{employee.employeeType}</td>
                <td>{employee.currentStatus ? "Working" : "Retired"}</td>
                <td>
                  <Button variant="outline-success">
                    <Link
                      className="detailBtn"
                      to={`/employee/detail/${employee._id}`}
                    >
                      Employee Details
                    </Link>
                  </Button>
                </td>
                <td>
                  <Button variant="outline-primary">
                    <Link
                      className="updateBtn"
                      to={`/employee/edit/${employee._id}`}
                    >
                      Update
                    </Link>
                  </Button>
                </td>
                <td>
                  <Button
                    variant="outline-danger"
                    onClick={() =>
                      handleDelete(employee._id, employee.currentStatus)
                    }
                  >
                    Remove
                  </Button>
                </td>
              </tr>
            </tbody>
          );
        })}
      </Table>
    </Container>
  );
};

export default EmployeeTable;
