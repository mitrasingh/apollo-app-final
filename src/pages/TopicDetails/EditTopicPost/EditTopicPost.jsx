import { Form, Stack, Button, Row, Col } from "react-bootstrap";
import { db } from "../../../utils/firebase-config";
import { doc, updateDoc } from "firebase/firestore";
import { useForm } from "react-hook-form";
import { toast } from 'react-toastify';
import { createTimestamp } from "../../../utils/date-config";
import PropTypes from "prop-types";

// Props from TopicPost.jsx
const EditTopicPost = ({ setIsEditTopicDisplayed, description, id, setIsTopicRefreshed }) => {

	// React Hook Form
	const form = useForm({
		defaultValues: {
			newdescription: description,
		},
	});
	const { register, handleSubmit, formState } = form;
	const { errors } = formState;

	// Updates topic document in database and refreshes topic description
	const handleEditTopic = async (data) => {
		try {
			const timestamp = createTimestamp();
			const docRef = doc(db, "topics", id);
			await updateDoc(docRef, {
				description: data.newdescription,
				datePosted: timestamp,
				isDocEdited: true
			});
			if (updateDoc) {
				setIsEditTopicDisplayed(false); // Hides display of edit component
				setIsTopicRefreshed((current) => !current); // Refreshes topic for immediate update
			}
		} catch (error) {
			console.log(`Error: ${error.message}`);
			toast.error('Could not edit topic!');
		}
	};

	return (
		<>
			<Form
				className="mt-4"
				onSubmit={handleSubmit(handleEditTopic)}
				noValidate
			>
				<Form.Group className="mb-3" controlId="editPostInput">
					<Form.Label className="fw-bold text-light fs-6">
						Edit Your Post
					</Form.Label>
					<Form.Control
						className="fs-5"
						maxLength={100000}
						rows={5}
						type="text"
						as="textarea"
						{...register("newdescription", {
							required: {
								value: true,
								message: "Description of topic is required!",
							},
						})}
					/>
					<p className="mt-2 fs-6">{errors.newdescription?.message}</p>
				</Form.Group>
				<Row>
					<Col className="d-flex justify-content-end">
						<Stack direction="horizontal" gap={1}>
							<Button
								className="fs-6 text-light fw-bold"
								variant="secondary"
								size="sm"
								onClick={() => setIsEditTopicDisplayed(false)}
							>
								Cancel
							</Button>
							<Button
								className="text-light fw-bold fs-6 ms-2"
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
		</>
	);
};

EditTopicPost.propTypes = {
	description: PropTypes.string.isRequired,
	id: PropTypes.string.isRequired,
	setIsEditTopicDisplayed: PropTypes.func.isRequired,
	setIsTopicRefreshed: PropTypes.func.isRequired,
};

export default EditTopicPost;
