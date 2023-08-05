import { Modal, Button } from "react-bootstrap";

const CustomModal = ({ show, setShowModal }) => {
  return (
    <div>
      <Modal show={show}>
        <Modal.Header>
          <Modal.Title>Alert Message - Delete Employee</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>CAN’T DELETE EMPLOYEE – STATUS ACTIVE</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowModal(false)}>
            Okay
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CustomModal;
