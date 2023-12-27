import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Row, Image, Stack, OverlayTrigger, Tooltip } from "react-bootstrap";
import { getStorage, getDownloadURL, ref } from "firebase/storage";
import { db } from "../../../utils/firebase-config";
import { deleteDoc, doc, getDoc } from "firebase/firestore/lite";
import { useSelector } from "react-redux";
import { useErrorBoundary } from "react-error-boundary";
import { toast } from 'react-toastify';
import ViewTaskModal from "../ViewTaskModal/ViewTaskModal";
import EditTaskModal from "../EditTaskModal/EditTaskModal";
import DeleteModal from "../../../components/Modals/DeleteModal";
import PropTypes from "prop-types";
import styles from "./TaskCard.module.css";

const TaskCard = (props) => {

	// Props from TaskCards.jsx
	const { task, fetchTasks } = props;

	// Redux user state data
	const currentUser = useSelector((state) => state.user);

	// State holds user creator photo
	const [creatorPhoto, setCreatorPhoto] = useState("");

	// State holds user creator name
	const [creatorName, setCreatorName] = useState("");

	// Delete task modal functionality
	const [isVisible, setIsVisible] = useState(false);
	const handleShow = () => setIsVisible(true);

	// Edit task modal functionality
	const [isEditModal, setIsEditModal] = useState(false);
	const handleEditModalClose = () => setIsEditModal(false);

	// Details task modal functionality
	const [isViewModal, setIsViewModal] = useState(false);
	const handleClose = () => setIsViewModal(false);

	// Reference for firebase database
	const storage = getStorage();
	const storageRef = ref(storage);

	// Catches error and returns error boundary component (error component in parent (Home.jsx)
	const { showBoundary } = useErrorBoundary();

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
				console.log(`Error: ${error.message}`);
				showBoundary(error);
			}
		};
		fetchCreatorInfo();
	}, []);

	// Deletes task card from database
	const handleDeleteTaskCard = async () => {
		try {
			const documentRef = doc(db, "tasks", task.taskId);
			await deleteDoc(documentRef);
			fetchTasks();
			setIsVisible(false);
			toast.success('Task has been deleted!');
		} catch (error) {
			console.log(`Error: ${error.message}`);
			toast.error('Could not delete task!');
		}
	};

	return (
		<>
			<Container className="mt-3">
				<Card>
					<Card.Header className="fs-6 text-light">
						<Row>
							<Col>
								<Stack direction="horizontal" gap={2}>
									<div className="fs-4 fw-bold">
										{task.taskName.length > 30
											? `${task.taskName.substring(0, 30)}...`
											: task.taskName
										}
									</div>
								</Stack>
							</Col>
							<Col>
								{task.userId === currentUser.userId ? (
									<Col className="d-flex justify-content-end fw-bold mt-1">
										<OverlayTrigger
											key="bottom"
											placement="bottom"
											overlay={
												<Tooltip className="fs-6">
													Delete task
												</Tooltip>
											}
										>
											<Image
												onClick={handleShow}
												className={styles.cursorPointer}
												src="/trash-fill.svg"
												width="15"
												height="15"
												alt="trash icon"
											/>
										</OverlayTrigger>
									</Col>
								) : null}
							</Col>
							{/* DELETE MODAL AND PROPS USED IN COMMENTCARD.JSX, AVOID ANY NAME CHANGES */}
							{isVisible ? (
								<DeleteModal
									handleDelete={handleDeleteTaskCard}
									setIsVisible={setIsVisible}
									isVisible={isVisible}
									type={"task"} // Allowed to edit type prop name ie, "task" and "comment"
								/>
							) : null}
						</Row>
					</Card.Header>
					<Card.Body>
						<Row className="fw-bold fs-6">
							<Col>
								Status
							</Col>
							<Col>
								Priority
							</Col>
							<Col>
								Due
							</Col>
						</Row>
						<Row className="fs-5 mb-1">
							<Col>
								{task.statusProject}
							</Col>
							<Col>
								{task.priorityLevel}
							</Col>
							<Col>
								{task.dueDate}
							</Col>
						</Row>
						<Row className={styles.customFooter}>
							<hr className="mt-2"></hr>
							<Col xs={6}>
								<Stack direction="horizontal">
									<Image
										className="object-fit-cover"
										height="35px"
										width="35px"
										src={creatorPhoto}
										roundedCircle
									/>
									<Stack direction="vertical" className="ms-2 mt-1">
										<p className="fs-6 my-0">Created by:</p>
										<p className="fs-6 fw-bold my-0">
											{creatorName.length > 12
												? `${creatorName.substring(0, 12)}...`
												: creatorName
											}
										</p>
									</Stack>
								</Stack>
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
											fetchTasks={fetchTasks}
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
									className={`px-3 ms-2 fs-6 text-light fw-bold ${styles.customBtn}`}
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
	fetchTasks: PropTypes.func.isRequired,
	task: PropTypes.shape({
		taskName: PropTypes.string.isRequired,
		statusProject: PropTypes.string.isRequired,
		priorityLevel: PropTypes.string.isRequired,
		dueDate: PropTypes.string.isRequired,
		userId: PropTypes.string.isRequired,
		taskId: PropTypes.string.isRequired
	})
};

export default TaskCard;
