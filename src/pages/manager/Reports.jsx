import React, { useState, useEffect } from 'react';
import { Plus, FileText, Download, Play, Mail } from 'lucide-react';
import DataTable from '../../components/DataTable/DataTable';
import Badge from '../../components/Badge/Badge';
import Button from '../../components/Button/Button';
import Modal from '../../components/Modal/Modal';
import { getReports, saveReports } from '../../services/mockData';

const ManagerReports = () => {
  const [reports, setReports] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form Fields
  const [title, setTitle] = useState('');
  const [type, setType] = useState('Utilization');
  const [format, setFormat] = useState('PDF');
  const [frequency, setFrequency] = useState('Weekly');
  const [recipient, setRecipient] = useState('sarah.c@agrifreeze.com');

  useEffect(() => {
    setReports(getReports());
  }, []);

  const handleCreateReport = (e) => {
    e.preventDefault();
    const newReport = {
      id: `REP-${Math.floor(100 + Math.random() * 900)}`,
      title,
      type,
      format,
      frequency,
      recipient,
      lastGenerated: new Date().toISOString().split('T')[0]
    };
    
    const updated = [newReport, ...reports];
    setReports(updated);
    saveReports(updated);
    setIsModalOpen(false);

    setTitle('');
  };

  const handleRunReport = (reportTitle) => {
    alert(`Running automated audit task: "${reportTitle}". Document package has been generated and dispatched to the recipient.`);
  };

  const columns = [
    { header: 'ID', accessor: 'id' },
    { 
      header: 'Report Title', 
      accessor: 'title',
      render: (val) => <span className="text-semibold">{val}</span>
    },
    { header: 'Metric Category', accessor: 'type' },
    { 
      header: 'Frequency', 
      accessor: 'frequency',
      render: (val) => <Badge status={val === 'Daily' ? 'Warning' : val === 'Weekly' ? 'Info' : 'Optimal'} />
    },
    { header: 'File Format', accessor: 'format' },
    { 
      header: 'Dispatch Address', 
      accessor: 'recipient',
      render: (val) => (
        <span className="d-flex align-center gap-xs" style={{ fontSize: '13px' }}>
          <Mail size={13} className="text-secondary-color" />
          {val}
        </span>
      )
    },
    { header: 'Last Generated', accessor: 'lastGenerated' },
    {
      header: 'Actions',
      accessor: 'id',
      align: 'right',
      render: (id, row) => (
        <div className="d-flex gap-xs justify-center">
          <Button 
            variant="secondary" 
            size="small" 
            icon={Play}
            onClick={() => handleRunReport(row.title)}
          >
            Run Now
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="d-flex flex-column gap-lg">
      <div className="d-flex align-center justify-between flex-wrap gap-md">
        <div>
          <h2 className="text-bold" style={{ fontSize: '22px' }}>Operational Reports & Compliance Logs</h2>
          <p className="text-secondary-color" style={{ fontSize: '14px' }}>
            Configure automatic climate log generation and email dispatch policies
          </p>
        </div>
        <Button variant="primary" icon={Plus} onClick={() => setIsModalOpen(true)}>
          Create Schedule
        </Button>
      </div>

      <DataTable 
        columns={columns}
        data={reports}
        itemsPerPage={10}
      />

      {/* New Schedule Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Schedule Automated Operational Audit"
        footerActions={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCreateReport}>
              Save Schedule
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreateReport} className="d-flex flex-column gap-md">
          <div className="form-group">
            <label htmlFor="rep-title">Report Title</label>
            <input 
              id="rep-title"
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="e.g. Weekly Zone A Temperature Log" 
              required
              className="login-input"
              style={{ paddingLeft: '14px', height: '42px' }}
            />
          </div>

          <div className="d-grid grid-cols-2 gap-md">
            <div className="form-group">
              <label htmlFor="rep-type">Report Category</label>
              <select 
                id="rep-type"
                value={type} 
                onChange={(e) => setType(e.target.value)}
                className="login-select"
                style={{ paddingLeft: '14px', height: '42px' }}
              >
                <option value="Utilization">Utilization Summary</option>
                <option value="Temperature Log">Temperature Logs</option>
                <option value="Audit">Safety compliance Audit</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="rep-format">Document Format</label>
              <select 
                id="rep-format"
                value={format} 
                onChange={(e) => setFormat(e.target.value)}
                className="login-select"
                style={{ paddingLeft: '14px', height: '42px' }}
              >
                <option value="PDF">PDF document</option>
                <option value="Excel">Microsoft Excel (XLSX)</option>
                <option value="CSV">Comma Separated Values</option>
              </select>
            </div>
          </div>

          <div className="d-grid grid-cols-2 gap-md">
            <div className="form-group">
              <label htmlFor="rep-freq">Dispatch Frequency</label>
              <select 
                id="rep-freq"
                value={frequency} 
                onChange={(e) => setFrequency(e.target.value)}
                className="login-select"
                style={{ paddingLeft: '14px', height: '42px' }}
              >
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="rep-email">Recipient Email Address</label>
              <input 
                id="rep-email"
                type="email" 
                value={recipient} 
                onChange={(e) => setRecipient(e.target.value)} 
                required
                className="login-input"
                style={{ paddingLeft: '14px', height: '42px' }}
              />
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManagerReports;
