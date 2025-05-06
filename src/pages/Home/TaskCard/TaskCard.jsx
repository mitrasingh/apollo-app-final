import { useEffect, useState } from "react";
import { Card, Col, Container, Row, Image, Stack, OverlayTrigger, Tooltip, Button } from "react-bootstrap";
import { getStorage, getDownloadURL, ref } from "firebase/storage";
import { db } from "../../../utils/firebase-config";
import { deleteDoc, doc, getDoc } from "firebase/firestore";
import { useSelector } from "react-redux";
import { useErrorBoundary } from "react-error-boundary";
import { toast } from 'react-toastify';
import { Link } from "react-router-dom";
import useDateConverter from "../../../hooks/useDateConverter";
import ViewTaskModal from "../ViewTaskModal/ViewTaskModal";
import DeleteModal from "../../../components/Modals/DeleteModal";
import PropTypes from "prop-types";
import styles from "./TaskCard.module.css";

const TaskCard = (props) => {

	// Props from TaskCardList.jsx
	const { task, fetchTasks } = props;

	// Redux user state data
	const currentUser = useSelector((state) => state.user);

	// Custom hook converts date into date string
	const { convertToDate } = useDateConverter();
	const dateToString = convertToDate(task.dueDate, 'en-US');

	// State holds user creator photo
	const [creatorPhoto, setCreatorPhoto] = useState(null);

	// State holds user creator name
	const [creatorName, setCreatorName] = useState("");

	// Delete task modal functionality
	const [isVisible, setIsVisible] = useState(false);
	const handleShow = () => setIsVisible(true);

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
			toast.error('Could not delete task!', {
				hideProgressBar: true
			});
		}
	};


	return (
		<>
			<Container className="mt-3">
				<Card>
					<Card.Header className="fs-6 text-light">
						<Row>
							<Col xs={8}>
								<div className="fs-4 fw-bold text-truncate">
									{task.taskName}
								</div>
							</Col>
							<Col>
								{task.userId === currentUser.userId ? (
									<Col className="d-flex justify-content-end fw-bold mt-1">
										{/* Delete Task Functionality */}
										<OverlayTrigger
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
								{dateToString}
							</Col>
						</Row>
						<Row className={styles.customFooter}>
							<hr className="mt-2"></hr>
							<Col xs={4}>
								<Stack direction="horizontal">
									<Image
										className="object-fit-cover"
										height="35px"
										width="35px"
										src={creatorPhoto}
										roundedCircle
									/>
									<Stack direction="vertical" className="ms-2 mt-1">
										<p className="fs-6 my-0 text-truncate">Creator:</p>
										<p className="fs-6 fw-bold my-0 text-truncate">
											{creatorName}
										</p>
									</Stack>
								</Stack>
							</Col>

							<Col className="d-flex justify-content-end mt-1">
								{/* if the current user matches the task creator, the edit button will be shown */}
								{currentUser.userId !== task.userId ? null : (
									<Link to={`/home/${task.taskId}`} state={{ task, creatorName, creatorPhoto }}>
										<Button
											variant="primary"
											size="sm"
											className={`px-2 fs-6 mb-1 text-light fw-bold ${styles.customBtn}`}
										>
											Edit
										</Button>
									</Link>
								)}
								<ViewTaskModal
									task={task}
									creatorPhoto={creatorPhoto}
									creatorName={creatorName}
								/>
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
		dueDate: PropTypes.object.isRequired,
		userId: PropTypes.string.isRequired,
		taskId: PropTypes.string.isRequired
	})
};

export default TaskCard;
