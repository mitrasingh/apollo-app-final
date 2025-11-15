import { useSelector } from "react-redux";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../../../utils/firebase-config";
import { useState } from "react";
import { Row, Col, Stack, Image, Card, Dropdown } from "react-bootstrap";
import { convertToRelativeTime } from "../../../utils/date-config";
import EditComment from "../EditComment/EditComment";
import Like from "../../../components/Like/Like";
import DeleteModal from "../../../components/Modals/DeleteModal";
import { CommentData } from "../../../types/commentdata.types";
import { RootState } from "../../../store/store";

type CommentCardProps = {
	comment: CommentData;
	setIsCommentsRefreshed: React.Dispatch<React.SetStateAction<boolean>>;
};

const CommentCard = ({ comment, setIsCommentsRefreshed }: CommentCardProps) => {
	// Props from parent Comments.jsx

	// Data of currently logged in user from Redux state
	const currentUser = useSelector((state: RootState) => state.user);

	// Display edit field for the comment when set to true
	const [isEditComment, setIsEditComment] = useState(false);

	// Custom hook converts firestore timestamp into relative time from current time
	const dateRelativeTime = convertToRelativeTime(comment.datePosted);

	// Delete comment functionality
	const [isVisible, setIsVisible] = useState<boolean>(false); // Modal display state to confirm delete
	const handleShow = () => setIsVisible(true); // Renders modal display if true
	const handleDeleteComment = async () => {
		try {
			const commentRef = doc(db, "comments", comment.commentId);
			await deleteDoc(commentRef);
			setIsCommentsRefreshed((current) => !current);
			setIsVisible(false);
		} catch (error: any) {
			console.log(`Error: ${error.message}`);
		}
	};

	return (
		<>
			<Card className="mt-4 p-1 text-light">
				<Card.Header>
					<Row>
						<Col className="d-flex align-items-center">
							<Stack direction="horizontal" gap={2}>
								<Image className="object-fit-cover" height="25px" width="25px" src={comment.userPhoto} roundedCircle />
								<Card.Text className="fs-6">
									{comment.firstName} {comment.lastName}
								</Card.Text>
							</Stack>
						</Col>
						<Col className="d-flex justify-content-end">
							{/* Code below is a ternary operator nested into another ternary operator */}
							{comment.userId === currentUser.userId ? (
								<Dropdown className="fs-6 mt-1">
									<Dropdown.Toggle
										className="d-flex align-items-center text-light"
										split
										variant="primary"
										id="dropdown-split-basic"
									></Dropdown.Toggle>

									<Dropdown.Menu>
										<Dropdown.Item onClick={() => setIsEditComment(true)}>Edit</Dropdown.Item>
										<Dropdown.Item onClick={handleShow}>Delete</Dropdown.Item>
										{isVisible ? (
											<DeleteModal
												handleDelete={handleDeleteComment}
												setIsVisible={setIsVisible}
												isVisible={isVisible}
												type={"comment"}
											/>
										) : null}
									</Dropdown.Menu>
								</Dropdown>
							) : null}
						</Col>
					</Row>
				</Card.Header>

				<Card.Body>
					{isEditComment ? (
						<EditComment
							userComment={comment.userComment}
							setIsEditComment={setIsEditComment}
							commentId={comment.commentId}
							setIsCommentsRefreshed={setIsCommentsRefreshed}
						/>
					) : (
						<Row>
							<Col>
								<p className="fs-5">{comment.userComment}</p>
							</Col>
						</Row>
					)}
				</Card.Body>
				<Card.Body className="py-0">
					<Row>
						<Col>
							<Like docId={comment.commentId} />
						</Col>
						<Col>
							<Card.Text className="fs-6 py-0 pt-3 d-flex justify-content-end">
								{comment.isDocEdited ? ` post edited ` : ` posted `}
								{dateRelativeTime}
							</Card.Text>
						</Col>
					</Row>
				</Card.Body>
			</Card>
		</>
	);
};

export default CommentCard;
