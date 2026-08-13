import React from 'react';
import './ChartCard.css';

const ChartCard = ({ title, description, action = null, children }) => {
  return (
    <div className="card-premium chart-card">
      <div className="chart-card-header">
        <div className="chart-card-titles">
          <h3 className="chart-card-title">{title}</h3>
          {description && <p className="chart-card-desc">{description}</p>}
        </div>
        {action && <div className="chart-card-action">{action}</div>}
      </div>
      <div className="chart-card-body">{children}</div>
    </div>
  );
};

export default ChartCard;
