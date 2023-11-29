import { Button, Form, Modal, Stack, Image } from "react-bootstrap";
import PropTypes from "prop-types";
import { useEffect } from "react";
import { db } from "../utils/firebase-config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useForm } from "react-hook-form"
import { toast } from 'react-toastify';
import * as dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import styles from "./EditTaskModal.module.css";

// Props are from TaskCard.jsx
const EditTaskModal = ({ isEditModal, handleEditModalClose, taskId, creatorPhoto, creatorName, fetchTasks }) => {

	// React Hook Form
	const form = useForm();
	const { register, handleSubmit, reset, formState } = form;
	const { errors } = formState;

	// Converts date to UTC ensuring dates match from user input to display via database
	dayjs.extend(utc);

	// Fetch task content from database and assign values to the related form fields 
	useEffect(() => {
		const taskContent = async () => {
			try {
				const docRef = doc(db, "tasks", taskId);
				const docSnap = await getDoc(docRef);
				if (docSnap.exists()) {
					const taskData = docSnap.data();
					const taskDueDate = taskData.dueDate;
					const formattedTaskDueDate = dayjs.utc(taskDueDate).format("YYYY-MM-DD");
					let defaultValues = {};
					defaultValues.taskname = taskData.taskName;
					defaultValues.taskdescription = taskData.descriptionTask;
					defaultValues.taskstatus = taskData.statusProject;
					defaultValues.taskpriority = taskData.priorityLevel;
					defaultValues.taskduedate = formattedTaskDueDate;
					reset({ ...defaultValues });
				}
			} catch (error) {
				console.log(`Error: ${error.message}`);
				toast.error('Could not load task!');
			}
		};
		if (isEditModal) {
			taskContent();
		}
	}, [isEditModal]);

	// Update new task content to database
	const handleUpdate = async (data) => {
		try {
			const formattedDueDate = dayjs.utc(data.taskduedate).format("MM/DD/YYYY");
			await updateDoc(doc(db, "tasks", taskId), {
				taskName: data.taskname,
				descriptionTask: data.taskdescription,
				statusProject: data.taskstatus,
				priorityLevel: data.taskpriority,
				dueDate: formattedDueDate
			});
			if (updateDoc) {
				handleEditModalClose();
				toast.success('Task has been updated!');
				fetchTasks();
			}
		} catch (error) {
			console.log(`Error: ${error.message}`);
			toast.error('Could not update task!');
		}
	};

	return (
		<>
			<Modal show={isEditModal} onHide={handleEditModalClose} className="mt-4">
				<Form onSubmit={handleSubmit(handleUpdate)} noValidate>
					<Modal.Header closeButton>
						<Modal.Title className="fw-bold fs-3">
							Edit Task
						</Modal.Title>
					</Modal.Header>

					<Modal.Body>
						<Form.Group className="mb-3">
							<Form.Label className="fw-bold fs-6">
								Current Task Name
							</Form.Label>
							<Form.Control
								className="fs-6 shadow-none"
								type="text"
								{...register("taskname", {
									required: {
										value: true,
										message: "Task name is required!"
									}
								})}
							/>
							<p className="fs-6 mt-1">{errors.taskname?.message}</p>
						</Form.Group>

						<Form.Group className="mb-3">
							<Form.Label className="fw-bold fs-6">
								Description of Task
							</Form.Label>
							<Form.Control
								className="fs-6 shadow-none"
								type="text"
								as="textarea"
								rows={3}
								{...register("taskdescription", {
									required: {
										value: true,
										message: "Task description is required!"
									}
								})}
							/>
							<p className="fs-6 mt-1">{errors.taskdescription?.message}</p>
						</Form.Group>

						<Form.Group className="mb-3">
							<Form.Label className="fw-bold fs-6">
								Status of Project
							</Form.Label>
							<Form.Select
								className="fs-6 shadow-none"
								aria-label="Default select example"
								{...register("taskstatus", {
									required: true,
									message: "Status must be chosen!"
								})}
							>
								<option value="">Select status options</option>
								<option value="On Hold">On Hold</option>
								<option value="In Progress">In Progress</option>
								<option value="Done">Done</option>
								<option value="Cancelled">Cancelled</option>
							</Form.Select>
							<p className="fs-6 mt-1">{errors.taskstatus?.message}</p>
						</Form.Group>

						<Form.Group className="mb-3" controlId="progress">
							<Form.Label className="fw-bold fs-6">
								What is the priority level of this project?
							</Form.Label>
							<Form.Select
								className="fs-6 shadow-none"
								aria-label="Default select example"
								{...register("taskpriority", {
									required: true,
									message: "Priority must be chosen!"
								})}
							>
								<option value="">Select priority level options</option>
								<option value="Urgent">Urgent</option>
								<option value="High">High</option>
								<option value="Medium">Medium</option>
								<option value="Low">Low</option>
							</Form.Select>
							<p className="fs-6 mt-1">{errors.taskpriority?.message}</p>
						</Form.Group>

						<Form.Group className="mb-3">
							<Form.Label className="fw-bold fs-6">
								Due Date
							</Form.Label>
							<Form.Control
								className="fs-6 shadow-none"
								type="date"
								{...register("taskduedate", {
									valueAsDate: true,
									required: {
										value: true,
										message: "Due date is required!"
									}
								})}
							/>
							<p className="fs-6 mt-1">{errors.taskduedate?.message}</p>
						</Form.Group>

						<Stack direction="horizontal">
							<Image
								className={styles.customImage}
								height="35px"
								width="35px"
								src={creatorPhoto}
								roundedCircle
							/>
							<p className="mt-3 fs-6 ms-2">
								Created by: {creatorName}
							</p>
						</Stack>
					</Modal.Body>

					<Modal.Footer>
						<Button
							className="ms-2 fs-6 fw-bold text-light"
							variant="secondary"
							size="sm"
							onClick={handleEditModalClose}
						>
							Cancel
						</Button>

						<Button
							className="ms-2 fs-6 fw-bold text-light"
							variant="primary"
							size="sm"
							type="submit"
						>
							Update
						</Button>
					</Modal.Footer>
				</Form>
			</Modal>
		</>
	);
};

EditTaskModal.propTypes = {
	isEditModal: PropTypes.bool.isRequired,
	handleEditModalClose: PropTypes.func.isRequired,
	creatorPhoto: PropTypes.string.isRequired,
	creatorName: PropTypes.string.isRequired,
	taskId: PropTypes.string.isRequired,
	fetchTasks: PropTypes.func.isRequired
};

export default EditTaskModal;
