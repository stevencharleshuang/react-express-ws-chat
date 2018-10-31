import React from 'react';

export default function(props) {
  return (
    <div className="manual-ping">
      <button className="manual-ping" onClick={props.handleManualPing}>
        Ping SocksServer!
      </button>
    </div>
  );
}