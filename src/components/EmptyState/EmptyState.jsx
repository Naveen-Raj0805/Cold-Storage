import React from 'react';
import { HelpCircle } from 'lucide-react';
import './EmptyState.css';

const EmptyState = ({
  icon = <HelpCircle size={32} />,
  title = 'No Data Available',
  description = 'There are no records to display at this time.',
  action = null
}) => {
  return (
    <div className="empty-state-container">
      <div className="empty-state-icon-wrapper">{icon}</div>
      <div className="empty-state-info">
        <h3 className="empty-state-title">{title}</h3>
        <p className="empty-state-desc">{description}</p>
      </div>
      {action && <div className="empty-state-action">{action}</div>}
    </div>
  );
};

export default EmptyState;
