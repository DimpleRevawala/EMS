import { useEffect, useState } from "react";

import { Button, Form, Row, Col, Alert, Container } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";

import NavBar from "../Navigation/NavBar";

const EmployeeUpdate = () => {
  const [singleEmployee, setSingleEmployee] = useState("");
  const [formTitleField, setFormTitleField] = useState("");
  const [formDepartmentField, setFormDepartmentField] = useState("");
  const [formCurrentStatusField, setFormCurrentStatusField] = useState();
  const [errors, setErrors] = useState([]);

  const params = useParams();
  const navigate = useNavigate();

  const query = `
  query Query($id: String) {
    getSingleEmployee(_id: $id) {
      firstName
      age
      _id
      currentStatus
      dateOfJoining
      department
      employeeType
      lastName
      title
    }
  }
  `;

  const UpdateSingleEmployee = async (updatedEmployeeValues) => {
    // query for update the employee
    const updateMutation = `
    mutation Mutation($id: String, $title: String, $department: String, $currentStatus: Boolean) {
      updateEmployee(_id: $id, title: $title, department: $department, currentStatus: $currentStatus) {
        _id
        currentStatus
        department
        title
        firstName
      }
    }
  `;

    // sent the data through GraphQL api
    await fetch("http://localhost:8000/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: updateMutation,
        variables: {
          id: params.employeeId,
          title: updatedEmployeeValues.title,
          department: updatedEmployeeValues.department,
          currentStatus:
            updatedEmployeeValues.currentStatus === "Working" ? true : false,
        },
      }),
    }).then(() => {
      navigate("/");
    });
  };

  const handleErrors = (updatedEmployeeValues, err) => {
    // destructure the updatedEmployeeValues
    const { title, department, currentStatus } = updatedEmployeeValues;

    // do the validations of all the fields
    if (department === "Select Department") {
      err.push("Please select your department!");
    } else if (title === "Select Title") {
      err.push("Please select your title!");
    } else if (
      singleEmployee.employeeType === "Contract" ||
      singleEmployee.employeeType === "Seasonal"
    ) {
      if (title === "Manager" || title === "VP" || title === "Director") {
        err.push(`${singleEmployee.employeeType} Employee can't be ${title}`);
      }
    } else if (currentStatus === "Select Current Status") {
      err.push("Please select your current status!");
    }

    // set the error state with errors
    setErrors(err);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = document.forms.updateEmployee;

    // take values of the updated fields
    let updatedEmployeeValues = {
      title: form.title.value,
      department: form.department.value,
      currentStatus: form.currentStatus.value,
    };

    // temporary array of errors
    let err = [];

    handleErrors(updatedEmployeeValues, err);

    if (err.length === 0) {
      UpdateSingleEmployee(updatedEmployeeValues);
    }
  };

  const fetchSingleEmployeeData = async () => {
    await fetch("http://localhost:8000/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables: {
          id: params.employeeId,
        },
      }),
    }).then(async (res) => {
      const employee = await res.json();
      setSingleEmployee(employee.data.getSingleEmployee);
      setFormTitleField(employee.data.getSingleEmployee.title);
      setFormDepartmentField(employee.data.getSingleEmployee.department);
      setFormCurrentStatusField(
        employee.data.getSingleEmployee.currentStatus ? "Working" : "Retired"
      );
    });
  };

  useEffect(() => {
    fetchSingleEmployeeData();
  }, []);

  const handleChange = (e, selectedTag) => {
    if (selectedTag === "title") {
      setFormTitleField(e.target.value);
    }
    if (selectedTag === "department") {
      setFormDepartmentField(e.target.value);
    }
    if (selectedTag === "currentStatus") {
      setFormCurrentStatusField(e.target.value);
    }
  };

  return (
    <Container fluid>
      <NavBar />
      <h2 className="text-center mb-4 mt-5">Update an Employee</h2>
      <Form
        id="updateEmployee"
        style={{ width: "40%", margin: "auto" }}
        onSubmit={handleSubmit}
      >
        <Row>
          {errors.map((err, index) => (
            <Alert key={index} variant="danger">
              {err}
            </Alert>
          ))}
        </Row>
        <Row>
          <Col>
            <Form.Group className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                disabled
                name="firstName"
                type="text"
                value={singleEmployee.firstName}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                disabled
                type="text"
                name="lastName"
                value={singleEmployee.lastName}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Group className="mb-3">
              <Form.Label>Age</Form.Label>
              <Form.Control
                disabled
                type="number"
                name="age"
                value={singleEmployee.age}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="mb-3">
              <Form.Label>Date Of Joining</Form.Label>
              <Form.Control
                disabled
                value={new Date(parseInt(singleEmployee.dateOfJoining))
                  .toUTCString()
                  .split(" ", 4, 4)
                  .join(" ")}
                type="text"
                name="dateOfJoining"
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Group className="mb-3" c>
              <Form.Label>Employee Type</Form.Label>
              <Form.Select
                disabled
                name="employeeType"
                value={singleEmployee.employeeType}
              >
                <option>Select Employee Type</option>
                <option value="FullTime">FullTime</option>
                <option value="PartTime">PartTime</option>
                <option value="Contract">Contract</option>
                <option value="Seasonal">Seasonal</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="mb-3" c>
              <Form.Label>Department</Form.Label>
              <Form.Select
                name="department"
                value={formDepartmentField}
                onChange={(e) => handleChange(e, "department")}
              >
                <option>Select Department</option>
                <option value="IT">IT</option>
                <option value="Marketing">Marketing</option>
                <option value="HR">HR</option>
                <option value="Engineering">Engineering</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Group className="mb-3" c>
              <Form.Label>Title</Form.Label>
              <Form.Select
                name="title"
                value={formTitleField}
                onChange={(e) => handleChange(e, "title")}
              >
                <option>Select Title</option>
                <option value="Employee">Employee</option>
                <option value="Manager">Manager</option>
                <option value="Director">Director</option>
                <option value="VP">VP</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="mb-3" c>
              <Form.Label>Current Status</Form.Label>
              <Form.Select
                name="currentStatus"
                value={formCurrentStatusField}
                onChange={(e) => handleChange(e, "currentStatus")}
              >
                <option>Select Current Status</option>
                <option value="Working">Working</option>
                <option value="Retired">Retired</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <div className="d-grid mb-3">
          <Button variant="primary" type="submit">
            Update
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default EmployeeUpdate;
