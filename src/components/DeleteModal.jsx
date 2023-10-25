import { Modal, Button } from "react-bootstrap";
import PropTypes from "prop-types";

export const DeleteModal = ({ handleDelete, setIsVisible, isVisible, type }) => {

	const handleClose = () => setIsVisible(false); // Closes modal component

	return (
		<>
			<Modal show={isVisible} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title className="fs-3 fw-bold">Confirm Delete</Modal.Title>
				</Modal.Header>
				<Modal.Body className="fs-5">
					Are you sure you want to delete this {type}?
				</Modal.Body>
				<Modal.Footer>
					<Button className="fs-6 text-light fw-bold" variant="secondary" onClick={handleClose}>
						Cancel
					</Button>
					<Button className="fs-6 text-light fw-bold" variant="primary" onClick={handleDelete}>
						Delete
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
};

DeleteModal.propTypes = {
	setIsVisible: PropTypes.func.isRequired,
	isVisible: PropTypes.bool.isRequired,
	type: PropTypes.string.isRequired,
	handleDelete: PropTypes.func.isRequired,
};
