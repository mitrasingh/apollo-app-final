import { useState } from "react";
import { Button, Modal, Stack, Image } from "react-bootstrap";
import useTimestampToDate from "../../../hooks/useTimestampToDate";
import PropTypes from "prop-types";
import styles from "./ViewTaskModal.module.css";

// Props are from TaskCard.jsx
const ViewTaskModal = ({ task, creatorPhoto, creatorName }) => {

	// Details task modal functionality
	const [isViewModal, setIsViewModal] = useState(false);
	const handleClose = () => setIsViewModal(false);

	// Converts firestore timestamp to a string date
	const dateToString = useTimestampToDate(task.dueDate, 'en-US');

	return (
		<>
			<Button
				variant="primary"
				size="sm"
				className={`px-2 ms-2 fs-6 text-light fw-bold ${styles.customBtn}`}
				onClick={() => setIsViewModal(true)}
			>
				View
			</Button>

			<Modal show={isViewModal} onHide={handleClose} className="mt-4">
				<Modal.Header closeButton>
					<Modal.Title className="fw-bold fs-3">
						{task.taskName}
					</Modal.Title>
				</Modal.Header>

				<Modal.Body className="fs-6">
					<p className={`fw-bold ${styles.detailText}`}>Description of Task </p>
					<p>{task.descriptionTask}</p>

					<p className={`fw-bold ${styles.detailText}`}>Status of Project</p>
					<p>{task.statusProject}</p>

					<p className={`fw-bold ${styles.detailText}`}>Percent Completed</p>
					<p>{task.priorityLevel}</p>

					<p className={`fw-bold ${styles.detailText}`}>Due Date</p>
					<p>{dateToString}</p>

					<Stack direction="horizontal">
						<Image
							className={styles.customImage}
							height="35px"
							width="35px"
							src={creatorPhoto}
							roundedCircle
						/>
						<p className="mt-3 ms-2 fs-6">Created by: {creatorName}</p>
					</Stack>
				</Modal.Body>

				<Modal.Footer>
					<Button
						className="fs-6 text-light fw-bold"
						variant="primary"
						size="sm"
						onClick={handleClose}
					>
						Done
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
};

ViewTaskModal.propTypes = {
	creatorPhoto: PropTypes.string.isRequired,
	creatorName: PropTypes.string.isRequired,
	task: PropTypes.shape({
		taskName: PropTypes.string.isRequired,
		descriptionTask: PropTypes.string.isRequired,
		statusProject: PropTypes.string.isRequired,
		priorityLevel: PropTypes.string.isRequired,
		dueDate: PropTypes.object.isRequired,
		userId: PropTypes.string.isRequired,
		taskId: PropTypes.string.isRequired
	})
};

export default ViewTaskModal;
