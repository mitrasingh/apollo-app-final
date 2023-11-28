import { useState, useEffect } from "react";
import { Button, Modal, Stack, Image } from "react-bootstrap";
import { db } from "../utils/firebase-config";
import { doc, getDoc } from "firebase/firestore";
import PropTypes from "prop-types";
import styles from "./ViewTaskModal.module.css";

const ViewTaskModal = ({ isViewModal, handleClose, taskId, creatorPhoto, creatorName }) => {

	const [taskName, setTaskName] = useState("");
	const [descriptionTask, setDescriptionTask] = useState("");
	const [statusProject, setStatusProject] = useState("");
	const [priorityLevel, setPriorityLevel] = useState("");
	const [dueDate, setDueDate] = useState("");

	useEffect(() => {
		const taskContent = async () => {
			try {
				const docRef = doc(db, "tasks", taskId);
				const docSnap = await getDoc(docRef);
				if (docSnap.exists()) {
					const data = docSnap.data();
					setTaskName(data.taskName);
					setDescriptionTask(data.descriptionTask);
					setStatusProject(data.statusProject);
					setPriorityLevel(data.priorityLevel);
					setDueDate(data.dueDate);
				}
			} catch (error) {
				console.log(error);
			}
		};
		if (isViewModal) {
			taskContent();
		}
	}, [isViewModal]);

	return (
		<>
			<Modal show={isViewModal} onHide={handleClose} className="mt-4">
				<Modal.Header closeButton>
					<Modal.Title className="fw-bold fs-3">
						{taskName}
					</Modal.Title>
				</Modal.Header>

				<Modal.Body className="fs-6">
					<p className={`fw-bold ${styles.detailText}`}>Description of Task </p>
					<p>{descriptionTask}</p>

					<p className={`fw-bold ${styles.detailText}`}>Status of Project</p>
					<p>{statusProject}</p>

					<p className={`fw-bold ${styles.detailText}`}>Percent Completed</p>
					<p>{priorityLevel}</p>

					<p className={`fw-bold ${styles.detailText}`}>Due Date</p>
					<p>{dueDate}</p>

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
	isViewModal: PropTypes.bool.isRequired,
	handleClose: PropTypes.func.isRequired,
	taskId: PropTypes.string.isRequired,
	creatorPhoto: PropTypes.string.isRequired,
	creatorName: PropTypes.string.isRequired,
};

export default ViewTaskModal;
