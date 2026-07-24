import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl, SafeHtml } from '@angular/platform-browser';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonContent,
  IonFooter,
  IonBadge,
  ModalController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  closeOutline,
  eyeOutline,
  checkmarkCircleOutline,
  downloadOutline,
  openOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-web-pdf-viewer-modal',
  templateUrl: './web-pdf-viewer-modal.component.html',
  styleUrls: ['./web-pdf-viewer-modal.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonIcon,
    IonContent,
    IonFooter,
    IonBadge,
  ],
})
export class WebPdfViewerModalComponent {
  private sanitizer = inject(DomSanitizer);
  private modalCtrl = inject(ModalController);

  @Input() pdfPath: string = '';
  @Input() htmlContent: string = '';
  @Input() documentTitle: string = 'PDF Document';
  @Input() isUrlSnapshot: boolean = false;

  get safeUrl(): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.pdfPath);
  }

  get sanitizedHtml(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.htmlContent);
  }

  constructor() {
    addIcons({
      closeOutline,
      eyeOutline,
      checkmarkCircleOutline,
      downloadOutline,
      openOutline,
    });
  }

  dismiss(): void {
    this.modalCtrl.dismiss();
  }

  openInNewTab(): void {
    window.open(this.pdfPath, '_blank');
  }
}
