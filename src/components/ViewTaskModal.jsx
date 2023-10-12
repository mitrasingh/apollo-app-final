import { Button, Modal, Stack, Image } from "react-bootstrap";
import PropTypes from "prop-types";
import { db } from "../utils/firebase-config";
import { doc, getDoc } from "firebase/firestore";
import { useEffect } from "react";
import { useState } from "react";

export const ViewTaskModal = ({ isViewModal, handleClose, taskId, creatorPhoto, creatorName }) => {

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
			<Modal show={isViewModal} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title style={{ fontSize: "15px" }} className="fw-bold">
						{taskName}
					</Modal.Title>
				</Modal.Header>

				<Modal.Body style={{ fontSize: "11px" }}>
					<p className="fw-bold" style={{ margin: "0px" }}>
						Description of Task
					</p>
					<p>{descriptionTask}</p>

					<p className="fw-bold" style={{ margin: "0px" }}>
						Status of Project
					</p>
					<p>{statusProject}</p>

					<p className="fw-bold" style={{ margin: "0px" }}>
						Percent Completed
					</p>
					<p>{priorityLevel}</p>

					<p className="fw-bold" style={{ margin: "0px" }}>
						Due Date
					</p>
					<p>{dueDate}</p>

					<Stack direction="horizontal">
						<Image
							style={{
								height: "35px",
								width: "35px",
								objectFit: "cover",
								borderRadius: "50%",
							}}
							src={creatorPhoto} // user photo will be placed here
							roundedCircle
						/>
						<p style={{ fontSize: "10px" }} className="mt-3 ms-2">
							Created by: {creatorName}
						</p>
					</Stack>
				</Modal.Body>

				<Modal.Footer>
					<Button
						style={{ fontSize: "10px", maxHeight: "30px" }}
						className="ms-2"
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
