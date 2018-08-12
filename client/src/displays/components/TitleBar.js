import React from 'react';

function TitleBar(props) {
  return (
    <div className = "bottomBordered flexDisplay">
      <div className = "lightlyPadded flexible">
        {props.title}
      </div>
      {Object.keys(props.addresses).map((label) => (
        <div className = "clickable lightlyPadded leftBordered"
          key = {label}
          onClick = {() => props.switchDisplay(props.addresses[label])}>
          {label}
        </div>
      ))}
    </div>
  );
}

export default TitleBar;
