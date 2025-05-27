import { ButtonGroup, Dropdown } from "react-bootstrap";

interface FilterTasksButtonProps {
	filterLaterHandle: () => void;
	filterSoonHandle: () => void;
	filterPriorityHandle: (priority: string) => void;
	filterStatusHandle: (status: string) => void;
}

// Props from Home.jsx
const FilterTasksButton = ({
	filterLaterHandle,
	filterSoonHandle,
	filterPriorityHandle,
	filterStatusHandle,
}: FilterTasksButtonProps) => {
	return (
		<Dropdown as={ButtonGroup}>
			<Dropdown.Toggle
				className="d-flex align-items-center text-light fs-6 fw-bold"
				variant="primary"
				id="dropdown-split-basic"
			>
				Filter
			</Dropdown.Toggle>

			<Dropdown.Menu>
				<Dropdown.Item onClick={filterSoonHandle}>Due Soon</Dropdown.Item>
				<Dropdown.Item onClick={filterLaterHandle}>Due Later</Dropdown.Item>
				<Dropdown.Divider />
				{["Urgent", "High", "Medium", "Low"].map((priority) => (
					<Dropdown.Item
						key={priority}
						onClick={() => filterPriorityHandle(priority)}
					>
						{priority}
					</Dropdown.Item>
				))}
				<Dropdown.Divider />
				{["In Progress", "Done", "On Hold", "Cancelled"].map((status) => (
					<Dropdown.Item
						key={status}
						onClick={() => filterStatusHandle(status)}
					>
						{status}
					</Dropdown.Item>
				))}
			</Dropdown.Menu>
		</Dropdown>
	);
};

export default FilterTasksButton;
