import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonRow,
  IonCol,
  IonChip,
  IonLabel,
  IonIcon,
  IonText,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { phonePortraitOutline, globeOutline, documentText } from 'ionicons/icons';
import { PdfService } from '../../services/pdf.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonRow,
    IonCol,
    IonChip,
    IonLabel,
    IonIcon,
    IonText,
  ],
})
export class HeaderComponent {
  private pdfService = inject(PdfService);

  isNative = this.pdfService.isNativePlatform();

  constructor() {
    addIcons({ phonePortraitOutline, globeOutline, documentText });
  }
}
