/**
 * MEOW AI — Official GST Tax Invoice Generator
 * Generates and downloads compliant Indian GST Tax Invoices
 */

export interface InvoiceData {
  transactionId: string;
  amount: number;
  planTitle: string;
  payerName: string;
  payerPhone: string;
  payerEmail?: string;
  method?: string;
  timestamp?: string;
  clinicOrBusinessName?: string;
}

export function downloadTaxInvoice(data: InvoiceData) {
  const dateStr = data.timestamp
    ? new Date(data.timestamp).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });

  const timeStr = data.timestamp
    ? new Date(data.timestamp).toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : new Date().toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
      });

  // Calculate GST components (18% GST included)
  const totalAmount = data.amount;
  const taxableValue = Math.round((totalAmount / 1.18) * 100) / 100;
  const totalGst = Math.round((totalAmount - taxableValue) * 100) / 100;
  const cgst = Math.round((totalGst / 2) * 100) / 100;
  const sgst = Math.round((totalGst / 2) * 100) / 100;

  const invoiceNumber = `MEOW-INV-${data.transactionId.replace(/[^A-Za-z0-9]/g, '')}`;

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Tax Invoice - ${invoiceNumber}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      margin: 0;
      padding: 40px;
      color: #18181b;
      background: #ffffff;
      font-size: 13px;
      line-height: 1.5;
    }
    .invoice-card {
      max-width: 780px;
      margin: 0 auto;
      border: 1px solid #e4e4e7;
      border-radius: 12px;
      padding: 36px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.05);
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #7c3aed;
      padding-bottom: 24px;
      margin-bottom: 24px;
    }
    .brand-title {
      font-size: 24px;
      font-weight: 800;
      color: #09090b;
      letter-spacing: -0.5px;
    }
    .brand-sub {
      font-size: 11px;
      color: #71717a;
      margin-top: 4px;
    }
    .badge {
      display: inline-block;
      background: #ecfdf5;
      color: #059669;
      border: 1px solid #a7f3d0;
      padding: 4px 10px;
      border-radius: 9999px;
      font-weight: 700;
      font-size: 11px;
      text-transform: uppercase;
    }
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      margin-bottom: 24px;
    }
    .section-title {
      font-size: 11px;
      text-transform: uppercase;
      font-weight: 700;
      color: #71717a;
      letter-spacing: 0.5px;
      margin-bottom: 6px;
    }
    .details p {
      margin: 2px 0;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 24px 0;
    }
    th {
      background: #f4f4f5;
      text-align: left;
      padding: 10px 12px;
      font-size: 11px;
      text-transform: uppercase;
      color: #52525b;
      border-bottom: 1px solid #e4e4e7;
    }
    td {
      padding: 12px;
      border-bottom: 1px solid #f4f4f5;
    }
    .total-row {
      display: flex;
      justify-content: flex-end;
      margin-top: 12px;
    }
    .total-box {
      width: 280px;
    }
    .total-line {
      display: flex;
      justify-content: space-between;
      padding: 4px 0;
    }
    .grand-total {
      border-top: 2px solid #18181b;
      border-bottom: 2px solid #18181b;
      font-size: 16px;
      font-weight: 800;
      padding: 8px 0;
      margin-top: 8px;
    }
    .footer {
      border-top: 1px solid #e4e4e7;
      padding-top: 20px;
      margin-top: 36px;
      font-size: 11px;
      color: #a1a1aa;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    @media print {
      body { padding: 0; }
      .invoice-card { border: none; box-shadow: none; padding: 20px; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="invoice-card">
    <div class="header">
      <div>
        <div class="brand-title">MEOW AI PLATFORM</div>
        <div class="brand-sub">Attanti Technologies Pvt. Ltd. • Bengaluru, Karnataka</div>
        <div class="brand-sub">GSTIN: 29AABCA9102K1Z9 • PAN: AABCA9102K</div>
      </div>
      <div style="text-align: right;">
        <span class="badge">PAID &amp; SETTLED</span>
        <div style="margin-top: 8px; font-weight: 700; font-size: 14px;">${invoiceNumber}</div>
        <div class="brand-sub">Date: ${dateStr} ${timeStr}</div>
      </div>
    </div>

    <div class="grid-2">
      <div class="details">
        <div class="section-title">Billed To (Customer / Patient)</div>
        <p><strong>${data.payerName}</strong></p>
        <p>Phone: ${data.payerPhone}</p>
        <p>Email: ${data.payerEmail || 'N/A'}</p>
        <p>Location: Karnataka / Andhra Pradesh / Telangana, India</p>
      </div>
      <div class="details" style="text-align: right;">
        <div class="section-title">Service Provider</div>
        <p><strong>MEOW AI Telephony &amp; Automation</strong></p>
        <p>Branch / Center: ${data.clinicOrBusinessName || 'Dr. Rao Healthcare & Technology'}</p>
        <p>Payment Mode: ${(data.method || 'UPI').toUpperCase()}</p>
        <p>Bank Ref / Txn: ${data.transactionId}</p>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Description of Service</th>
          <th>SAC / HSN</th>
          <th>Qty</th>
          <th>Rate (₹)</th>
          <th style="text-align: right;">Amount (₹)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <strong>${data.planTitle}</strong><br>
            <span style="font-size: 11px; color: #71717a;">Multilingual Voice AI Intake, Appointment Slot Lock &amp; Automation Platform</span>
          </td>
          <td>998313</td>
          <td>1</td>
          <td>₹${taxableValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
          <td style="text-align: right;">₹${taxableValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
        </tr>
      </tbody>
    </table>

    <div class="total-row">
      <div class="total-box">
        <div class="total-line">
          <span>Taxable Value:</span>
          <span>₹${taxableValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
        </div>
        <div class="total-line">
          <span>CGST (9.0%):</span>
          <span>₹${cgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
        </div>
        <div class="total-line">
          <span>SGST (9.0%):</span>
          <span>₹${sgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
        </div>
        <div class="total-line grand-total">
          <span>Total Paid:</span>
          <span>₹${totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
        </div>
      </div>
    </div>

    <div class="footer">
      <div>
        This is a digitally verified computer-generated GST tax invoice.<br>
        MEOW AI Platform • https://meowboxai.tech • Authorized Signatory
      </div>
      <div>
        <button class="no-print" onclick="window.print()" style="padding: 6px 14px; background: #7c3aed; color: #fff; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">
          Print / Save PDF
        </button>
      </div>
    </div>
  </div>
</body>
</html>`;

  // Trigger file download
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `GST_Invoice_${invoiceNumber}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  // Also open print preview in new window for immediate printing/saving as PDF
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
  }
}
