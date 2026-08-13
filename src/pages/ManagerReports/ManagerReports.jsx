import React from 'react';
import { FileText, Download } from 'lucide-react';
import { mockReports } from '../../data/mockData';
import { useToast } from '../../context/ToastContext';
import PageHeader from '../../components/PageHeader/PageHeader';
import Table from '../../components/Table/Table';
import Badge from '../../components/Badge/Badge';

const ManagerReports = () => {
  const { showToast } = useToast();

  const handleDownload = (report) => {
    showToast(`Downloading '${report.name}' in ${report.type} format (${report.size})...`, 'info');
  };

  const headers = [
    { key: 'id', label: 'Report ID' },
    { key: 'name', label: 'Document Title', sortable: true },
    { key: 'date', label: 'Generation Date', sortable: true },
    { key: 'type', label: 'Format', render: (val) => <Badge status="info">{val}</Badge> },
    { key: 'size', label: 'File Size' },
    { key: 'status', label: 'Audit Status', render: (val) => <Badge status="active">{val}</Badge> }
  ];

  return (
    <div className="page-container animate-fade-in">
      <PageHeader
        title="Audit Performance Logs"
        description="Historical PDF audits, energy reports, compliance sheets, and billing records."
      />

      <Table
        headers={headers}
        data={mockReports}
        actions={[
          {
            type: 'view',
            onClick: handleDownloadReport => handleDownload(handleDownloadReport),
            icon: <Download size={16} />,
            label: 'Download Document'
          }
        ]}
      />
    </div>
  );
};

export default ManagerReports;
