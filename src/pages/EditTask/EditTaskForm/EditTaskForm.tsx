import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Button, Row, Col, Image, Form, Stack } from "react-bootstrap";
import { useErrorBoundary } from "react-error-boundary";
import { TaskData } from "../../../types/taskdata.types";
import { TaskEditData } from "../../../types/taskdata.types";
import { convertLostTimestampToDate } from "../../../utils/date-config";
import { updateTask } from "../../../services/taskService";

type EditTaskFormProps = {
	task: TaskData;
	creatorName: string;
	creatorPhoto: string;
};

const EditTaskForm = ({
	task,
	creatorName,
	creatorPhoto,
}: EditTaskFormProps) => {
	// const { updateTask } = taskService();

	// React Router Dom hook allowing access to different routes
	const navigate = useNavigate();

	// React Hook Form
	const form = useForm<TaskEditData>();
	const { register, handleSubmit, reset, formState } = form;
	const { errors } = formState;

	// Catches error and returns to error boundary component (error component in parent (TopicBoard.jsx)
	const { showBoundary } = useErrorBoundary();

	useEffect(() => {
		const loadDefaultValues = () => {
			try {
				let dateToString: string;
				if (typeof task.dueDate === "string") {
					dateToString = task.dueDate;
				} else {
					dateToString = convertLostTimestampToDate(task.dueDate);
				}
				const defaultValues: TaskEditData = {
					taskName: task.taskName,
					descriptionTask: task.descriptionTask,
					statusProject: task.statusProject,
					priorityLevel: task.priorityLevel,
					dueDate: dateToString,
				};
				reset(defaultValues);
			} catch (error: any) {
				console.log(`Error: ${error.message}`);
				showBoundary(error);
			}
		};
		loadDefaultValues();
	}, []);

	// Update new task content to database
	const handleTaskUpdate = async (data: TaskEditData) => {
		try {
			await updateTask(task.taskId, data);
			toast.success("Task has been updated!");
			navigate("/home");
		} catch (error: any) {
			console.log(`Error: ${error.message}`);
			toast.error("Could not update task!", {
				hideProgressBar: true,
			});
		}
	};

	// Goes to previous page
	const handleCancel = () => {
		navigate("/home");
	};

	return (
		<Form onSubmit={handleSubmit(handleTaskUpdate)} noValidate>
			<Form.Group className="mb-4" controlId="taskNameInput">
				<Form.Label className="fw-bold fs-6 mt-3">Current Task Name</Form.Label>
				<Form.Control
					className="fs-6 shadow-none"
					type="text"
					{...register("taskName", {
						required: { value: true, message: "Task name is required!" },
					})}
				/>
				<p className="fs-6 mt-1">{errors.taskName?.message}</p>
			</Form.Group>

			<Form.Group className="mb-4" controlId="taskDescriptionInput">
				<Form.Label className="fw-bold fs-6">Description of Task</Form.Label>
				<Form.Control
					className="fs-6 shadow-none"
					type="text"
					as="textarea"
					rows={3}
					{...register("descriptionTask", {
						required: { value: true, message: "Task description is required!" },
					})}
				/>
				<p className="fs-6 mt-1">{errors.descriptionTask?.message}</p>
			</Form.Group>

			<Form.Group className="mb-4" controlId="taskStatusInput">
				<Form.Label className="fw-bold fs-6">Status of Project</Form.Label>
				<Form.Select
					className="fs-6 shadow-none"
					aria-label="Default select example"
					{...register("statusProject", {
						required: { value: true, message: "Status must be chosen!" },
					})}
				>
					<option value="">Select status options</option>
					<option value="On Hold">On Hold</option>
					<option value="In Progress">In Progress</option>
					<option value="Done">Done</option>
					<option value="Cancelled">Cancelled</option>
				</Form.Select>
				<p className="fs-6 mt-1">{errors.statusProject?.message}</p>
			</Form.Group>

			<Form.Group className="mb-4" controlId="taskPriorityInput">
				<Form.Label className="fw-bold fs-6">
					What is the priority level of this project?
				</Form.Label>
				<Form.Select
					className="fs-6 shadow-none"
					aria-label="Default select example"
					{...register("priorityLevel", {
						required: { value: true, message: "Priority must be chosen!" },
					})}
				>
					<option value="">Select priority level options</option>
					<option value="Urgent">Urgent</option>
					<option value="High">High</option>
					<option value="Medium">Medium</option>
					<option value="Low">Low</option>
				</Form.Select>
				<p className="fs-6 mt-1">{errors.priorityLevel?.message}</p>
			</Form.Group>

			<Form.Group className="mb-4" controlId="taskDueDateInput">
				<Form.Label className="fw-bold fs-6">Due Date</Form.Label>
				<Form.Control
					className="fs-6 shadow-none"
					type="date"
					{...register("dueDate", {
						// valueAsDate: true,
						required: {
							value: true,
							message: "Due date is required!",
						},
					})}
				/>
				<p className="fs-6 mt-1">{errors.dueDate?.message}</p>
			</Form.Group>

			<Row>
				<Col>
					<Stack direction="horizontal">
						<Image
							className="object-fit-cover"
							height="35px"
							width="35px"
							src={creatorPhoto}
							roundedCircle
						/>
						<p className="mt-3 fs-6 ms-2">Created by: {creatorName}</p>
					</Stack>
				</Col>

				<Col className="d-flex justify-content-end">
					<Stack direction="horizontal">
						<Button
							className="ms-2 fs-6 fw-bold text-light"
							variant="secondary"
							size="sm"
							onClick={handleCancel}
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
					</Stack>
				</Col>
			</Row>
		</Form>
	);
};

export default EditTaskForm;
