import { useState } from "react";
import moment from "moment";

import { Button, Form, Row, Col, Alert, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import NavBar from "../Navigation/NavBar";

const EmployeeCreate = () => {
  const [errors, setErrors] = useState([]);

  const navigate = useNavigate();

  const AddSingleEmployee = async (newEmployeeValues) => {
    // graphl query to add the employee
    const query = `
    mutation Mutation($firstName: String, $lastName: String, $age: Int, $dateOfJoining: String, $title: String, $employeeType: String, $department: String) {
      createEmployee(firstName: $firstName, lastName: $lastName, age: $age, dateOfJoining: $dateOfJoining, title: $title, employeeType: $employeeType, department: $department) {
        age
        currentStatus
        dateOfJoining
        department
        employeeType
        firstName
        title
        lastName
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
        query,
        variables: {
          firstName: newEmployeeValues.firstName,
          lastName: newEmployeeValues.lastName,
          age: newEmployeeValues.age,
          title: newEmployeeValues.title,
          department: newEmployeeValues.department,
          dateOfJoining: newEmployeeValues.dateOfJoining,
          employeeType: newEmployeeValues.employeeType,
        },
      }),
    }).then(() => {
      navigate("/");
    });
  };

  const handleErrors = (newEmployeeValues, err) => {
    // destructure the newEmployeeValues
    const {
      firstName,
      lastName,
      age,
      dateOfJoining,
      title,
      department,
      employeeType,
    } = newEmployeeValues;

    // do the validations of all the fields
    if (firstName === "") {
      err.push("Please enter your first name!");
    } else if (!isNaN(firstName)) {
      err.push("First name should be valid!");
    } else if (lastName === "") {
      err.push("Please enter your last name!");
    } else if (!isNaN(lastName)) {
      err.push("Last name should be valid!");
    } else if (isNaN(age)) {
      err.push("Please enter your age!");
    } else if (age < 20 || age > 70) {
      err.push("Employee age can be between 20-70!");
    } else if (dateOfJoining === "") {
      err.push("Please enter your date of joining!");
    } else if (
      moment(dateOfJoining, "YYYY-MM-DD").isAfter(moment().format("YYYY-MM-DD"))
    ) {
      err.push("Please select valid date, you've selected future date!");
    } else if (employeeType === "Select Employee Type") {
      err.push("Please select your employee type!");
    } else if (department === "Select Department") {
      err.push("Please select your department!");
    } else if (title === "Select Title") {
      err.push("Please select your title!");
    } else if (employeeType === "Contract" || employeeType === "Seasonal") {
      if (title !== "Employee") {
        err.push(`${employeeType} Employee can't be ${title}`);
      }
    }

    // set the error state with errors
    setErrors(err);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const form = document.forms.createEmployee;

    // take values from the form fields
    let newEmployeeValues = {
      firstName: form.firstName.value,
      lastName: form.lastName.value,
      age: form.age.valueAsNumber,
      dateOfJoining: form.dateOfJoining.value,
      title: form.title.value,
      department: form.department.value,
      employeeType: form.employeeType.value,
    };

    // temporary array of errors
    let err = [];

    handleErrors(newEmployeeValues, err);

    // if there is no error then employee will be created
    if (err.length === 0) {
      AddSingleEmployee(newEmployeeValues);
    }
  };

  return (
    <Container fluid>
      <NavBar />
      <Container>
        <h2 className="text-center mb-4 mt-5">Create an Employee</h2>
        <Form
          id="createEmployee"
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
                <Form.Control name="firstName" type="text" />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>Last Name</Form.Label>
                <Form.Control type="text" name="lastName" />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>Age</Form.Label>
                <Form.Control type="number" name="age" />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>Date of Joining</Form.Label>
                <Form.Control type="date" name="dateOfJoining" />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group className="mb-3" c>
                <Form.Label>Employee Type</Form.Label>
                <Form.Select name="employeeType">
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
                <Form.Select name="department">
                  <option>Select Department</option>
                  <option value="IT">IT</option>
                  <option value="Marketing">Marketing</option>
                  <option value="HR">HR</option>
                  <option value="Engineering">Engineering</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <Form.Group className="mb-3" c>
            <Form.Label>Title</Form.Label>
            <Form.Select name="title">
              <option>Select Title</option>
              <option value="Employee">Employee</option>
              <option value="Manager">Manager</option>
              <option value="Director">Director</option>
              <option value="VP">VP</option>
            </Form.Select>
          </Form.Group>

          <div className="d-grid mb-3">
            <Button variant="primary" type="submit">
              Create
            </Button>
          </div>
        </Form>
      </Container>
    </Container>
  );
};

export default EmployeeCreate;
