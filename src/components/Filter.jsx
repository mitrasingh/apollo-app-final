import { ButtonGroup, Dropdown } from "react-bootstrap";
import PropTypes from "prop-types";
import styles from "./Filter.module.css";

// Props from Home.jsx
export const Filter = ({ filterNewestHandle, filterOldestHandle, filterPriorityHandle, filterStatusHandle }) => {
  return (
    <>
      <Dropdown as={ButtonGroup}>

        <Dropdown.Toggle
          className={`d-flex align-items-center text-light fs-6 fw-bold ${styles.customBtn}`}
          variant="primary"
          id="dropdown-split-basic"
        >
          Filter
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item onClick={filterNewestHandle}>by Newest</Dropdown.Item>
          <Dropdown.Item onClick={filterOldestHandle}>by Oldest</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item>by Priority Level</Dropdown.Item>
          <Dropdown.Item
            onClick={() => filterPriorityHandle("Urgent")}
          >
            Urgent
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => filterPriorityHandle("High")}
          >
            High
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => filterPriorityHandle("Medium")}
          >
            Medium
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => filterPriorityHandle("Low")}
          >
            Low
          </Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item>
            by Status
          </Dropdown.Item>

          <Dropdown.Item
            onClick={() => filterStatusHandle("In Progress")}
          >
            In Progress
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => filterStatusHandle("Done")}
          >
            Done
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => filterStatusHandle("On Hold")}
          >
            On Hold
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => filterStatusHandle("Cancelled")}
          >
            Cancelled
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
};

Filter.propTypes = {
  filterNewestHandle: PropTypes.func.isRequired,
  filterOldestHandle: PropTypes.func.isRequired,
  filterPriorityHandle: PropTypes.func.isRequired,
  filterStatusHandle: PropTypes.func.isRequired,
};
