import { Component, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonSearchbar,
  IonChip,
  IonLabel,
  IonCard,
  IonCardContent,
  IonButton,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonItem,
  IonBadge,
  IonText,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  searchOutline,
  openOutline,
  trashOutline,
  folderOpenOutline,
  addCircleOutline,
  filterOutline,
  receiptOutline,
  ribbonOutline,
  documentTextOutline,
  cardOutline,
  eyeOutline,
  phonePortraitOutline,
  addOutline,
  walletOutline,
  globeOutline,
} from 'ionicons/icons';
import { PdfHistoryService } from '../../services/pdf-history.service';
import { PdfService } from '../../services/pdf.service';
import { PdfTemplateService } from '../../services/pdf-template.service';
import { UiService } from '../../services/ui.service';
import { PdfDocumentRecord } from '../../interfaces/pdf.interface';

@Component({
  selector: 'app-vault',
  templateUrl: './vault.component.html',
  styleUrls: ['./vault.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonSearchbar,
    IonChip,
    IonLabel,
    IonCard,
    IonCardContent,
    IonButton,
    IonIcon,
    IonGrid,
    IonRow,
    IonCol,
    IonItem,
    IonBadge,
    IonText,
  ],
})
export class VaultComponent {
  historyService = inject(PdfHistoryService);
  pdfService = inject(PdfService);
  templateService = inject(PdfTemplateService);
  uiService = inject(UiService);

  readonly createNewRequested = output<void>();

  readonly filterCategories = [
    { label: 'All Types', value: 'all', icon: 'filter-outline' },
    { label: 'Invoices', value: 'invoice', icon: 'receipt-outline' },
    { label: 'Certificates', value: 'certificate', icon: 'ribbon-outline' },
    { label: 'Reports', value: 'report', icon: 'document-text-outline' },
    { label: 'Receipts', value: 'receipt', icon: 'card-outline' },
  ];

  get searchTerm() {
    return this.historyService.searchQuery;
  }

  get selectedCategory() {
    return this.historyService.selectedCategory;
  }

  get records() {
    return this.historyService.records;
  }

  get filteredRecords() {
    return this.historyService.filteredRecords;
  }

  constructor() {
    addIcons({
      searchOutline,
      openOutline,
      trashOutline,
      folderOpenOutline,
      addCircleOutline,
      filterOutline,
      receiptOutline,
      ribbonOutline,
      documentTextOutline,
      cardOutline,
      eyeOutline,
      phonePortraitOutline,
      addOutline,
      walletOutline,
      globeOutline,
    });
  }

  async setCategoryFilter(cat: string): Promise<void> {
    await this.uiService.triggerSelectionHaptic();
    this.historyService.selectedCategory.set(cat);
  }

  async onSearchChange(event: any): Promise<void> {
    const query = event.detail.value || '';
    this.historyService.searchQuery.set(query);
  }

  getTemplateIcon(templateType: string): string {
    switch (templateType) {
      case 'certificate': return 'ribbon-outline';
      case 'report': return 'document-text-outline';
      case 'receipt': return 'card-outline';
      case 'url': return 'globe-outline';
      case 'invoice':
      default: return 'receipt-outline';
    }
  }

  formatCurrency(val: number, symbol: string = '$'): string {
    return `${symbol}${(val || 0).toFixed(2)}`;
  }

  async viewPdf(record: PdfDocumentRecord): Promise<void> {
    await this.pdfService.openPdfViewer(record);
  }

  async deleteDoc(record: PdfDocumentRecord): Promise<void> {
    await this.uiService.triggerHaptic();
    this.historyService.deleteRecord(record.id);
    await this.uiService.showToast('Document deleted from vault', 'danger', 2000, 'trash-outline');
  }

  async triggerCreateNew(): Promise<void> {
    await this.uiService.triggerHaptic();
    this.createNewRequested.emit();
  }
}
