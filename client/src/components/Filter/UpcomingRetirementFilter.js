import { useEffect, useState } from "react";
import moment from "moment";

import { Button, Form, Row, Col, Container, Alert } from "react-bootstrap";

import EmployeeTable from "../Employee/EmployeeTable";

const UpcomingRetirementFilter = () => {
  const [employeeList, setEmployeeList] = useState([]);

  const [error, setError] = useState("");

  const calculateRetirement = (dateOfJoining, age) => {
    const joiningDate = moment(parseInt(dateOfJoining));
    const retirementDate = joiningDate.add(65 - age, "years");
    const difference = moment.duration(retirementDate.diff(moment()));
    const years = difference.years();
    const months = difference.months();

    return {
      months,
      years,
    };
  };

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
      setEmployeeList(
        employees.data.employeeList.filter((e) => {
          return (
            calculateRetirement(e.dateOfJoining, e.age).years === 0 &&
            calculateRetirement(e.dateOfJoining, e.age).months < 7 &&
            e.currentStatus
          );
        })
      );
    });
  };

  useEffect(() => {
    fetchEmployeeData();
  }, []);

  const FilterUpcomingEmployeeData = async (employeeType) => {
    // graphl query to filter the upcoming employee data
    const query = `
       query Query($employeeType: String) {
        upComingFilteredEmployeeList(employeeType: $employeeType) {
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
          employeeType,
        },
      }),
    }).then(async (res) => {
      const emp = await res.json();
      setError("");
      setEmployeeList(
        emp.data.upComingFilteredEmployeeList.filter((e) => {
          return (
            calculateRetirement(e.dateOfJoining, e.age).years === 0 &&
            calculateRetirement(e.dateOfJoining, e.age).months < 7
          );
        })
      );
    });
  };

  const handleUpcomingFilter = (e) => {
    e.preventDefault();

    const form = document.forms.filterUpcomingEmployee;

    // take values of the employeeType field to to do filter
    const employeeType = form.employeeType.value;

    // do the validations of the field
    if (employeeType === "Select Employee Type") {
      // set the error state
      setError("Please select your employee type!");
    } else {
      FilterUpcomingEmployeeData(employeeType);
    }
  };

  return (
    <Container>
      <h2 className="text-center mb-4 mt-5">Filter an Upcoming Employee</h2>
      <Form
        id="filterUpcomingEmployee"
        onSubmit={handleUpcomingFilter}
        style={{ width: "40%", margin: "auto" }}
      >
        {error && (
          <Row>
            <Alert variant="danger">{error}</Alert>
          </Row>
        )}
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
        </Row>
        <Button variant="primary" className="w-100" type="submit">
          Filter
        </Button>
      </Form>
      <EmployeeTable
        upcomingRetirement={true}
        employeeListProps={employeeList}
      />
    </Container>
  );
};

export default UpcomingRetirementFilter;