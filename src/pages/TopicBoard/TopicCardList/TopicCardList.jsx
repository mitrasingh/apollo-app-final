import { useEffect, useState } from "react";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../../../utils/firebase-config";
import { useErrorBoundary } from "react-error-boundary";
import Spinner from 'react-bootstrap/Spinner';
import TopicCard from "../TopicCard/TopicCard";
import PropTypes from "prop-types";

export const TopicCardList = ({ isTopicsRefreshed }) => {
    // Current state of data fetched from fetchTopics function
    const [topicArray, setTopicArray] = useState([]);

    // Catches error and returns to error boundary component (error component in parent (TopicBoard.jsx)
    const { showBoundary } = useErrorBoundary();

    // State for displaying loader component
    const [isLoading, setIsLoading] = useState(true);

    // Function that fetches data from database by querying "topics" collection
    // useEffect(() => {
    //     const fetchTopics = async () => {
    //         try {
    //             const dbRef = collection(db, "topics");
    //             // const queryOrderDate = query(dbRef, orderBy("datePosted", "desc"));
    //             const fetchTopics = await getDocs(query(dbRef));
    //             // const topicsData = await getDocs(queryOrderDate);
    //             const topicsMap = fetchTopics.docs.map((doc) => ({
    //                 ...doc.data(),
    //                 topicId: doc.id
    //             }));
    //             setTopicArray(topicsMap);
    //         } catch (error) {
    //             console.log(`Error: ${error.message}`);
    //             showBoundary(error);
    //         } finally {
    //             setIsLoading(false);
    //         }
    //     };
    //     fetchTopics();
    // }, [isTopicsRefreshed]);

    const fetchTopics = async () => {
        try {
            const dbRef = collection(db, "topics");
            // const queryOrderDate = query(dbRef, orderBy("datePosted", "desc"));
            const fetchTopics = await getDocs(query(dbRef));
            // const topicsData = await getDocs(queryOrderDate);
            const topicsMap = fetchTopics.docs.map((doc) => ({
                ...doc.data(),
                topicId: doc.id
            }));
            setTopicArray(topicsMap);
        } catch (error) {
            console.log(`Error: ${error.message}`);
            showBoundary(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTopics();
    }, [isTopicsRefreshed]);


    // const listTopicCards = topicArray.map((topic) => <TopicCard topic={topic} key={topic.topicId} />)

    return (
        <>
            {isLoading ?
                <div className="d-flex justify-content-center align-items-center vh-100">
                    <Spinner animation="border" variant="warning" />
                </div>
                :
                <>
                    {topicArray.map(topic => {
                        return <TopicCard topic={topic} key={topic.topicId} />;
                    })}
                    {/* {listTopicCards} */}
                </>
            }
        </>
    );
};

TopicCardList.propTypes = {
    isTopicsRefreshed: PropTypes.bool.isRequired
}

export default TopicCardList;