import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { doc, updateDoc } from "firebase/firestore";
import { toast } from 'react-toastify';
import { db } from "../../../utils/firebase-config";
import { Button, Row, Col, Image, Form, Stack } from "react-bootstrap";
import { useErrorBoundary } from "react-error-boundary";
import useDateConverter from "../../../hooks/useDateConverter";
import PropTypes from "prop-types";
import styles from "../EditTaskPage.module.css";

const EditTaskForm = ({ task, creatorName, creatorPhoto }) => {

    // Custom hook converts date into firestore timestamp / date string
    const { convertToTimestamp, convertLostTimestampToDate } = useDateConverter();

    // React Router Dom hook allowing access to different routes
    const navigate = useNavigate();

    // React Hook Form
    const form = useForm();
    const { register, handleSubmit, reset, formState } = form;
    const { errors } = formState;

    // Catches error and returns to error boundary component (error component in parent (TopicBoard.jsx)
    const { showBoundary } = useErrorBoundary();

    useEffect(() => {
        const loadDefaultValues = () => {
            try {
                const dateToString = convertLostTimestampToDate(task.dueDate);
                let defaultValues = {};
                defaultValues.taskname = task.taskName;
                defaultValues.taskdescription = task.descriptionTask;
                defaultValues.taskstatus = task.statusProject;
                defaultValues.taskpriority = task.priorityLevel;
                defaultValues.taskduedate = dateToString;
                reset({ ...defaultValues });
            } catch (error) {
                console.log(`Error: ${error.message}`);
                showBoundary(error);
            }
        }
        loadDefaultValues();
    }, [])

    // Update new task content to database
    const handleUpdate = async (data) => {
        try {
            const timestamp = convertToTimestamp(data.taskduedate);
            await updateDoc(doc(db, "tasks", task.taskId), {
                taskName: data.taskname,
                descriptionTask: data.taskdescription,
                statusProject: data.taskstatus,
                priorityLevel: data.taskpriority,
                dueDate: timestamp
            });
            if (updateDoc) {
                toast.success('Task has been updated!');
                navigate("/home")
            }
        } catch (error) {
            console.log(`Error: ${error.message}`);
            toast.error('Could not update task!', {
                hideProgressBar: true
            });
        }
    };

    // Goes to previous page
    const handleCancel = () => {
        navigate("/home");
    }

    return (
        <Form onSubmit={handleSubmit(handleUpdate)} noValidate>
            <Form.Group className="mb-3" controlId="taskNameInput">
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

            <Form.Group className="mb-3" controlId="taskDescriptionInput">
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

            <Form.Group className="mb-3" controlId="taskStatusInput">
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

            <Form.Group className="mb-3" controlId="taskPriorityInput">
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

            <Form.Group className="mb-3" controlId="taskDueDateInput">
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

            <Row>
                <Col>
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
    )
};

EditTaskForm.propTypes = {
    creatorPhoto: PropTypes.string.isRequired,
    creatorName: PropTypes.string.isRequired,
    task: PropTypes.shape({
        taskName: PropTypes.string.isRequired,
        descriptionTask: PropTypes.string.isRequired,
        statusProject: PropTypes.string.isRequired,
        priorityLevel: PropTypes.string.isRequired,
        dueDate: PropTypes.object.isRequired,
        userId: PropTypes.string.isRequired,
        taskId: PropTypes.string.isRequired,
    })
};


export default EditTaskForm