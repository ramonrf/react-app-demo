import React from 'react';

function MoveLabel(props) {
  return (
    <li>
      <button onClick={() => props.onClick(props.move)}>{props.descritption}</button>
    </li>
  );
}

export default MoveLabel;