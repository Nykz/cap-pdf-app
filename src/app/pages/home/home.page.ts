import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonIcon,
  IonBadge,
  ModalController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  createOutline,
  walletOutline,
  sparklesOutline,
  checkmarkCircleOutline,
  globeOutline,
} from 'ionicons/icons';
import { HeaderComponent } from '../../components/header/header.component';
import { TemplatePickerComponent } from '../../components/template-picker/template-picker.component';
import { DocumentFormComponent } from '../../components/document-form/document-form.component';
import { VaultComponent } from '../../components/vault/vault.component';
import { UrlToPdfComponent } from '../../components/url-to-pdf/url-to-pdf.component';
import { LivePreviewModalComponent } from '../../components/live-preview-modal/live-preview-modal.component';

import { DocumentData, TemplateType } from '../../interfaces/pdf.interface';
import { PdfTemplateService } from '../../services/pdf-template.service';
import { PdfService } from '../../services/pdf.service';
import { PdfHistoryService } from '../../services/pdf-history.service';
import { UiService } from '../../services/ui.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonIcon,
    IonBadge,
    HeaderComponent,
    TemplatePickerComponent,
    DocumentFormComponent,
    VaultComponent,
    UrlToPdfComponent,
  ],
})
export class HomePage {
  private modalCtrl = inject(ModalController);
  private pdfTemplateService = inject(PdfTemplateService);
  private pdfService = inject(PdfService);
  public historyService = inject(PdfHistoryService);
  private uiService = inject(UiService);

  readonly activeTab = signal<'builder' | 'url-to-pdf' | 'vault'>('builder');
  readonly selectedTemplate = signal<TemplateType>('invoice');

  constructor() {
    addIcons({
      createOutline,
      walletOutline,
      sparklesOutline,
      checkmarkCircleOutline,
      globeOutline,
    });
  }

  async onTabChange(event: any): Promise<void> {
    await this.uiService.triggerSelectionHaptic();
    this.activeTab.set(event.detail.value);
  }

  onTemplateSelect(templateType: TemplateType): void {
    this.selectedTemplate.set(templateType);
  }

  async openLivePreview(formData: DocumentData): Promise<void> {
    const html = this.pdfTemplateService.generateHtml(formData, this.selectedTemplate());

    const modal = await this.modalCtrl.create({
      component: LivePreviewModalComponent,
      componentProps: {
        htmlContent: html,
        documentTitle: formData.title || 'Studio Document',
      },
      cssClass: 'full-height-modal',
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data?.action === 'generate') {
      await this.generatePdfDocument(formData);
    }
  }

  async generatePdfDocument(formData: DocumentData): Promise<void> {
    const record = await this.pdfService.generatePdf(formData, this.selectedTemplate());
    const html = this.pdfTemplateService.generateHtml(formData, this.selectedTemplate());
    await this.pdfService.openPdfViewer(record, html);
    this.activeTab.set('vault');
  }

  switchToBuilder(): void {
    this.activeTab.set('builder');
  }
}
