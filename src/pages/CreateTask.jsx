import { Button, Container, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../utils/firebase-config";
import { useForm } from "react-hook-form";
import * as dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';

export const CreateTask = () => {
	// React Hook Form
	const form = useForm();
	const { register, handleSubmit, formState } = form;
	const { errors } = formState;

	dayjs.extend(utc); // Converts date to UTC ensuring dates match from user input to display via database

	const navigate = useNavigate();

	// Access Redux state of user slice
	const user = useSelector((state) => state.user);

	// Firestore to generate task ID
	const handleCreateTask = async (data) => {
		try {
			const formattedDueDate = dayjs.utc(data.taskduedate).format("MM/DD/YYYY");
			const dbRef = collection(db, "tasks");
			const taskData = {
				taskName: data.taskname,
				descriptionTask: data.taskdescription,
				statusProject: data.taskstatus,
				priorityLevel: data.taskpriority,
				dueDate: formattedDueDate,
				userId: user.userId,
			};
			await addDoc(dbRef, taskData);
			navigate("/");
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<Container className="mt-4">
			<Form onSubmit={handleSubmit(handleCreateTask)} noValidate>
				<Form.Group className="mb-3">
					<Form.Label style={{ fontSize: "10px" }} className="fw-bold">
						Task name
					</Form.Label>
					<Form.Control
						style={{ fontSize: "10px" }}
						maxLength={50}
						type="text"
						{...register("taskname", {
							required: {
								value: true,
								message: "Task name is required!",
							},
						})}
						placeholder="Enter the name of task"
					/>
					<p style={{ marginTop: "5px", fontSize: "10px", color: "red" }}>
						{errors.taskname?.message}
					</p>
				</Form.Group>

				<Form.Group className="mb-3">
					<Form.Label style={{ fontSize: "10px" }} className="fw-bold">
						Description of task
					</Form.Label>
					<Form.Control
						style={{ fontSize: "10px", resize: "none" }}
						as="textarea"
						rows={3}
						maxLength={450}
						type="text"
						{...register("taskdescription", {
							required: {
								value: true,
								message: "Description of task is required!",
							},
						})}
						placeholder="Give a short description of the task you are requesting."
					/>
					<p style={{ marginTop: "5px", fontSize: "10px", color: "red" }}>
						{errors.taskdescription?.message}
					</p>
				</Form.Group>

				<Form.Group className="mb-3">
					<Form.Label style={{ fontSize: "10px" }} className="fw-bold">
						What is the status of this project?
					</Form.Label>
					<Form.Select
						style={{ fontSize: "10px" }}
						aria-label="Default select example"
						{...register("taskstatus", {
							required: {
								value: true,
								message: "Choosing a status is required!",
							},
						})}
					>
						<option value="">Select status options</option>
						<option value="On Hold">On Hold</option>
						<option value="In Progress">In Progress</option>
						<option value="Done">Done</option>
						<option value="Cancelled">Cancelled</option>
					</Form.Select>
					<p style={{ marginTop: "5px", fontSize: "10px", color: "red" }}>
						{errors.taskstatus?.message}
					</p>
				</Form.Group>

				<Form.Group className="mb-3">
					<Form.Label style={{ fontSize: "10px" }} className="fw-bold">
						What is the priority level of this project?
					</Form.Label>
					<Form.Select
						style={{ fontSize: "10px" }}
						aria-label="Default select example"
						{...register("taskpriority", {
							required: {
								value: true,
								message: "Choosing a priority is required!",
							},
						})}
					>
						<option value="">Select priority level options</option>
						<option value="Urgent">Urgent</option>
						<option value="High">High</option>
						<option value="Medium">Medium</option>
						<option value="Low">Low</option>
					</Form.Select>
					<p style={{ marginTop: "5px", fontSize: "10px", color: "red" }}>
						{errors.taskpriority?.message}
					</p>
				</Form.Group>

				<Form.Group className="mb-3">
					<Form.Label style={{ fontSize: "10px" }} className="fw-bold">
						Due date
					</Form.Label>
					<Form.Control
						style={{ fontSize: "10px" }}
						type="date"
						{...register("taskduedate", {
							valueAsDate: true,
							required: {
								value: true,
								message: "Due date is required!",
							},
						})}
						placeholder="mm/dd/yyyy"
					/>
					<p style={{ marginTop: "5px", fontSize: "10px", color: "red" }}>
						{errors.taskduedate?.message}
					</p>
				</Form.Group>

				<Button
					style={{ fontSize: "10px", maxHeight: "30px" }}
					variant="secondary"
					size="sm"
					href="/"
				>
					Cancel
				</Button>

				<Button
					style={{ fontSize: "10px", maxHeight: "30px" }}
					className="ms-2"
					variant="primary"
					size="sm"
					type="submit"
				>
					Submit
				</Button>
			</Form>
		</Container>
	);
};
