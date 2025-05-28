import { Modal, Button } from "react-bootstrap";

interface DeleteModalProps {
	handleDelete: () => void;
	setIsVisible: (visible: boolean) => void;
	isVisible: boolean;
	type: string;
}

const DeleteModal = ({
	handleDelete,
	setIsVisible,
	isVisible,
	type,
}: DeleteModalProps) => {
	// Closes modal component
	const handleClose = () => setIsVisible(false);

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
					<Button
						className="fs-6 text-light fw-bold"
						variant="secondary"
						onClick={handleClose}
					>
						Cancel
					</Button>
					<Button
						className="fs-6 text-light fw-bold"
						variant="primary"
						onClick={handleDelete}
					>
						Delete
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
};

export default DeleteModal;
