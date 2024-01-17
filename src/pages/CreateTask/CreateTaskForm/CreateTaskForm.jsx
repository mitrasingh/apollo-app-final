import { Button, Form, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../../../utils/firebase-config";
import { useForm } from "react-hook-form";
import { toast } from 'react-toastify';
import * as dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';

const CreateTaskForm = () => {
    // React Hook Form
    const form = useForm();
    const { register, handleSubmit, formState } = form;
    const { errors } = formState;

    // Converts date to UTC ensuring dates match from user input to display via database
    dayjs.extend(utc);

    // React router function allows user to navigate to specified route
    const navigate = useNavigate();

    // Access Redux state of user slice
    const user = useSelector((state) => state.user);

    // Firestore to generate task ID
    const handleCreateTask = async (data) => {
        try {
            const formattedDueDate = dayjs.utc(data.taskduedate).format("MM/DD/YYYY");
            const [month, day, year] = formattedDueDate.split('/').map(Number);
            const parsedDueDate = new Date(year, month - 1, day); // Note: Month is zero-based in JavaScript Dates
            const timestampDueDate = Timestamp.fromDate(parsedDueDate);
            const dbRef = collection(db, "tasks");
            const taskData = {
                taskName: data.taskname,
                descriptionTask: data.taskdescription,
                statusProject: data.taskstatus,
                priorityLevel: data.taskpriority,
                dueDate: timestampDueDate,
                userId: user.userId,
            };
            await addDoc(dbRef, taskData);
            toast.success('Your task has been added!')
            navigate("/");
        } catch (error) {
            console.log(`Error: ${error.message}`);
            toast.error('Sorry, could not create task!', {
                hideProgressBar: true
            });
        }
    };

    // Directs user to previous page
    const handleCancel = () => {
        navigate(-1);
    }

    return (
        <Form onSubmit={handleSubmit(handleCreateTask)} noValidate>
            <Form.Label className="fs-2 fw-bold d-flex justify-content-center">Create Task</Form.Label>
            <Form.Group className="mb-4">
                <Form.Label className="fw-bold mt-3">Task name</Form.Label>
                <Form.Control
                    className="fs-6 shadow-none"
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
                <p className="mt-2">{errors.taskname?.message}</p>
            </Form.Group>

            <Form.Group className="mb-4">
                <Form.Label className="fw-bold">
                    Description of task
                </Form.Label>
                <Form.Control
                    className="fs-6 shadow-none"
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
                <p className="mt-2">{errors.taskdescription?.message}</p>
            </Form.Group>

            <Form.Group className="mb-4">
                <Form.Label className="fw-bold">
                    What is the status of this project?
                </Form.Label>
                <Form.Select
                    className="fs-6 shadow-none"
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
                <p className="mt-2">{errors.taskstatus?.message}</p>
            </Form.Group>

            <Form.Group className="mb-4">
                <Form.Label className="fw-bold">
                    What is the priority level of this project?
                </Form.Label>
                <Form.Select
                    className="fs-6 shadow-none"
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
                <p className="mt-2">{errors.taskpriority?.message}</p>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label className="fw-bold">
                    Due date
                </Form.Label>
                <Form.Control
                    className="fs-6 shadow-none"
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
                <p className="mt-2">{errors.taskduedate?.message}</p>
            </Form.Group>
            <Row>
                <Col className="d-flex justify-content-end">
                    <Button
                        className="mt-2 fs-6 text-light fw-bold"
                        variant="secondary"
                        size="sm"
                        onClick={handleCancel}
                    >
                        Cancel
                    </Button>

                    <Button
                        className="ms-2 mt-2 fs-6 text-light fw-bold"
                        variant="primary"
                        size="sm"
                        type="submit"
                    >
                        Submit
                    </Button>
                </Col>
            </Row>
        </Form>
    );
};

export default CreateTaskForm;