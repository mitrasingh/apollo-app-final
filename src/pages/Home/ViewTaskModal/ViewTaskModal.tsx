import { useState } from "react";
import { Button, Modal, Stack, Image } from "react-bootstrap";
import useDateConverter from "../../../hooks/useDateConverter";
import { TaskData } from "../../../types/taskdata.types";
import styles from "./ViewTaskModal.module.css";

interface ViewTaskModalProps {
	task: TaskData;
	creatorPhoto: string;
	creatorName: string;
}

// Props are from TaskCard.jsx
const ViewTaskModal = ({
	task,
	creatorPhoto,
	creatorName,
}: ViewTaskModalProps) => {
	// Details task modal functionality
	const [isViewModal, setIsViewModal] = useState(false);
	const handleClose = () => setIsViewModal(false);

	// Custom hook converts date into date string
	const { convertToDate } = useDateConverter();
	const dateToString = convertToDate(task.dueDate, "en-US");

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
					<Modal.Title className="fw-bold fs-3">{task.taskName}</Modal.Title>
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
							className="object-fit-cover"
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

export default ViewTaskModal;
