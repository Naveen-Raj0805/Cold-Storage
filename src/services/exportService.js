/**
 * Export Service for AgriFreeze Reports
 * Supports CSV export and Printable PDF generation without third-party dependencies.
 */

// Helper to download CSV string as blob
const downloadCSV = (filename, csvContent) => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Helper for Printable PDF report using browser window print
const printPDFReport = (title, tableHeaders, tableRows) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; color: #333; }
          h2 { color: #10b981; margin-bottom: 5px; }
          p { color: #666; font-size: 14px; margin-top: 0; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 10px; text-align: left; font-size: 13px; }
          th { background-color: #f3f4f6; font-weight: bold; }
          tr:nth-child(even) { background-color: #fafafa; }
          .footer { margin-top: 30px; font-size: 12px; color: #888; text-align: center; }
        </style>
      </head>
      <body>
        <h2>AgriFreeze System Report - ${title}</h2>
        <p>Generated on: ${new Date().toLocaleString()}</p>
        <table>
          <thead>
            <tr>${tableHeaders.map(h => `<th>${h}</th>`).join('')}</tr>
          </thead>
          <tbody>
            ${tableRows.map(row => `<tr>${row.map(cell => `<td>${cell || ''}</td>`).join('')}</tr>`).join('')}
          </tbody>
        </table>
        <div class="footer">AgriFreeze Cold Storage Monitoring & Management System</div>
        <script>
          window.onload = function() { window.print(); };
        </script>
      </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
};

// 1. PRODUCT REPORT
export const exportProductReport = (products = [], format = 'csv') => {
  const headers = ['Product ID', 'Name', 'Type', 'Farmer Name', 'Storage Name', 'Quantity (Tons)', 'Shelf Life (Days)', 'Spoilage Risk', 'Status'];
  
  if (format === 'csv') {
    const rows = products.map(p => [
      p.id,
      `"${p.name}"`,
      `"${p.type || 'General'}"`,
      `"${p.farmerName || p.farmer || 'N/A'}"`,
      `"${p.storageName || p.storage || 'Unassigned'}"`,
      p.quantity || 0,
      p.shelfLife || 0,
      `"${p.spoilageRisk || 'Low'}"`,
      `"${p.status || 'Healthy'}"`
    ]);
    const csvStr = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    downloadCSV(`AgriFreeze_Product_Report_${Date.now()}.csv`, csvStr);
  } else if (format === 'pdf') {
    const rows = products.map(p => [
      p.id,
      p.name,
      p.type || 'General',
      p.farmerName || p.farmer || 'N/A',
      p.storageName || p.storage || 'Unassigned',
      `${p.quantity || 0} Tons`,
      `${p.shelfLife || 0} Days`,
      p.spoilageRisk || 'Low',
      p.status || 'Healthy'
    ]);
    printPDFReport('Product Inventory Report', headers, rows);
  }
};

// 2. STORAGE REPORT
export const exportStorageReport = (storages = [], format = 'csv') => {
  const headers = ['Storage ID', 'Facility Name', 'Location', 'Manager', 'Capacity (Tons)', 'Occupied (Tons)', 'Utilization (%)', 'Status'];
  
  if (format === 'csv') {
    const rows = storages.map(s => {
      const cap = s.capacity || 0;
      const occ = s.occupied || 0;
      const util = cap > 0 ? Math.round((occ / cap) * 100) : 0;
      return [
        s.id,
        `"${s.name}"`,
        `"${s.location || 'N/A'}"`,
        `"${s.manager || 'Unassigned'}"`,
        cap,
        occ,
        `${util}%`,
        `"${s.status || 'Active'}"`
      ];
    });
    const csvStr = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    downloadCSV(`AgriFreeze_Storage_Report_${Date.now()}.csv`, csvStr);
  } else if (format === 'pdf') {
    const rows = storages.map(s => {
      const cap = s.capacity || 0;
      const occ = s.occupied || 0;
      const util = cap > 0 ? Math.round((occ / cap) * 100) : 0;
      return [
        s.id,
        s.name,
        s.location || 'N/A',
        s.manager || 'Unassigned',
        `${cap} Tons`,
        `${occ} Tons`,
        `${util}%`,
        s.status || 'Active'
      ];
    });
    printPDFReport('Cold Storage Facilities Report', headers, rows);
  }
};

// 3. FARMER REPORT
export const exportFarmerReport = (users = [], products = [], format = 'csv') => {
  const farmers = users.filter(u => u.role === 'FARMER' || u.role === 'Farmer');
  const headers = ['Farmer ID', 'Farmer Name', 'Email', 'Phone', 'Total Crops Stored', 'Total Volume (Tons)'];

  if (format === 'csv') {
    const rows = farmers.map(f => {
      const fProducts = products.filter(p => p.farmerId === f.id || String(p.farmerId) === String(f.id) || p.farmerName === f.fullName || p.farmer === f.name);
      const totalVol = fProducts.reduce((sum, p) => sum + Number(p.quantity || 0), 0);
      return [
        f.id,
        `"${f.fullName || f.name}"`,
        `"${f.email || 'N/A'}"`,
        `"${f.phone || 'N/A'}"`,
        fProducts.length,
        totalVol
      ];
    });
    const csvStr = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    downloadCSV(`AgriFreeze_Farmer_Report_${Date.now()}.csv`, csvStr);
  } else if (format === 'pdf') {
    const rows = farmers.map(f => {
      const fProducts = products.filter(p => p.farmerId === f.id || String(p.farmerId) === String(f.id) || p.farmerName === f.fullName || p.farmer === f.name);
      const totalVol = fProducts.reduce((sum, p) => sum + Number(p.quantity || 0), 0);
      return [
        f.id,
        f.fullName || f.name,
        f.email || 'N/A',
        f.phone || 'N/A',
        fProducts.length,
        `${totalVol} Tons`
      ];
    });
    printPDFReport('Farmer Directory & Storage Summary Report', headers, rows);
  }
};
