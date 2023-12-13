import { useState, useEffect } from "react"
import { Stack, Image } from "react-bootstrap"
import { doc, collection, addDoc, getDocs, query, deleteDoc, where } from "firebase/firestore"
import { db } from "../utils/firebase-config"
import { useSelector } from "react-redux"
import PropTypes from 'prop-types';

export const Like = ({ docId }) => { // Prop from CommentCard.jsx

    const [likes, setLikes] = useState([]); // Amount of docs in likes collection that match prop docId
    const currentUser = useSelector((state) => state.user); // User state values from Redux

    // Fetch all likes documents that only match prop docId
    useEffect(() => {
        const getLikes = async () => {
            const likesRef = collection(db, "likes");
            const likesQuery = query(likesRef, where("docRefId", "==", docId));
            const likesDocs = await getDocs(likesQuery);
            const mapDocs = likesDocs.docs.map((doc) => ({
                userId: doc.data().userId,
                likeId: doc.id,
            }));
            setLikes(mapDocs);
        };
        getLikes();
    }, []);

    // Creates a document in likes collection
    const addLikeHandle = async () => {
        try {
            const likesRef = collection(db, "likes");
            const newLikeDoc = await addDoc(likesRef, {
                userId: currentUser.userId,
                docRefId: docId,
            });
            const addNewLike = (prev) => [
                ...prev,
                { userId: currentUser.userId, likeId: newLikeDoc.id },
            ];
            setLikes(addNewLike);
        } catch (error) {
            console.log(error);
        }
    };

    // Removes a specified document in likes collection
    const removeLikeHandle = async () => {
        try {
            const likesRef = collection(db, "likes");
            const likesQuery = query(
                likesRef,
                where("docRefId", "==", docId),
                where("userId", "==", currentUser.userId)
            );
            const likesOfQryDocs = await getDocs(likesQuery);
            const likesDocId = likesOfQryDocs.docs[0].id;
            const likesDeleteDoc = doc(db, "likes", likesDocId);
            await deleteDoc(likesDeleteDoc);
            const likeFilter = (prev) =>
                prev.filter((like) => like.likeId !== likesDocId);
            setLikes(likeFilter);
        } catch (error) {
            console.log(error);
        }
    };

    // Verifies if user has already liked post (if user has, post will be unliked)
    const hasUserLiked = likes.find((like) => like.userId === currentUser.userId);

    return (
        <Stack direction="horizontal" gap={1}>
            <Image
                src={
                    hasUserLiked
                        ? "/src/assets/rocketLike.svg"
                        : "/src/assets/rocketNoLike.svg"
                }
                width="20"
                height="20"
                className="d-inline-block align-top"
                alt="apollo logo"
                onClick={hasUserLiked ? removeLikeHandle : addLikeHandle}
            />
            <p className="fs-6 mt-3 ms-1">
                Likes: {likes.length}{" "}
            </p>
        </Stack>
    );
};

Like.propTypes = {
    docId: PropTypes.string.isRequired,
};

export default Like;