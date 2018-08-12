import React from 'react';

function ButtonBar(props) {
  return (
    <div className = "flexDisplay">
      {Object.keys(props.actions).map((label) => (
        <div className = "clickable button"
          key = {label}
          onClick = {() => props.attempt(props.actions[label])}>
          {label}
        </div>
      ))}
    </div>
  );
}

export default ButtonBar;
