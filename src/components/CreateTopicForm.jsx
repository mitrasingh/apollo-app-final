import { Container, Form, Button } from "react-bootstrap";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../utils/firebase-config";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";

// Props are from Shoutboard.jsx
export const CreateTopicForm = ({ setIsCreateTopic, setIsTopicsRefreshed }) => {

	// React Hook Form
	const form = useForm();
	const { register, handleSubmit, formState } = form;
	const { errors } = formState;

	const user = useSelector((state) => state.user);

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
			});
			if (addTopic) {
				setIsTopicsRefreshed((current) => !current);
				setIsCreateTopic(false);
			}
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<Container
			style={{ border: "2px solid grey", maxWidth: "97.5%" }}
			className="mt-3 mb-3 pb-3"
		>
			<Container style={{ maxWidth: "85%" }} className="mt-3">
				<Form onSubmit={handleSubmit(handleCreateTopic)} noValidate>
					<Form.Group className="mb-3">
						<Form.Control
							style={{ fontSize: "10px" }}
							maxLength={50}
							type="text"
							placeholder="Title"
							{...register("title", {
								required: {
									value: true,
									message: "Title is required",
								},
							})}
						/>
						<p style={{ marginTop: "5px", fontSize: "10px", color: "red" }}>
							{errors.title?.message}
						</p>
					</Form.Group>

					<Form.Group className="mb-3">
						<Form.Control
							style={{ fontSize: "10px" }}
							maxLength={100000}
							rows={5}
							type="text"
							as="textarea"
							placeholder="Shout it out..."
							{...register("description", {
								required: {
									value: true,
									message: "Description is required",
								},
							})}
						/>
						<p style={{ marginTop: "5px", fontSize: "10px", color: "red" }}>
							{errors.description?.message}
						</p>
					</Form.Group>
					<Button
						style={{ fontSize: "10px", maxHeight: "30px" }}
						className="ms-2"
						variant="secondary"
						size="sm"
						onClick={() => setIsCreateTopic(false)}
					>
						Cancel
					</Button>

					<Button
						style={{
							fontSize: "10px",
							maxHeight: "30px",
							MozColumnWidth: "40px",
						}}
						className="ms-2"
						variant="primary"
						size="sm"
						type="submit"
					>
						Post
					</Button>
				</Form>
			</Container>
		</Container>
	);
};

CreateTopicForm.propTypes = {
	setIsCreateTopic: PropTypes.func.isRequired,
	setIsTopicsRefreshed: PropTypes.func.isRequired,
};
