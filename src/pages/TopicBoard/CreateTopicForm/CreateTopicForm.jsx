import { Container, Form, Button, Row, Col } from "react-bootstrap";
import { collection, addDoc, Timestamp } from "firebase/firestore/lite";
import { db } from "../../../utils/firebase-config";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { toast } from 'react-toastify';
import PropTypes from "prop-types";
import styles from "./CreateTopicForm.module.css";

// Props are from TopicBoard.jsx
export const CreateTopicForm = ({ setIsCreateTopic, setIsTopicsRefreshed }) => {

	// React Hook Form
	const form = useForm();
	const { register, handleSubmit, formState } = form;
	const { errors } = formState;

	// Access Redux state of user slice
	const user = useSelector((state) => state.user);

	// Function adds topic to database, refreshes topic list, closes create topic form (if success), shows success/error message
	const handleCreateTopic = async (data) => {
		const myDate = new Date(); // Javascript date object
		const postTimeStamp = Timestamp.fromDate(myDate); // Converts date object into a firestore timestamp
		try {
			const dbRef = collection(db, "topics");
			const addTopic = await addDoc(dbRef, { // Firestore will auto generate task ID
				title: data.title,
				description: data.description,
				userId: user.userId,
				firstName: user.firstName,
				lastName: user.lastName,
				datePosted: postTimeStamp,
				isDocEdited: false // Must be false on initial creation of topic
			});
			if (addTopic) {
				setIsTopicsRefreshed((current) => !current);
				setIsCreateTopic(false);
				toast.success('Topic has been created!');
			}
		} catch (error) {
			console.log(`Error: ${error.message}`);
			toast.error('Could not create topic!');
		}
	};

	return (
		<Container className="mt-2 mb-4 pb-3">
			<Container className={`mt-4 p-4 border ${styles.customContainer}`}>
				<Form onSubmit={handleSubmit(handleCreateTopic)} noValidate>
					<Form.Group className="fs-6 text-light">
						<Form.Label className="fw-bold">Title</Form.Label>
						<Form.Control
							className="fs-6 shadow-none"
							maxLength={50}
							type="text"
							placeholder="Shout your title"
							{...register("title", {
								required: {
									value: true,
									message: "Title is required",
								},
							})}
						/>
						<p className="mt-2">{errors.title?.message}</p>

						<Form.Label className="fw-bold">Message</Form.Label>
						<Form.Control
							className="fs-6 shadow-none"
							maxLength={100000}
							rows={5}
							type="text"
							as="textarea"
							placeholder="Shout your message"
							{...register("description", {
								required: {
									value: true,
									message: "Description is required",
								},
							})}
						/>
						<p className="mt-2">{errors.description?.message}</p>
					</Form.Group>
					<Row>
						<Col className="d-flex justify-content-end mb-1">
							<Button
								className={`fs-6 text-light fw-bold ${styles.customBtn}`}
								variant="secondary"
								size="sm"
								onClick={() => setIsCreateTopic(false)}
							>
								Cancel
							</Button>

							<Button
								className={`ms-2 fs-6 text-light fw-bold ${styles.customBtn}`}
								variant="primary"
								size="sm"
								type="submit"
							>
								Post
							</Button>
						</Col>
					</Row>
				</Form>
			</Container>
		</Container>
	);
};

CreateTopicForm.propTypes = {
	setIsCreateTopic: PropTypes.func.isRequired,
	setIsTopicsRefreshed: PropTypes.func.isRequired,
};

export default CreateTopicForm;
