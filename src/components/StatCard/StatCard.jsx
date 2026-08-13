import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import './StatCard.css';

const StatCard = ({
  title,
  value,
  icon,
  trendValue,
  trendDirection = 'up',
  trendLabel = 'vs last month',
  theme = 'green'
}) => {
  const isPositive = trendDirection === 'up';

  return (
    <div className="card-premium stat-card">
      <div className="stat-card-header">
        <span className="stat-card-title">{title}</span>
        <div className={`stat-card-icon-wrapper ${theme === 'blue' ? 'cold-theme' : ''}`}>
          {icon}
        </div>
      </div>

      <div className="stat-card-body">
        <span className="stat-card-value">{value}</span>
      </div>

      {trendValue && (
        <div className="stat-card-footer">
          <span className={`stat-card-trend ${isPositive ? 'trend-positive' : 'trend-negative'}`}>
            {isPositive ? <TrendingUp size={14} style={{ marginRight: '0.25rem' }} /> : <TrendingDown size={14} style={{ marginRight: '0.25rem' }} />}
            {trendValue}
          </span>
          <span className="stat-card-trend-label">{trendLabel}</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
