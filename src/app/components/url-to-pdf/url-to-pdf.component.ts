import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonCard,
  IonCardContent,
  IonItem,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  globeOutline,
  linkOutline,
  documentOutline,
  sparklesOutline,
} from 'ionicons/icons';
import { PdfService } from '../../services/pdf.service';
import { Orientation, PageSize } from '../../interfaces/pdf.interface';
import { UiService } from '../../services/ui.service';

@Component({
  selector: 'app-url-to-pdf',
  templateUrl: './url-to-pdf.component.html',
  styleUrls: ['./url-to-pdf.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonCard,
    IonCardContent,
    IonItem,
    IonLabel,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonButton,
    IonIcon,
    IonGrid,
    IonRow,
    IonCol,
    IonText,
  ],
})
export class UrlToPdfComponent {
  private pdfService = inject(PdfService);
  private uiService = inject(UiService);

  readonly url = signal<string>('');
  readonly title = signal<string>('');
  readonly fileName = signal<string>('');
  readonly orientation = signal<Orientation>(Orientation.Portrait);
  readonly pageSize = signal<PageSize>(PageSize.A4);
  readonly timeout = signal<number>(30000);

  readonly orientationOptions = [
    { label: 'Portrait', value: Orientation.Portrait },
    { label: 'Landscape', value: Orientation.Landscape },
  ];

  readonly pageSizeOptions = [
    { label: 'A4 Standard', value: PageSize.A4 },
    { label: 'A3 Premium', value: PageSize.A3 },
    { label: 'A5 Compact', value: PageSize.A5 },
    { label: 'US Letter', value: PageSize.Letter },
  ];

  constructor() {
    addIcons({
      globeOutline,
      linkOutline,
      documentOutline,
      sparklesOutline,
    });
  }

  async onGenerate(): Promise<void> {
    const rawUrl = this.url().trim();
    if (!rawUrl) return;

    let targetUrl = rawUrl;
    if (!/^https?:\/\//i.test(targetUrl)) {
      targetUrl = 'https://' + targetUrl;
    }

    const docTitle = this.title().trim() || 'Web Snapshot';
    const outFileName = this.fileName().trim() || 'web-snapshot.pdf';

    await this.uiService.showLoading('Converting web page to PDF...');

    try {
      const record = await this.pdfService.generatePdfFromUrl(
        targetUrl,
        docTitle,
        outFileName,
        this.orientation(),
        this.pageSize(),
        this.timeout()
      );

      await this.uiService.dismissLoading();

      // Automatically offer to open the viewer
      await this.pdfService.openPdfViewer(record);
    } catch (err: any) {
      await this.uiService.dismissLoading();
      await this.uiService.showToast(
        err?.message || 'Failed to generate PDF from URL',
        'danger'
      );
    }
  }
}
