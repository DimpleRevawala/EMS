import { useEffect, useState } from "react";

import { Button, Form, Row, Col, Container, Alert } from "react-bootstrap";

import EmployeeTable from "../Employee/EmployeeTable";

const EmployeeFilter = () => {
  const [employeeList, setEmployeeList] = useState([]);
  const [error, setError] = useState("");

  const fetchEmployeeData = async () => {
    const query = `
      query EmployeeList {
        employeeList {
          _id
          age
          currentStatus
          dateOfJoining
          department
          firstName
          title
          lastName
          employeeType
        }
      }
    `;

    await fetch("http://localhost:8000/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    }).then(async (res) => {
      const employees = await res.json();
      setEmployeeList(employees.data.employeeList);
    });
  };

  useEffect(() => {
    fetchEmployeeData();
  }, []);

  const FilterEmployeeData = async (filterEmployeeValues) => {
    // graphl query to filter the employee data
    const query = `
    query FilteredEmployeeData($title: String, $employeeType: String, $department: String) {
      filteredEmployeeData(title: $title, employeeType: $employeeType, department: $department) {
        _id
        age
        currentStatus
        dateOfJoining
        department
        employeeType
        firstName
        lastName
        title
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
          title: filterEmployeeValues.title,
          department: filterEmployeeValues.department,
          employeeType: filterEmployeeValues.employeeType,
        },
      }),
    }).then(async (res) => {
      setError("");
      const d = await res.json();
      setEmployeeList(d.data.filteredEmployeeData);
    });
  };

  const handleFilter = (e) => {
    e.preventDefault();

    const form = document.forms.filterEmployee;

    // take values of the filter form fields
    let filterEmployeeValues = {
      title: form.title.value,
      department: form.department.value,
      employeeType: form.employeeType.value,
    };

    // destructure the filterEmployeeValues
    const { title, department, employeeType } = filterEmployeeValues;

    // do the validations of all the fields
    if (
      title === "Select Title" &&
      department === "Select Department" &&
      employeeType === "Select Employee Type"
    ) {
      // set the error state with errors
      setError("Please select any of the field to do filter!");
    } else {
      // if there is no error then employee will be created
      FilterEmployeeData(filterEmployeeValues);
    }
  };

  return (
    <Container>
      <h2 className="text-center mb-4 mt-5">Filter an Employee</h2>
      <Form
        id="filterEmployee"
        onSubmit={handleFilter}
        style={{ width: "40%", margin: "auto" }}
      >
        <Row>{error && <Alert variant="danger">{error}</Alert>}</Row>
        <Row>
          <Col>
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
          <Form.Label>Employee Type</Form.Label>
          <Form.Select name="employeeType">
            <option>Select Employee Type</option>
            <option value="FullTime">FullTime</option>
            <option value="PartTime">PartTime</option>
            <option value="Contract">Contract</option>
            <option value="Seasonal">Seasonal</option>
          </Form.Select>
        </Form.Group>
        <Button variant="primary" className="w-100" type="submit">
          Filter
        </Button>
      </Form>
      <EmployeeTable employeeListProps={employeeList} />
    </Container>
  );
};

export default EmployeeFilter;
