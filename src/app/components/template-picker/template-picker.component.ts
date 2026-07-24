import { Component, input, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardContent,
  IonChip,
  IonLabel,
  IonIcon,
  IonItem,
  IonText,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  receiptOutline,
  ribbonOutline,
  documentTextOutline,
  cardOutline,
  checkmarkCircle,
} from 'ionicons/icons';
import { TemplateType } from '../../interfaces/pdf.interface';
import { PdfTemplateService } from '../../services/pdf-template.service';
import { UiService } from '../../services/ui.service';

@Component({
  selector: 'app-template-picker',
  templateUrl: './template-picker.component.html',
  styleUrls: ['./template-picker.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardContent,
    IonChip,
    IonLabel,
    IonIcon,
    IonItem,
    IonText,
  ],
})
export class TemplatePickerComponent {
  private pdfTemplateService = inject(PdfTemplateService);
  private uiService = inject(UiService);

  readonly selectedTemplate = input<TemplateType>('invoice');
  readonly templateSelected = output<TemplateType>();

  readonly templates = this.pdfTemplateService.templates;

  constructor() {
    addIcons({
      receiptOutline,
      ribbonOutline,
      documentTextOutline,
      cardOutline,
      checkmarkCircle,
    });
  }

  async selectTemplate(type: TemplateType): Promise<void> {
    await this.uiService.triggerSelectionHaptic();
    this.templateSelected.emit(type);
  }
}
