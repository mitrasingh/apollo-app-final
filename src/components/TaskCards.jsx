import { useEffect, useState } from "react";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../utils/firebase-config";
import { useErrorBoundary } from "react-error-boundary";
import Spinner from 'react-bootstrap/Spinner';
import PropTypes from "prop-types";
import TaskCard from "../components/TaskCard";

const TaskCards = ({ setTaskArray, setTaskArrayFilter, taskArrayFilter }) => {

    // State for displaying loader component
    const [isLoading, setIsLoading] = useState(true);

    // Catches error and returns error boundary component (error component in parent (TopicBoard.jsx)
    const { showBoundary } = useErrorBoundary();

    // Fetch data and map each task into state variables
    const fetchTasks = async () => {
        try {
            const dbRef = collection(db, "tasks");
            const fetchTasks = await getDocs(query(dbRef));
            const tasksMap = fetchTasks.docs.map((doc) => ({
                ...doc.data(),
                taskId: doc.id,
            }));
            setTaskArray(tasksMap);
            setTaskArrayFilter(tasksMap);
        } catch (error) {
            console.log(`Error: ${error.message}`);
            showBoundary(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    return (
        <>
            {isLoading ?
                <div className="d-flex justify-content-center align-items-center vh-100">
                    <Spinner animation="border" variant="warning" />
                </div>
                :
                <>
                    {taskArrayFilter.map((task) => {
                        return (
                            <TaskCard
                                fetchTasks={fetchTasks}
                                task={task}
                                key={task.taskId}
                            />
                        );
                    })}
                </>
            }
        </>
    )
};

TaskCards.propTypes = {
    setTaskArray: PropTypes.func.isRequired,
    setTaskArrayFilter: PropTypes.func.isRequired,
    taskArrayFilter: PropTypes.array.isRequired,
};

export default TaskCards;