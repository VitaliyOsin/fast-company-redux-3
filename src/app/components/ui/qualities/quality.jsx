import React from "react";
import PropTypes from "prop-types";
const Quality = ({ qual }) => {
    const { _id, color, name } = qual;
    return (
        <span className={"badge m-1 bg-" + color} key={_id}>
            {name}
        </span>
    );
};
Quality.propTypes = {
    qual: PropTypes.object
};

export default Quality;
