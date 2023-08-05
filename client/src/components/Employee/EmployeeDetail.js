import { useEffect, useState } from "react";
import moment from "moment";

import { Row, Col, Container, Card } from "react-bootstrap";
import { useParams } from "react-router-dom";

import NavBar from "../Navigation/NavBar";
import "../../employeeDetail.css";

const EmployeeDetail = () => {
  const [employee, setEmployee] = useState("");
  const [calculateRetirementDate, setCalculateRetirementDate] = useState({});

  const params = useParams();

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

  const calculateRetirement = (dateOfJoining, age) => {
    const joiningDate = moment(parseInt(dateOfJoining));
    const retirementDate = joiningDate.add(65 - age, "years");
    const difference = moment.duration(retirementDate.diff(moment()));
    const years = difference.years();
    const months = difference.months();
    const days = difference.days();
    return {
      days: days < 0 ? 0 : days,
      months: months < 0 ? 0 : months,
      years: years < 0 ? 0 : years,
    };
  };

  const fetchEmployeeData = async () => {
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
      setEmployee(employee.data.getSingleEmployee);
      setCalculateRetirementDate(
        calculateRetirement(
          employee.data.getSingleEmployee.dateOfJoining,
          employee.data.getSingleEmployee.age
        )
      );
    });
  };

  useEffect(() => {
    fetchEmployeeData();
  }, []);

  return (
    <Container fluid>
      <NavBar />
      <Container>
        {employee && (
          <Row className="justify-content-center mt-5">
            <Col xs={12} md={8}>
              <Card>
                <Card.Body>
                  <Card.Title>Employee Details</Card.Title>
                  <hr />
                  <Row>
                    <Col xs={6} md={4}>
                      <h6>Full Name:</h6>
                    </Col>
                    <Col xs={6} md={8}>
                      <p>
                        {employee.firstName} {employee.lastName}
                      </p>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={6} md={4}>
                      <h6>Age:</h6>
                    </Col>
                    <Col xs={6} md={8}>
                      <p>{employee.age}</p>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={6} md={4}>
                      <h6>Date of Joining:</h6>
                    </Col>
                    <Col xs={6} md={8}>
                      <p>
                        {" "}
                        {new Date(parseInt(employee.dateOfJoining))
                          .toUTCString()
                          .split(" ", 4, 4)
                          .join(" ")}
                      </p>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={6} md={4}>
                      <h6>Employee Type:</h6>
                    </Col>
                    <Col xs={6} md={8}>
                      <p>{employee.employeeType}</p>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={6} md={4}>
                      <h6>Department:</h6>
                    </Col>
                    <Col xs={6} md={8}>
                      <p>{employee.department}</p>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={6} md={4}>
                      <h6>Title:</h6>
                    </Col>
                    <Col xs={6} md={8}>
                      <p>{employee.title}</p>
                    </Col>
                  </Row>
                </Card.Body>
                <Card.Footer>
                  <b>
                    {employee.currentStatus
                      ? `${calculateRetirementDate.days} days, ${calculateRetirementDate.months}
    months, ${calculateRetirementDate.years} years left for the retirement`
                      : `${employee.firstName} already retired!`}
                  </b>
                </Card.Footer>
              </Card>
            </Col>
          </Row>
        )}
      </Container>
    </Container>
  );
};

export default EmployeeDetail;
