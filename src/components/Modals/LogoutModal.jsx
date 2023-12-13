import { Modal, Button } from "react-bootstrap";
import PropTypes from "prop-types";

const LogoutModal = ({ handleLogout, setLogOutModalVisible, isLogoutModalVisible }) => {

    const handleClose = () => setLogOutModalVisible(false); // Closes modal component

    return (
        <>
            <Modal show={isLogoutModalVisible} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title className="fs-3 fw-bold">Confirm Logout</Modal.Title>
                </Modal.Header>
                <Modal.Body className="fs-5">
                    Are you sure you want to log out?
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        className="fs-6 text-light fw-bold"
                        variant="secondary"
                        onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button
                        className="fs-6 text-light fw-bold"
                        variant="primary"
                        onClick={handleLogout}>
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

LogoutModal.propTypes = {
    setLogOutModalVisible: PropTypes.func.isRequired,
    isLogoutModalVisible: PropTypes.bool.isRequired,
    handleLogout: PropTypes.func.isRequired,
};

export default LogoutModal;