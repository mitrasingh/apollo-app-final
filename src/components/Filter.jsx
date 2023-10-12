import { Button, ButtonGroup, Container, Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

// Props from Home.jsx
export const Filter = ({ filterNewestHandle, filterOldestHandle, filterPriorityHandle, filterStatusHandle }) => {
  return (
    <Container>
      <Dropdown as={ButtonGroup}>
        <Button
          style={{ fontSize: "9px", maxHeight: "20px" }}
          className="d-flex align-items-center"
          variant="dark"
        >
          Filter
        </Button>

        <Dropdown.Toggle
          style={{ maxHeight: "20px" }}
          className="d-flex align-items-center"
          split
          variant="dark"
          id="dropdown-split-basic"
        />

        <Dropdown.Menu style={{ fontSize: "10px" }}>
          <Dropdown.Item onClick={filterNewestHandle}>by Newest</Dropdown.Item>
          <Dropdown.Item onClick={filterOldestHandle}>by Oldest</Dropdown.Item>
          <Dropdown.Item>by Priority Level</Dropdown.Item>
          <Dropdown.Item
            onClick={() => filterPriorityHandle("Urgent")}
            className="ms-3"
          >
            Urgent
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => filterPriorityHandle("High")}
            className="ms-3"
          >
            High
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => filterPriorityHandle("Medium")}
            className="ms-3"
          >
            Medium
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => filterPriorityHandle("Low")}
            className="ms-3"
          >
            Low
          </Dropdown.Item>
          <Dropdown.Item as={Link} to="">
            by Status
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => filterStatusHandle("In Progress")}
            className="ms-3"
          >
            In Progress
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => filterStatusHandle("Done")}
            className="ms-3"
          >
            Done
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => filterStatusHandle("On Hold")}
            className="ms-3"
          >
            On Hold
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => filterStatusHandle("Cancelled")}
            className="ms-3"
          >
            Cancelled
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </Container>
  );
};

Filter.propTypes = {
  filterNewestHandle: PropTypes.func.isRequired,
  filterOldestHandle: PropTypes.func.isRequired,
  filterPriorityHandle: PropTypes.func.isRequired,
  filterStatusHandle: PropTypes.func.isRequired,
};
