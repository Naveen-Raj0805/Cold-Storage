import React from 'react';
import Breadcrumb from '../Breadcrumb/Breadcrumb';
import './PageHeader.css';

const PageHeader = ({
  title,
  description,
  breadcrumbs = null,
  action = null
}) => {
  return (
    <header className="page-header-container">
      {breadcrumbs && <Breadcrumb items={breadcrumbs} />}
      <div className="page-header-content-row">
        <div className="page-header-titles">
          <h1 className="page-header-title">{title}</h1>
          {description && <p className="page-header-desc">{description}</p>}
        </div>
        {action && <div className="page-header-action">{action}</div>}
      </div>
    </header>
  );
};

export default PageHeader;
