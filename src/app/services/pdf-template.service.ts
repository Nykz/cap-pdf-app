import { Injectable } from '@angular/core';
import { DocumentData, TemplateType, TemplateMeta } from '../interfaces/pdf.interface';

@Injectable({
  providedIn: 'root',
})
export class PdfTemplateService {
  readonly templates: TemplateMeta[] = [
    {
      id: 'invoice',
      name: 'Modern Invoice',
      category: 'Billing',
      description: 'Clean financial layout with metadata grid, deliverable list, & automatic tax calculations.',
      icon: 'receipt-outline',
      accentColor: '#6366f1',
      badge: 'POPULAR',
    },
    {
      id: 'certificate',
      name: 'Certificate of Excellence',
      category: 'Recognition',
      description: 'Luxurious bordered certificate with golden seal and verification details.',
      icon: 'ribbon-outline',
      accentColor: '#f59e0b',
      badge: 'LUXURY',
    },
    {
      id: 'report',
      name: 'Executive Project Brief',
      category: 'Business',
      description: 'Corporate report layout with executive scope summary & formatted project deliverables.',
      icon: 'document-text-outline',
      accentColor: '#10b981',
      badge: 'BUSINESS',
    },
    {
      id: 'receipt',
      name: 'Store & Agency Receipt',
      category: 'Sales',
      description: 'Compact transaction breakdown with itemized list and instant payment confirmation.',
      icon: 'card-outline',
      accentColor: '#ec4899',
      badge: 'FAST',
    },
  ];

  getTemplateMeta(type: TemplateType): TemplateMeta {
    return this.templates.find((t) => t.id === type) || this.templates[0];
  }

  generateHtml(data: DocumentData, templateType: TemplateType = 'invoice'): string {
    switch (templateType) {
      case 'certificate':
        return this.renderCertificateTemplate(data);
      case 'report':
        return this.renderReportTemplate(data);
      case 'receipt':
        return this.renderReceiptTemplate(data);
      case 'invoice':
      default:
        return this.renderInvoiceTemplate(data);
    }
  }

  private getBaseStyles(): string {
    return `
      @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
      
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }

      body {
        font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
        color: #0f172a;
        background-color: #ffffff;
        line-height: 1.5;
        padding: 32px 32px 80px 32px;
        -webkit-font-smoothing: antialiased;
      }

      .container {
        width: 100%;
        max-width: 800px;
        margin: 0 auto;
        padding-bottom: 40px;
      }

      @media (max-width: 600px) {
        body {
          padding: 16px 16px 60px 16px !important;
        }
        .container {
          width: 100% !important;
          padding-bottom: 30px !important;
        }
        .header-banner {
          flex-direction: column !important;
          gap: 16px !important;
          padding: 20px 16px !important;
          align-items: flex-start !important;
        }
        .white-meta-badge {
          width: 100% !important;
          text-align: left !important;
        }
        .totals-section {
          justify-content: stretch !important;
        }
        .totals-box {
          width: 100% !important;
        }
        .table-container {
          overflow-x: auto !important;
          -webkit-overflow-scrolling: touch;
        }
      }
    `;
  }

  private calculateTotals(data: DocumentData) {
    const subtotal = data.items.reduce((acc, item) => acc + item.quantity * item.rate, 0);
    const taxAmount = (subtotal * (data.taxRatePercent || 0)) / 100;
    const discountAmount = (subtotal * (data.discountPercent || 0)) / 100;
    const total = Math.max(0, subtotal + taxAmount - discountAmount);
    return { subtotal, taxAmount, discountAmount, total };
  }

  private renderInvoiceTemplate(data: DocumentData): string {
    const { subtotal, taxAmount, discountAmount, total } = this.calculateTotals(data);

    const itemsHtml = data.items
      .map(
        (item, idx) => `
        <tr style="background-color: ${idx % 2 === 0 ? '#ffffff' : '#f8fafc'};">
          <td style="padding: 14px 16px; font-weight: 600; border-bottom: 1px solid #f1f5f9; color: #1e293b;">${item.description}</td>
          <td style="padding: 14px 16px; text-align: center; border-bottom: 1px solid #f1f5f9; color: #475569; font-weight: 600;">${item.quantity}</td>
          <td style="padding: 14px 16px; text-align: right; border-bottom: 1px solid #f1f5f9; color: #475569; font-weight: 600;">${data.currencySymbol}${item.rate.toFixed(2)}</td>
          <td style="padding: 14px 16px; text-align: right; border-bottom: 1px solid #f1f5f9; font-weight: 800; color: #0f172a;">${data.currencySymbol}${(item.quantity * item.rate).toFixed(2)}</td>
        </tr>
      `
      )
      .join('');

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${data.title || 'Invoice'}</title>
        <style>
          ${this.getBaseStyles()}
          
          .header-banner {
            background: linear-gradient(135deg, #4338ca 0%, #6366f1 100%);
            border-radius: 16px;
            padding: 24px 28px;
            color: #ffffff;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 24px;
            box-shadow: 0 10px 25px -5px rgba(67, 56, 202, 0.3);
          }

          .brand-title {
            font-size: 24px;
            font-weight: 800;
            letter-spacing: -0.5px;
            line-height: 1.2;
          }

          .brand-tagline {
            font-size: 13px;
            opacity: 0.9;
            margin-top: 4px;
          }

          .white-meta-badge {
            background: #ffffff;
            border-radius: 12px;
            padding: 10px 16px;
            text-align: right;
            color: #1e1b4b;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            min-width: 140px;
          }

          .badge-type {
            font-size: 10px;
            font-weight: 800;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.8px;
          }

          .badge-num {
            font-size: 14px;
            font-weight: 800;
            color: #1e1b4b;
            margin: 2px 0;
          }

          .badge-date {
            font-size: 11px;
            font-weight: 600;
            color: #475569;
          }

          .meta-card {
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 14px;
            padding: 20px 24px;
            margin-bottom: 24px;
            display: flex;
            flex-direction: column;
            gap: 16px;
          }

          .meta-label {
            font-size: 11px;
            font-weight: 800;
            text-transform: uppercase;
            color: #64748b;
            letter-spacing: 0.6px;
            margin-bottom: 4px;
          }

          .meta-val-primary {
            font-size: 15px;
            font-weight: 800;
            color: #0f172a;
          }

          .meta-val-sub {
            font-size: 13px;
            color: #64748b;
            margin-top: 2px;
          }

          .status-pill {
            display: inline-block;
            background-color: #dcfce7;
            color: #15803d;
            font-weight: 800;
            font-size: 10px;
            padding: 4px 10px;
            border-radius: 9999px;
            letter-spacing: 0.5px;
          }

          .table-container {
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            overflow: hidden;
            margin-bottom: 24px;
          }

          table {
            width: 100%;
            border-collapse: collapse;
          }

          th {
            background: #4338ca;
            color: #ffffff;
            text-align: left;
            padding: 12px 16px;
            font-size: 11px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.8px;
          }

          .totals-section {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 24px;
          }

          .totals-box {
            width: 280px;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 16px 20px;
          }

          .totals-row {
            display: flex;
            justify-content: space-between;
            padding: 6px 0;
            font-size: 13px;
            color: #475569;
            font-weight: 600;
          }

          .totals-row.grand-total {
            border-top: 1px dashed #cbd5e1;
            margin-top: 8px;
            padding-top: 10px;
            font-size: 16px;
            font-weight: 800;

            .total-due-label {
              color: #4338ca;
              font-weight: 800;
            }

            .total-due-amount {
              color: #4338ca;
              font-weight: 800;
              font-size: 18px;
            }
          }

          .notes-callout {
            background: #eff6ff;
            border-left: 4px solid #3b82f6;
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 28px;

            .notes-title {
              font-size: 12px;
              font-weight: 800;
              color: #1e3a8a;
              margin-bottom: 4px;
            }

            .notes-body {
              font-size: 12px;
              color: #3b82f6;
              line-height: 1.4;
            }
          }

          .footer {
            text-align: center;
            font-size: 11px;
            color: #64748b;
            font-weight: 600;
            border-top: 1px dashed #cbd5e1;
            padding-top: 16px;
            margin-top: 28px;
            margin-bottom: 30px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header-banner">
            <div>
              <div class="brand-title">${data.companyName || 'Capawesom Digital Agency'}</div>
              <div class="brand-tagline">${data.companyTagline || 'Capawesome PDF Studio Suite'}</div>
            </div>
            <div class="white-meta-badge">
              <div class="badge-type">${data.title ? 'INVOICE' : 'INVOICE'}</div>
              <div class="badge-num">#${data.invoiceNumber || 'INV-2026-904'}</div>
              <div class="badge-date">Date: ${data.date || '21/07/2026'}</div>
            </div>
          </div>

          <div class="meta-card">
            <div>
              <div class="meta-label">BILLED TO</div>
              <div class="meta-val-primary">${data.clientName || 'Acme Corporation'}</div>
              ${data.clientEmail ? `<div class="meta-val-sub">${data.clientEmail}</div>` : ''}
            </div>

            <div>
              <div class="meta-label">PROJECT SCOPE</div>
              <div class="meta-val-primary">${data.title || 'Mobile Application Development'}</div>
              <div class="meta-val-sub">Ref: #${data.invoiceNumber || 'INV-2026-904'}</div>
            </div>

            <div>
              <div class="meta-label">PAYMENT STATUS</div>
              <div class="status-pill">READY FOR PAYMENT</div>
            </div>
          </div>

          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>DESCRIPTION</th>
                  <th style="text-align: center;">QTY</th>
                  <th style="text-align: right;">PRICE</th>
                  <th style="text-align: right;">TOTAL</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>
          </div>

          <div class="totals-section">
            <div class="totals-box">
              <div class="totals-row">
                <span>Subtotal</span>
                <span>${data.currencySymbol}${subtotal.toFixed(2)}</span>
              </div>
              ${
                data.taxRatePercent
                  ? `<div class="totals-row">
                      <span>Tax (${data.taxRatePercent}%)</span>
                      <span>+${data.currencySymbol}${taxAmount.toFixed(2)}</span>
                    </div>`
                  : ''
              }
              ${
                data.discountPercent
                  ? `<div class="totals-row">
                      <span>Discount (${data.discountPercent}%)</span>
                      <span>-${data.currencySymbol}${discountAmount.toFixed(2)}</span>
                    </div>`
                  : ''
              }
              <div class="totals-row grand-total">
                <span class="total-due-label">Total Due</span>
                <span class="total-due-amount">${data.currencySymbol}${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div class="notes-callout">
            <div class="notes-title">Notes & Payment Instructions</div>
            <div class="notes-body">
              ${data.notes || 'Thank you for choosing Capawesome. Payment is due within 14 days.'}
            </div>
          </div>

          <div class="footer">
            Generated with Capawesome Capacitor PDF Generator & Viewer • Thank you for your business!
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private renderCertificateTemplate(data: DocumentData): string {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Certificate of Excellence</title>
        <style>
          ${this.getBaseStyles()}
          body {
            background-color: #fffbeb;
            padding: 30px;
          }
          .cert-border {
            border: 12px double #d97706;
            padding: 40px;
            border-radius: 12px;
            background: #ffffff;
            text-align: center;
            box-shadow: 0 10px 30px rgba(217, 119, 6, 0.15);
          }
          .cert-title {
            font-size: 32px;
            font-weight: 800;
            color: #b45309;
            text-transform: uppercase;
            letter-spacing: 2px;
            margin-bottom: 8px;
          }
          .cert-subtitle {
            font-size: 14px;
            color: #78350f;
            text-transform: uppercase;
            letter-spacing: 3px;
            margin-bottom: 30px;
          }
          .cert-recipient {
            font-size: 36px;
            font-weight: 800;
            color: #0f172a;
            border-bottom: 2px solid #f59e0b;
            display: inline-block;
            padding: 0 20px 8px 20px;
            margin-bottom: 24px;
            max-width: 100%;
            word-wrap: break-word;
          }
          .cert-body {
            font-size: 16px;
            color: #475569;
            max-width: 600px;
            margin: 0 auto 40px auto;
          }
          .seal-container {
            display: flex;
            justify-content: space-around;
            align-items: center;
            margin-top: 40px;
            gap: 16px;
          }
          .gold-seal {
            width: 90px;
            height: 90px;
            background: radial-gradient(circle, #f59e0b 0%, #b45309 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ffffff;
            font-weight: 800;
            font-size: 12px;
            box-shadow: 0 6px 15px rgba(180, 83, 9, 0.4);
            text-transform: uppercase;
            flex-shrink: 0;
          }
          .sig-line {
            border-top: 1px solid #94a3b8;
            width: 180px;
            padding-top: 8px;
            font-size: 13px;
            font-weight: 600;
            color: #334155;
          }

          @media (max-width: 600px) {
            body {
              padding: 16px !important;
            }
            .cert-border {
              padding: 24px 16px !important;
              border-width: 6px !important;
            }
            .cert-title {
              font-size: 22px !important;
              letter-spacing: 1px !important;
            }
            .cert-subtitle {
              font-size: 11px !important;
              margin-bottom: 16px !important;
            }
            .cert-recipient {
              font-size: 26px !important;
              padding: 0 10px 4px 10px !important;
              margin-bottom: 16px !important;
            }
            .cert-body {
              font-size: 13px !important;
              margin-bottom: 24px !important;
            }
            .seal-container {
              flex-direction: column !important;
              gap: 24px !important;
              margin-top: 24px !important;
            }
            .sig-line {
              width: 150px !important;
            }
          }
        </style>
      </head>
      <body>
        <div class="cert-border">
          <div class="cert-title">${data.title || 'Certificate of Achievement'}</div>
          <div class="cert-subtitle">PROUDLY PRESENTED TO</div>
          <div class="cert-recipient">${data.clientName || 'John Doe'}</div>
          <div class="cert-body">
            For outstanding execution and exceptional contribution to <strong>${data.serviceDescription || 'Executive Project Deliverables'}</strong>.
            Issued on <strong>${data.date || 'Today'}</strong> by ${data.companyName || 'CapStudio Authority'}.
          </div>

          <div class="seal-container">
            <div>
              <div class="sig-line">${data.companyName || 'Authorized Signatory'}</div>
            </div>
            <div class="gold-seal">VERIFIED</div>
            <div>
              <div class="sig-line">Date: ${data.date || 'Today'}</div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private renderReportTemplate(data: DocumentData): string {
    const { subtotal } = this.calculateTotals(data);
    const itemsList = data.items
      .map(
        (item) => `
        <div style="padding: 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 8px; display: flex; justify-content: space-between;">
          <div>
            <strong style="color: #0f172a;">${item.description}</strong>
            <div style="font-size: 12px; color: #64748b;">Qty: ${item.quantity} × ${data.currencySymbol}${item.rate}</div>
          </div>
          <div style="font-weight: 700; color: #10b981;">${data.currencySymbol}${(item.quantity * item.rate).toFixed(2)}</div>
        </div>
      `
      )
      .join('');

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Executive Project Brief</title>
        <style>
          ${this.getBaseStyles()}
          .header {
            border-bottom: 3px solid #10b981;
            padding-bottom: 20px;
            margin-bottom: 28px;
          }
          .title {
            font-size: 26px;
            font-weight: 800;
            color: #065f46;
          }
          .sub {
            font-size: 14px;
            color: #64748b;
          }
          .box {
            background: #ecfdf5;
            border-left: 4px solid #10b981;
            padding: 16px;
            border-radius: 6px;
            margin-bottom: 24px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="title">${data.title || 'Executive Project Brief'}</div>
            <div class="sub">Prepared by ${data.companyName || 'CapStudio'} for ${data.clientName || 'Client'}</div>
          </div>
          <div class="box">
            <strong>Scope & Summary:</strong> ${data.serviceDescription || 'Comprehensive project scope overview'}
          </div>
          <h3 style="margin-bottom: 12px; color: #0f172a;">Project Deliverables</h3>
          ${itemsList}
          <div style="text-align: right; margin-top: 20px; font-size: 18px; font-weight: 800; color: #065f46;">
            Estimated Project Valuation: ${data.currencySymbol}${subtotal.toFixed(2)}
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private renderReceiptTemplate(data: DocumentData): string {
    const { subtotal, taxAmount, discountAmount, total } = this.calculateTotals(data);

    // Format items list POS receipt style
    const itemsHtml = data.items
      .map(
        (item) => `
        <div class="receipt-item">
          <div class="item-row">
            <span class="item-desc">${item.description.toUpperCase()}</span>
            <span class="item-total">${data.currencySymbol}${(item.quantity * item.rate).toFixed(2)}</span>
          </div>
          <div class="item-details">
            ${item.quantity} x ${data.currencySymbol}${item.rate.toFixed(2)}
          </div>
        </div>
      `
      )
      .join('');

    const formattedDate = data.date ? new Date(data.date).toLocaleDateString() : new Date().toLocaleDateString();
    const formattedTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Transaction Receipt</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Courier+Prime:ital,wght@0,400;0,700;1,400;1,700&display=swap');

          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          body {
            background-color: #f4f4f5;
            font-family: 'Courier Prime', 'Courier New', Courier, monospace;
            color: #18181b;
            padding: 40px 16px;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            -webkit-font-smoothing: antialiased;
          }

          .receipt-paper {
            background-color: #ffffff;
            width: 100%;
            max-width: 360px;
            padding: 36px 20px 24px 20px;
            position: relative;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.04);
            border-left: 1px solid #e4e4e7;
            border-right: 1px solid #e4e4e7;
          }

          /* Pure CSS triangle jagged top/bottom borders */
          .receipt-paper::before,
          .receipt-paper::after {
            content: '';
            position: absolute;
            left: 0;
            width: 100%;
            height: 6px;
            background-size: 12px 6px;
            background-repeat: repeat-x;
          }

          .receipt-paper::before {
            top: -6px;
            background-image: 
              linear-gradient(135deg, transparent 33.333%, #ffffff 33.333%, #ffffff 66.667%, transparent 66.667%),
              linear-gradient(225deg, transparent 33.333%, #ffffff 33.333%, #ffffff 66.667%, transparent 66.667%);
          }

          .receipt-paper::after {
            bottom: -6px;
            background-image: 
              linear-gradient(45deg, transparent 33.333%, #ffffff 33.333%, #ffffff 66.667%, transparent 66.667%),
              linear-gradient(-45deg, transparent 33.333%, #ffffff 33.333%, #ffffff 66.667%, transparent 66.667%);
          }

          .header {
            text-align: center;
            margin-bottom: 24px;
          }

          .merchant-name {
            font-size: 20px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #09090b;
            margin-bottom: 4px;
          }

          .merchant-tagline {
            font-size: 11px;
            color: #71717a;
            margin-bottom: 8px;
            text-transform: uppercase;
          }

          .merchant-address {
            font-size: 11px;
            color: #52525b;
            line-height: 1.4;
          }

          .divider {
            border-top: 1px dashed #71717a;
            margin: 12px 0;
          }

          .meta-row {
            display: flex;
            justify-content: space-between;
            font-size: 11px;
            color: #27272a;
            padding: 2px 0;
          }

          .section-title {
            text-align: center;
            font-size: 13px;
            font-weight: 700;
            letter-spacing: 2px;
            margin: 16px 0 8px 0;
            text-transform: uppercase;
            color: #09090b;
          }

          .receipt-item {
            margin-bottom: 12px;
          }

          .item-row {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
          }

          .item-desc {
            font-size: 12px;
            font-weight: 700;
            color: #09090b;
            max-width: 75%;
            word-wrap: break-word;
          }

          .item-total {
            font-size: 12px;
            font-weight: 700;
            color: #09090b;
          }

          .item-details {
            font-size: 11px;
            color: #52525b;
            margin-top: 2px;
            padding-left: 8px;
          }

          .totals-block {
            margin-top: 16px;
            padding-top: 8px;
          }

          .totals-row {
            display: flex;
            justify-content: space-between;
            font-size: 12px;
            padding: 4px 0;
            color: #27272a;
          }

          .totals-row.grand-total {
            border-top: 1px dashed #09090b;
            margin-top: 6px;
            padding-top: 8px;
            font-size: 16px;
            font-weight: 700;
            color: #09090b;
          }

          .payment-info {
            background-color: #fafafa;
            border: 1px solid #f4f4f5;
            padding: 10px;
            border-radius: 4px;
            margin-top: 16px;
          }

          .barcode-container {
            text-align: center;
            margin: 24px 0 12px 0;
          }

          .barcode {
            width: 220px;
            height: 40px;
            display: inline-block;
            background: repeating-linear-gradient(
              90deg,
              #18181b,
              #18181b 2px,
              #ffffff 2px,
              #ffffff 5px,
              #18181b 5px,
              #18181b 6px,
              #ffffff 6px,
              #ffffff 8px
            );
            opacity: 0.9;
          }

          .barcode-num {
            font-size: 10px;
            color: #71717a;
            letter-spacing: 3px;
            margin-top: 4px;
          }

          .footer {
            text-align: center;
            font-size: 11px;
            color: #52525b;
            line-height: 1.4;
            margin-top: 16px;
          }

          .star-row {
            text-align: center;
            color: #71717a;
            font-size: 10px;
            letter-spacing: 4px;
            margin: 12px 0;
          }

          @media print {
            body {
              background-color: #ffffff;
              padding: 0;
            }
            .receipt-paper {
              box-shadow: none;
              border: none;
              max-width: 100%;
            }
          }
        </style>
      </head>
      <body>
        <div class="receipt-paper">
          <!-- Merchant Header -->
          <div class="header">
            <h1 class="merchant-name">${data.companyName || 'STORE & AGENCY CO.'}</h1>
            <div class="merchant-tagline">${data.companyTagline || 'TRANSACTION SLIP'}</div>
            <div class="merchant-address">
              123 APEX SUITE DR.<br>
              SAN FRANCISCO, CA 94107<br>
              TEL: (555) 019-2831
            </div>
          </div>

          <div class="divider"></div>

          <!-- Transaction Meta -->
          <div class="meta-row">
            <span>TICKET #: ${data.invoiceNumber || 'REC-889'}</span>
            <span>CASHIER: ROBIN</span>
          </div>
          <div class="meta-row">
            <span>DATE: ${formattedDate}</span>
            <span>TIME: ${formattedTime}</span>
          </div>
          <div class="meta-row">
            <span>CUSTOMER: ${data.clientName || 'GUEST'}</span>
          </div>

          <div class="divider"></div>

          <!-- Items Section -->
          <div class="section-title">ITEMS PURCHASED</div>
          <div class="items-list">
            ${itemsHtml}
          </div>

          <div class="divider"></div>

          <!-- Totals Section -->
          <div class="totals-block">
            <div class="totals-row">
              <span>SUBTOTAL</span>
              <span>${data.currencySymbol}${subtotal.toFixed(2)}</span>
            </div>
            ${
              data.taxRatePercent
                ? `<div class="totals-row">
                    <span>TAX (${data.taxRatePercent}%)</span>
                    <span>+${data.currencySymbol}${taxAmount.toFixed(2)}</span>
                  </div>`
                : ''
            }
            ${
              data.discountPercent
                ? `<div class="totals-row">
                    <span>DISCOUNT (${data.discountPercent}%)</span>
                    <span>-${data.currencySymbol}${discountAmount.toFixed(2)}</span>
                  </div>`
                : ''
            }
            <div class="totals-row grand-total">
              <span>TOTAL PAID</span>
              <span>${data.currencySymbol}${total.toFixed(2)}</span>
            </div>
          </div>

          <!-- Payment Details -->
          <div class="payment-info">
            <div class="meta-row" style="font-weight: 700;">
              <span>METHOD:</span>
              <span>CREDIT CARD (VISA)</span>
            </div>
            <div class="meta-row">
              <span>CARD:</span>
              <span>************4242</span>
            </div>
            <div class="meta-row">
              <span>AUTH CODE:</span>
              <span>#APPROVED-${Math.floor(100000 + Math.random() * 900000)}</span>
            </div>
          </div>

          <!-- Barcode container -->
          <div class="barcode-container">
            <div class="barcode"></div>
            <div class="barcode-num">*${data.invoiceNumber || 'REC-889'}*</div>
          </div>

          <div class="star-row">**********</div>

          <!-- Footer Notes -->
          <div class="footer">
            THANK YOU FOR YOUR VISIT!<br>
            PLEASE KEEP THIS SLIP FOR RETURNS.<br>
            CAPAWESOME PDF SUITE
          </div>
        </div>
      </body>
      </html>
    `;
  }
}
