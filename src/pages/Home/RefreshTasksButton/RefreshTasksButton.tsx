import { Button } from "react-bootstrap";

interface RefreshTasksButtonProps {
	refreshTasksHandle: () => void;
	isClearFilterDisplayed: boolean;
}

// Props from Home.jsx
const RefreshTasksButton = ({
	refreshTasksHandle,
	isClearFilterDisplayed,
}: RefreshTasksButtonProps) => {
	return (
		<>
			<Button
				className="d-flex align-items-center text-light fs-6 fw-bold"
				variant="primary"
				onClick={refreshTasksHandle}
			>
				{isClearFilterDisplayed ? "Clear Filters" : "Refresh Tasks"}
			</Button>
		</>
	);
};

export default RefreshTasksButton;
