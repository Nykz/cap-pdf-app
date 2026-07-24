import { Injectable, inject } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { PdfGenerator } from '@capawesome/capacitor-pdf-generator';
import { PdfViewer } from '@capawesome/capacitor-pdf-viewer';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { ModalController } from '@ionic/angular/standalone';
import { WebPdfViewerModalComponent } from '../components/web-pdf-viewer-modal/web-pdf-viewer-modal.component';
import { DocumentData, PdfDocumentRecord, TemplateType, Orientation, PageSize } from '../interfaces/pdf.interface';
import { PdfTemplateService } from './pdf-template.service';
import { PdfHistoryService } from './pdf-history.service';
import { UiService } from './ui.service';

@Injectable({
  providedIn: 'root',
})
export class PdfService {
  private templateService = inject(PdfTemplateService);
  private historyService = inject(PdfHistoryService);
  private uiService = inject(UiService);
  private modalCtrl = inject(ModalController);

  isNativePlatform(): boolean {
    return Capacitor.isNativePlatform();
  }

  private sanitizeFileName(str: string): string {
    return str.replace(/[^a-zA-Z0-9_-]/g, '_');
  }

  async generatePdf(
    data: DocumentData,
    templateType: TemplateType = 'invoice'
  ): Promise<PdfDocumentRecord> {
    const html = this.templateService.generateHtml(data, templateType);

    const outFileName = `${this.sanitizeFileName(data.title || 'document')}_${data.invoiceNumber}.pdf`;

    let generatedPath = '';
    let isWebFallback = false;

    if (this.isNativePlatform()) {
      try {
        const result = await PdfGenerator.generateFromHtml({
          html,
          orientation: data.orientation,
          pageSize: data.pageSize,
          fileName: outFileName,
          timeout: data.timeout || 30000,
        });
        generatedPath = await this.saveToPermanentStorage(result.path, outFileName);
      } catch (err: any) {
        console.warn('Native PDF Generation failed, falling back to Web Blob', err);
        isWebFallback = true;
        generatedPath = this.createWebHtmlBlobUrl(html);
      }
    } else {
      isWebFallback = true;
      generatedPath = this.createWebHtmlBlobUrl(html);
    }

    const subtotal = data.items.reduce((sum, i) => sum + i.quantity * i.rate, 0);
    const tax = (subtotal * (data.taxRatePercent || 0)) / 100;
    const discount = (subtotal * (data.discountPercent || 0)) / 100;
    const totalAmount = Math.max(0, subtotal + tax - discount);

    const record: PdfDocumentRecord = {
      id: 'pdf_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      title: data.title || `${templateType.toUpperCase()} #${data.invoiceNumber}`,
      templateType,
      path: generatedPath,
      fileName: outFileName,
      createdAt: new Date().toISOString(),
      clientName: data.clientName || 'Valued Client',
      totalAmount,
      currencySymbol: data.currencySymbol || '$',
      pageSize: data.pageSize,
      orientation: data.orientation,
      isWebFallback,
    };

    this.historyService.addRecord(record);
    await this.uiService.triggerNotificationHaptic();
    await this.uiService.showToast('PDF generated successfully!', 'success', 2500, 'checkmark-circle-outline');

    return record;
  }

  async generatePdfFromUrl(
    url: string,
    title: string,
    fileName: string,
    orientation: Orientation = Orientation.Portrait,
    pageSize: PageSize = PageSize.A4,
    timeout?: number
  ): Promise<PdfDocumentRecord> {
    const cleanFileName = fileName.endsWith('.pdf') ? fileName : `${this.sanitizeFileName(fileName || 'document')}.pdf`;

    let generatedPath = '';
    let isWebFallback = false;

    if (this.isNativePlatform()) {
      try {
        const result = await PdfGenerator.generateFromUrl({
          url,
          fileName: cleanFileName,
          orientation,
          pageSize,
          timeout: timeout || 30000,
        });
        generatedPath = await this.saveToPermanentStorage(result.path, cleanFileName);
      } catch (err: any) {
        console.warn('Native PDF from URL Generation failed, falling back to Web', err);
        isWebFallback = true;
        generatedPath = url;
      }
    } else {
      isWebFallback = true;
      generatedPath = url;
    }

    const record: PdfDocumentRecord = {
      id: 'pdf_url_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      title: title || 'Web Page Snapshot',
      templateType: 'url',
      path: generatedPath,
      fileName: cleanFileName,
      createdAt: new Date().toISOString(),
      clientName: url,
      totalAmount: 0,
      currencySymbol: '',
      pageSize,
      orientation,
      isWebFallback,
    };

    this.historyService.addRecord(record);
    await this.uiService.triggerNotificationHaptic();
    await this.uiService.showToast('PDF generated from URL successfully!', 'success', 2500, 'checkmark-circle-outline');

    return record;
  }

  async openPdfViewer(record: PdfDocumentRecord, htmlContent?: string): Promise<void> {
    this.uiService.triggerHaptic();

    if (this.isNativePlatform() && record.path && !record.isWebFallback) {
      try {
        await PdfViewer.open({ path: record.path });
        return;
      } catch (err) {
        console.warn('Capacitor PdfViewer.open failed, falling back to Web Viewer', err);
      }
    }

    // Web Fallback Mode: Open in-app WebPdfViewerModalComponent instead of window.open (to bypass popup blockers!)
    let viewUrl = record.path;
    let resolvedHtml = htmlContent || '';
    const isUrl = record.templateType === 'url';

    if (!isUrl && !resolvedHtml) {
      // Regenerate dynamic fallback HTML for history records whose blobs have expired
      resolvedHtml = this.templateService.generateHtml({
        title: record.title,
        clientName: record.clientName || 'Valued Client',
        serviceDescription: 'Generated PDF Document',
        invoiceNumber: record.id,
        date: new Date(record.createdAt).toLocaleDateString(),
        items: [{ id: '1', description: record.title, quantity: 1, rate: record.totalAmount }],
        currencySymbol: record.currencySymbol || '$',
        orientation: record.orientation,
        pageSize: record.pageSize,
        companyName: 'CapStudio Vault',
      }, record.templateType);
    }

    if (!viewUrl && resolvedHtml) {
      viewUrl = this.createWebHtmlBlobUrl(resolvedHtml);
    }

    const modal = await this.modalCtrl.create({
      component: WebPdfViewerModalComponent,
      componentProps: {
        pdfPath: viewUrl,
        htmlContent: resolvedHtml,
        documentTitle: record.title,
        isUrlSnapshot: isUrl,
      },
      cssClass: 'full-height-modal',
    });

    await modal.present();
    await this.uiService.showToast('Opened document viewer', 'secondary', 2000, 'open-outline');
  }

  createWebHtmlBlobUrl(html: string): string {
    const blob = new Blob([html], { type: 'text/html' });
    return URL.createObjectURL(blob);
  }

  private async saveToPermanentStorage(tempPath: string, fileName: string): Promise<string> {
    if (!this.isNativePlatform() || !tempPath) {
      return tempPath;
    }
    try {
      let sanitizedName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
      if (!sanitizedName.endsWith('.pdf')) {
        sanitizedName += '.pdf';
      }

      const copyResult = await Filesystem.copy({
        from: tempPath,
        to: sanitizedName,
        toDirectory: Directory.Documents,
      });
      console.log('Saved PDF to permanent storage:', copyResult.uri);
      return copyResult.uri;
    } catch (err) {
      console.error('Failed to save PDF to permanent storage, using cache path instead', err);
      return tempPath;
    }
  }
}
