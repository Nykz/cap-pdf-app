import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
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
  sparklesOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-live-preview-modal',
  templateUrl: './live-preview-modal.component.html',
  styleUrls: ['./live-preview-modal.component.scss'],
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
export class LivePreviewModalComponent {
  private sanitizer = inject(DomSanitizer);
  private modalCtrl = inject(ModalController);

  @Input() htmlContent: string = '';
  @Input() documentTitle: string = 'Live Document Preview';

  get docTitle(): string {
    if (typeof this.documentTitle === 'function') {
      return (this.documentTitle as any)();
    }
    return this.documentTitle || 'Live Document Preview';
  }

  get sanitizedHtml(): SafeHtml {
    const rawHtml = typeof this.htmlContent === 'function' ? (this.htmlContent as any)() : (this.htmlContent || '');
    return this.sanitizer.bypassSecurityTrustHtml(rawHtml);
  }

  constructor() {
    addIcons({
      closeOutline,
      eyeOutline,
      checkmarkCircleOutline,
      sparklesOutline,
    });
  }

  dismiss(action: 'cancel' | 'generate' = 'cancel'): void {
    this.modalCtrl.dismiss({ action });
  }
}
