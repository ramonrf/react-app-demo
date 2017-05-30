import React from 'react';

function BoldMoveLabel(props) {
    return (
        <li>
            <button onClick={() => props.onClick(props.move)}>
                <b>{props.descritption}</b>
            </button>
        </li>
    );
}

export default BoldMoveLabel;