import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../utils/firebase-config";
import { useContext, useState } from "react";
import { TopicIdContext } from "../utils/TopicIdContext";
import { Row, Col, Stack, Image, Card, Dropdown } from "react-bootstrap";
import EditComment from "../components/EditComment";
import Like from "../components/Like";
import DeleteModal from "../components/DeleteModal";
import * as dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

export const CommentCard = (props) => {
	// Props from parent TopicDetails.jsx
	const { comment } = props;

	// Data of currently logged in user from Redux state
	const currentUser = useSelector((state) => state.user);

	// Data from useContext from TopicDetails.jsx
	const { setIsCommentsRefreshed } = useContext(TopicIdContext); // TopicIdContext consists of id and setIsCommentsRefreshed

	// Display edit field for the comment when set to true
	const [isEditComment, setIsEditComment] = useState(false);

	// Confirms user submitted change to comment when set to true
	const [isCommentUpdated, setIsCommentUpdated] = useState(false);

	// Delete comment functionality
	const [isVisible, setIsVisible] = useState(false); // Modal display state to confirm delete
	const handleShow = () => setIsVisible(true); // Renders modal display if true
	const handleDeleteComment = async () => {
		try {
			const commentRef = doc(db, "comments", comment.commentId);
			await deleteDoc(commentRef);
			setIsCommentsRefreshed((current) => !current);
			setIsVisible(false);
		} catch (error) {
			console.log(error);
		}
	};

	// Conversion of firestore timestamp to dayjs fromNow method
	dayjs.extend(relativeTime);
	const convertTimeStamp = comment.datePosted.toDate();
	const dateRelativeTime = dayjs(convertTimeStamp).fromNow();

	return (
		<>
			<Card className="mt-4 p-1 text-light">
				<Card.Header>
					<Row>
						<Col className="d-flex align-items-center">
							<Stack direction="horizontal" gap={2}>
								<Image
									height="25px"
									width="25px"
									src={comment.userPhoto}
									roundedCircle
								/>
								<Card.Text className="fs-6">
									{comment.firstName} {comment.lastName}
								</Card.Text>
							</Stack>
						</Col>
						<Col className="d-flex justify-content-end">
							{/* Code below is a ternary operator nested into another ternary operator */}
							{comment.userId === currentUser.userId
								? (
									<Dropdown className="fs-6 mt-1">
										<Dropdown.Toggle
											className="d-flex align-items-center text-light"
											split
											variant="primary"
											id="dropdown-split-basic"
										></Dropdown.Toggle>

										<Dropdown.Menu>
											<Dropdown.Item onClick={() => setIsEditComment(true)}>
												Edit
											</Dropdown.Item>
											<Dropdown.Item onClick={handleShow}>Delete</Dropdown.Item>
											{isVisible
												? <DeleteModal
													handleDelete={handleDeleteComment}
													setIsVisible={setIsVisible}
													isVisible={isVisible}
													type={"comment"}
												/>
												: null}
										</Dropdown.Menu>
									</Dropdown>
								)
								: null}
						</Col>
					</Row>
				</Card.Header>

				<Card.Body>
					{isEditComment
						?
						<EditComment
							userComment={comment.userComment}
							setIsEditComment={setIsEditComment}
							commentId={comment.commentId}
							setIsCommentUpdated={setIsCommentUpdated}
						/>
						:
						<Row>
							<Col>
								<p className="fs-5">{comment.userComment}</p>
							</Col>
						</Row>
					}
				</Card.Body>
				<Card.Body className="py-0">
					<Row>
						<Col>
							<Stack direction="horizontal" gap={3}>
								<Like docId={comment.commentId} />
								<Card.Text className="fs-6 py-0">
									{isCommentUpdated
										? ` ...post edited `
										: ` ...posted `}{dateRelativeTime}
								</Card.Text>
							</Stack>
						</Col>
					</Row>
				</Card.Body>
			</Card>
		</>
	);
};

CommentCard.propTypes = {
	comment: PropTypes.shape({
		userId: PropTypes.string.isRequired,
		userPhoto: PropTypes.string.isRequired,
		firstName: PropTypes.string.isRequired,
		lastName: PropTypes.string.isRequired,
		userComment: PropTypes.string.isRequired,
		datePosted: PropTypes.object.isRequired,
		topicId: PropTypes.string.isRequired,
		commentId: PropTypes.string.isRequired
	})
};
