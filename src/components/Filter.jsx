import { ButtonGroup, Dropdown } from "react-bootstrap";
import PropTypes from "prop-types";

// Props from Home.jsx
const Filter = ({ filterLaterHandle, filterSoonHandle, filterPriorityHandle, filterStatusHandle }) => {
  return (
    <>
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
          <Dropdown.Item onClick={() => filterPriorityHandle("Urgent")}>Urgent</Dropdown.Item>
          <Dropdown.Item onClick={() => filterPriorityHandle("High")}>High</Dropdown.Item>
          <Dropdown.Item onClick={() => filterPriorityHandle("Medium")}>Medium</Dropdown.Item>
          <Dropdown.Item onClick={() => filterPriorityHandle("Low")}>Low</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item onClick={() => filterStatusHandle("In Progress")}>In Progress</Dropdown.Item>
          <Dropdown.Item onClick={() => filterStatusHandle("Done")}>Done</Dropdown.Item>
          <Dropdown.Item onClick={() => filterStatusHandle("On Hold")}>On Hold</Dropdown.Item>
          <Dropdown.Item onClick={() => filterStatusHandle("Cancelled")}>Cancelled</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
};

Filter.propTypes = {
  filterLaterHandle: PropTypes.func.isRequired,
  filterSoonHandle: PropTypes.func.isRequired,
  filterPriorityHandle: PropTypes.func.isRequired,
  filterStatusHandle: PropTypes.func.isRequired,
};

export default Filter;