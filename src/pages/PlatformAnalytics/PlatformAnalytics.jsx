import React, { useState } from 'react';
import { Thermometer, Zap, Shield, DollarSign, Calendar } from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { mockAnalytics, mockStorages } from '../../data/mockData';
import PageHeader from '../../components/PageHeader/PageHeader';
import Dropdown from '../../components/Dropdown/Dropdown';
import StatCard from '../../components/StatCard/StatCard';
import ChartCard from '../../components/ChartCard/ChartCard';
import './PlatformAnalytics.css';

const PlatformAnalytics = () => {
  const [hubFilter, setHubFilter] = useState('');
  const [timelineFilter, setTimelineFilter] = useState('6m');

  const COLORS = ['#10b981', '#0ea5e9', '#f59e0b'];

  // Mocked totals based on hub filter
  const getTotals = () => {
    if (hubFilter === 'ST-001') {
      return { temp: '4.2°C', energy: '1,240 kWh', bookings: '18 active', revenue: '$45,200' };
    }
    if (hubFilter === 'ST-002') {
      return { temp: '3.5°C', energy: '2,100 kWh', bookings: '12 active', revenue: '$38,400' };
    }
    return { temp: '3.8°C', energy: '3,460 kWh', bookings: '30 active', revenue: '$92,500' };
  };

  const stats = getTotals();

  return (
    <div className="page-container animate-fade-in">
      <PageHeader
        title="Platform Analytical Audits"
        description="Review historical temperatures, energy loads, revenue sheets, and spatial metrics."
      />

      {/* Interactive Filter row */}
      <div className="analytics-filters-card">
        <Dropdown
          label="Filter by Hub Location"
          value={hubFilter}
          onChange={(e) => setHubFilter(e.target.value)}
          options={mockStorages.map((s) => ({ value: s.id, label: s.name }))}
          placeholder="All Facilities (Combined)"
          className="flex-1"
        />
        <Dropdown
          label="Historical Timeframe"
          value={timelineFilter}
          onChange={(e) => setTimelineFilter(e.target.value)}
          options={[
            { value: '30d', label: 'Last 30 Days' },
            { value: '6m', label: 'Last 6 Months' },
            { value: '1y', label: 'Last 1 Year' }
          ]}
          placeholder=""
        />
      </div>

      {/* Summary KPI grid */}
      <div className="analytics-stat-grid">
        <StatCard
          title="Average Operating Temperature"
          value={stats.temp}
          icon={<Thermometer size={20} />}
          trendValue="Optimal Range"
          trendDirection="up"
          trendLabel="stable cooling"
          theme="blue"
        />
        <StatCard
          title="Total Energy Consumption"
          value={stats.energy}
          icon={<Zap size={20} />}
          trendValue="342 kWh offset"
          trendDirection="down"
          trendLabel="via solar panels"
        />
        <StatCard
          title="Active Space Bookings"
          value={stats.bookings}
          icon={<Shield size={20} />}
          trendValue="94.2% satisfaction"
          trendDirection="up"
          trendLabel="booking ratio"
        />
        <StatCard
          title="Platform Billing Incomes"
          value={stats.revenue}
          icon={<DollarSign size={20} />}
          trendValue="+18.4% growth"
          trendDirection="up"
          trendLabel="vs last quarter"
        />
      </div>

      {/* Detailed charts */}
      <div className="analytics-chart-grid">
        <ChartCard
          title="Chamber Thermal Stabilization"
          description="Continuous 24-hour temperature records across chambers A, B, and C."
        >
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={mockAnalytics.temperatureHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="time" stroke="var(--text-muted)" fontSize={12} />
              <YAxis stroke="var(--text-muted)" fontSize={12} />
              <Tooltip />
              <Legend verticalAlign="top" height={36} />
              <Line type="monotone" dataKey="chamberA" name="Fruits (4°C Target)" stroke="var(--primary)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="chamberB" name="Deep Freeze (-18°C)" stroke="var(--secondary)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="chamberC" name="Vegetables (6°C)" stroke="#f59e0b" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Daily Electricity Usage"
          description="Daily power loads (kWh) alongside utility spending estimates ($)."
        >
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={mockAnalytics.energyUsage} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="day" stroke="var(--text-muted)" fontSize={12} />
              <YAxis stroke="var(--text-muted)" fontSize={12} />
              <Tooltip />
              <Legend verticalAlign="top" height={36} />
              <Bar dataKey="consumption" name="Usage (kWh)" fill="var(--primary)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="cost" name="Spend ($)" fill="var(--secondary)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Facility Load Ratio"
          description="Occupied space trends against global limit thresholds (Jan - Jun)."
        >
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={mockAnalytics.occupancyTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--secondary)" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="var(--secondary)" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="colorOccupied" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={12} />
              <YAxis stroke="var(--text-muted)" fontSize={12} />
              <Tooltip />
              <Area type="monotone" dataKey="total" name="Capacity Limit" stroke="var(--secondary)" fillOpacity={1} fill="url(#colorTotal)" strokeWidth={1} strokeDasharray="5 5" />
              <Area type="monotone" dataKey="occupied" name="Occupied space" stroke="var(--primary)" fillOpacity={1} fill="url(#colorOccupied)" strokeWidth={2.5} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Billing Volume per Hub"
          description="Booking invoices totals broken down by hub facility locations."
        >
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={mockAnalytics.revenueByHub}
                cx="50%"
                cy="50%"
                innerRadius={0}
                outerRadius={80}
                label
                dataKey="value"
              >
                {mockAnalytics.revenueByHub.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
};

export default PlatformAnalytics;
