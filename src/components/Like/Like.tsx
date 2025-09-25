import { useState, useEffect } from "react";
import { Stack, Image } from "react-bootstrap";
import { doc, collection, addDoc, getDocs, query, deleteDoc, where } from "firebase/firestore";
import { db } from "../../utils/firebase-config";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

type LikeProps = {
	docId: string;
};

type LikeData = {
	userId: string;
	likeId: string;
};

const Like = ({ docId }: LikeProps) => {
	const [likes, setLikes] = useState<LikeData[]>([]);
	const currentUser = useSelector((state: RootState) => state.user);

	// Fetch all likes documents that match prop docId
	useEffect(() => {
		const getLikes = async () => {
			const likesRef = collection(db, "likes");
			const likesQuery = query(likesRef, where("docRefId", "==", docId));
			const likesDocs = await getDocs(likesQuery);
			const mapDocs: LikeData[] = likesDocs.docs.map((doc) => ({
				userId: doc.data().userId,
				likeId: doc.id,
			}));
			setLikes(mapDocs);
		};
		getLikes();
	}, [docId]);

	// Creates a document in likes collection
	const addLikeHandle = async () => {
		try {
			if (!currentUser.userId) return;
			const likesRef = collection(db, "likes");
			const newLikeDoc = await addDoc(likesRef, {
				userId: currentUser.userId,
				docRefId: docId,
			});
			setLikes((prev) => [...prev, { userId: currentUser.userId as string, likeId: newLikeDoc.id }]);
		} catch (error) {
			console.log(error);
		}
	};

	// Removes a specified document in likes collection
	const removeLikeHandle = async () => {
		try {
			if (!currentUser.userId) return;
			const likesRef = collection(db, "likes");
			const likesQuery = query(likesRef, where("docRefId", "==", docId), where("userId", "==", currentUser.userId));
			const likesOfQryDocs = await getDocs(likesQuery);
			if (likesOfQryDocs.empty) return;
			const likesDocId = likesOfQryDocs.docs[0].id;
			const likesDeleteDoc = doc(db, "likes", likesDocId);
			await deleteDoc(likesDeleteDoc);
			setLikes((prev) => prev.filter((like) => like.likeId !== likesDocId));
		} catch (error) {
			console.log(error);
		}
	};

	// Verifies if user has already liked post
	const hasUserLiked = likes.some((like) => like.userId === currentUser.userId);

	return (
		<Stack direction="horizontal" gap={1}>
			<Image
				src={hasUserLiked ? "/rocketLike.svg" : "/rocketNoLike.svg"}
				width="20"
				height="20"
				className="d-inline-block align-top"
				alt="apollo logo"
				onClick={hasUserLiked ? removeLikeHandle : addLikeHandle}
			/>
			<p className="fs-6 mt-3 ms-1">Likes: {likes.length} </p>
		</Stack>
	);
};

export default Like;
