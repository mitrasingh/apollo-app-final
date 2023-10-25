import { useEffect, useState } from "react";
import { ViewTaskModal } from "./ViewTaskModal";
import { EditTaskModal } from "./EditTaskModal";
import { Button, Card, Col, Container, Row, Image } from "react-bootstrap";
import PropTypes from "prop-types";
import { getStorage, getDownloadURL, ref } from "firebase/storage";
import { db } from "../utils/firebase-config";
import { deleteDoc, doc, getDoc } from "firebase/firestore";
import { useSelector } from "react-redux";
import { DeleteModal } from "./DeleteModal";
import styles from "./TaskCard.module.css";


export const TaskCard = (props) => {

	// Props from Home.jsx
	// const { taskName, statusProject, priorityLevel, dueDate, userId, taskId } = props.task;
	// const { taskName, statusProject, priorityLevel, dueDate, userId, taskId, refreshTasksHandle } = props;
	const { task, refreshTasksHandle } = props;

	const currentUser = useSelector((state) => state.user); // Redux user state data

	const [creatorPhoto, setCreatorPhoto] = useState("");
	const [creatorName, setCreatorName] = useState("");

	// Delete task functionality
	// DELETE MODAL AND PROPS ARE ALSO USED IN COMMENTCARD.JSX AVOID MAKING ANY EDITS
	const [isVisible, setIsVisible] = useState(false);
	const handleShow = () => setIsVisible(true);

	// Edit modal functionality
	const [isEditModal, setIsEditModal] = useState(false);
	const handleEditModalClose = () => setIsEditModal(false);

	// Details modal functionality
	const [isViewModal, setIsViewModal] = useState(false);
	const handleClose = () => setIsViewModal(false);

	// Reference for firebase database
	const storage = getStorage();
	const storageRef = ref(storage);

	// Retrieving users information from database
	useEffect(() => {
		const fetchCreatorInfo = async () => {
			try {
				const creatorPhotoURL = await getDownloadURL(
					ref(storageRef, `user-photo/${task.userId}`)
				);
				if (creatorPhotoURL) {
					setCreatorPhoto(creatorPhotoURL);
				}
				const docRef = doc(db, "users", task.userId);
				const docSnap = await getDoc(docRef);
				if (docSnap.exists()) {
					const data = docSnap.data();
					setCreatorName(`${data.firstname} ${data.lastname}`);
				}
			} catch (error) {
				console.log(error);
			}
		};
		fetchCreatorInfo();
	}, []);

	const handleDeleteTaskCard = async () => {
		try {
			const documentRef = doc(db, "tasks", task.taskId);
			await deleteDoc(documentRef);
			refreshTasksHandle();
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<>
			<Container className="mt-3">
				<Card>
					<Card.Header style={{ fontSize: "9px", height: "30px", color: "#FFF" }}>
						<Row>
							<Col>Task ID: {task.taskId}</Col>
							{task.userId === currentUser.userId ? (
								<Col style={{ fontSize: "10px", color: "red" }} className="d-flex justify-content-end fw-bold">
									<Image
										onClick={handleShow}
										className={styles.cursorPointer}
										src="public/img/trash-fill.svg"
										width="15"
										height="15"
										alt="trash icon"
									/>
									{/* <NavLink onClick={handleShow}>Delete Task</NavLink> */}
								</Col>
							) : null}
							{/* DELETE MODAL AND PROPS USED IN COMMENTCARD, AVOID ANY NAME CHANGES */}
							{isVisible ? (
								<DeleteModal
									handleDelete={handleDeleteTaskCard}
									setIsVisible={setIsVisible}
									isVisible={isVisible}
									type={"task"} // Allowed to edit type prop name etc: "task" => "comment"
								/>
							) : null}
						</Row>
					</Card.Header>
					<Card.Body>
						<Row style={{ fontSize: "9px" }} className="fw-bold">
							<Col xs lg="5">
								Name
							</Col>
							<Col xs lg="3">
								Status
							</Col>
							<Col xs lg="2">
								Priority Level
							</Col>
							<Col xs lg="2">
								Due
							</Col>
						</Row>
						<Row style={{ fontSize: "12px" }}>
							<Col xs lg="5">
								{task.taskName}
							</Col>
							<Col xs lg="3">
								{task.statusProject}
							</Col>
							<Col xs lg="2">
								{task.priorityLevel}
							</Col>
							<Col xs lg="2">
								{task.dueDate}
							</Col>
						</Row>
						<Row style={{ height: "55px" }}>
							<hr className="mt-2"></hr>
							<Col className="d-flex">
								<Image
									style={{
										height: "35px",
										width: "35px",
										objectFit: "cover",
										borderRadius: "50%",
									}}
									src={creatorPhoto}
									roundedCircle
								/>
								<p className="mt-2 fs-6 ms-2">
									Created by: {creatorName}
								</p>
							</Col>
							<Col className="d-flex justify-content-end mt-1">
								{/* IF EDIT BUTTON IS CLICKED AND MATCHES LOGGED IN USER - MODAL IS SHOWN */}
								{currentUser.userId !== task.userId ? null : (
									<>
										<EditTaskModal
											isEditModal={isEditModal}
											handleEditModalClose={handleEditModalClose}
											taskId={task.taskId}
											creatorPhoto={creatorPhoto}
											creatorName={creatorName}
											refreshTasksHandle={refreshTasksHandle}
										/>

										<Button
											variant="primary"
											size="sm"
											className={`px-3 fs-6 text-light fw-bold ${styles.customBtn}`}
											onClick={() => setIsEditModal(true)}
										>
											Edit
										</Button>
									</>
								)}

								{/* IF DETAILS BUTTON IS CLICKED MODAL IS SHOWN */}
								<ViewTaskModal
									isViewModal={isViewModal}
									handleClose={handleClose}
									taskId={task.taskId}
									creatorPhoto={creatorPhoto}
									creatorName={creatorName}
								/>
								<Button
									variant="primary"
									size="sm"
									className={`px-3 ms-3 fs-6 text-light fw-bold ${styles.customBtn}`}
									onClick={() => setIsViewModal(true)}
								>
									Details
								</Button>
							</Col>
						</Row>
					</Card.Body>
				</Card>
			</Container>
		</>
	);
};

TaskCard.propTypes = {
	refreshTasksHandle: PropTypes.func.isRequired,
	task: PropTypes.shape({
		taskName: PropTypes.string.isRequired,
		statusProject: PropTypes.string.isRequired,
		priorityLevel: PropTypes.string.isRequired,
		dueDate: PropTypes.string.isRequired,
		userId: PropTypes.string.isRequired,
		taskId: PropTypes.string.isRequired
	})
};
