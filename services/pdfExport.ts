import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Job, StaffMember } from './storage';
import { LOGO_URL } from '../constants/config';

const formatDate = (d: string) => {
  if (!d) return '';
  return new Date(d).toLocaleDateString('en-GB');
};

const formatMMK = (v: string) => {
  const n = parseFloat(v || '0');
  return isNaN(n) ? '0' : n.toLocaleString() + ' MMK';
};

export const exportWeeklyJobsPDF = async (jobs: Job[], staffList: StaffMember[], fromDate: Date, toDate: Date): Promise<void> => {
  const from = new Date(fromDate); from.setHours(0,0,0,0);
  const to = new Date(toDate); to.setHours(23,59,59,999);

  const filtered = jobs.filter(j => {
    const d = new Date(j.date);
    return d >= from && d <= to;
  });

  const done = filtered.filter(j => j.status === 'Done').length;
  const pending = filtered.filter(j => j.status === 'Pending').length;
  const totalCost = filtered.reduce((sum, j) => sum + parseFloat(j.cost || '0'), 0);

  const getStaffNames = (ids: string[]) =>
    ids.map(id => staffList.find(s => s.id === id)?.name || id).join(', ');

  const rows = filtered.map((j, i) => `
    <tr style="background:${i % 2 === 0 ? '#f9fffe' : '#ffffff'}">
      <td>${i + 1}</td>
      <td>${formatDate(j.date)}</td>
      <td><strong>${j.customerName}</strong><br/><small>${j.customerPhone}</small></td>
      <td>${j.address}</td>
      <td>${j.deviceType}</td>
      <td>${j.acBrand || '-'} ${j.acHP ? j.acHP + ' HP' : ''}</td>
      <td>${j.problemDescription}</td>
      <td>${getStaffNames(j.assignedStaff)}</td>
      <td><span style="color:${j.status === 'Done' ? '#2E7D32' : '#F57C00'};font-weight:bold">${j.status}</span></td>
      <td style="text-align:right">${formatMMK(j.cost)}</td>
    </tr>
  `).join('');

  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8"/>
    <style>
      * { margin:0; padding:0; box-sizing:border-box; }
      body { font-family: 'Helvetica Neue', Arial, sans-serif; color:#1A1A1A; padding:20px; font-size:11px; }
      .header { display:flex; align-items:center; gap:16px; border-bottom:3px solid #2E7D32; padding-bottom:16px; margin-bottom:20px; }
      .logo { width:70px; height:70px; border-radius:50%; object-fit:cover; }
      .company { flex:1; }
      .company h1 { font-size:18px; color:#2E7D32; font-weight:700; }
      .company p { color:#546E7A; font-size:11px; margin-top:2px; }
      .report-title { text-align:center; margin-bottom:16px; }
      .report-title h2 { font-size:16px; color:#1B5E20; }
      .report-title p { color:#546E7A; font-size:11px; margin-top:4px; }
      .summary { display:flex; gap:12px; margin-bottom:20px; }
      .summary-card { flex:1; background:#E8F5E9; border-radius:8px; padding:12px; text-align:center; border-left:4px solid #2E7D32; }
      .summary-card.pending { background:#FFF8E1; border-left-color:#F57C00; }
      .summary-card.total { background:#E3F2FD; border-left-color:#1976D2; }
      .summary-card h3 { font-size:20px; font-weight:700; }
      .summary-card p { font-size:10px; color:#546E7A; margin-top:2px; }
      table { width:100%; border-collapse:collapse; margin-bottom:20px; }
      th { background:#2E7D32; color:white; padding:8px 6px; text-align:left; font-size:10px; }
      td { padding:7px 6px; border-bottom:1px solid #E8F5E9; font-size:10px; vertical-align:top; }
      .footer { text-align:center; color:#90A4AE; font-size:9px; border-top:1px solid #E0E0E0; padding-top:10px; margin-top:10px; }
    </style>
  </head>
  <body>
    <div class="header">
      <img class="logo" src="${LOGO_URL}" />
      <div class="company">
        <h1>Ko Htay Aung (Oasis) Air-Con Co., Ltd.</h1>
        <p>Air Conditioner Sales, Service & Repair — Since 2000</p>
      </div>
    </div>
    <div class="report-title">
      <h2>Weekly Job Report</h2>
      <p>${formatDate(fromDate.toISOString())} — ${formatDate(toDate.toISOString())}</p>
    </div>
    <div class="summary">
      <div class="summary-card">
        <h3>${done}</h3><p>Done</p>
      </div>
      <div class="summary-card pending">
        <h3>${pending}</h3><p>Pending</p>
      </div>
      <div class="summary-card total">
        <h3>${filtered.length}</h3><p>Total Jobs</p>
      </div>
      <div class="summary-card total">
        <h3>${totalCost.toLocaleString()}</h3><p>Total MMK</p>
      </div>
    </div>
    <table>
      <thead>
        <tr>
          <th>#</th><th>Date</th><th>Customer</th><th>Address</th><th>Device</th><th>Brand/HP</th><th>Problem</th><th>Staff</th><th>Status</th><th>Cost</th>
        </tr>
      </thead>
      <tbody>${rows || '<tr><td colspan="10" style="text-align:center;padding:20px;color:#90A4AE">No jobs found for this period</td></tr>'}</tbody>
    </table>
    <div class="footer">
      <p>Generated on ${new Date().toLocaleString()} | Ko Htay Aung (Oasis) Air-Con Co., Ltd. | App Developer: Zwe Maung Maung</p>
    </div>
  </body>
  </html>
  `;

  const { uri } = await Print.printToFileAsync({ html, base64: false });
  await Sharing.shareAsync(uri, { mimeType: 'application/pdf', dialogTitle: 'Export Weekly Report' });
};
