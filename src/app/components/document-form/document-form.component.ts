import { Component, signal, computed, input, output, inject } from '@angular/core';
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
  IonBadge,
  IonText,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  addOutline,
  trashOutline,
  eyeOutline,
  sparklesOutline,
  createOutline,
  walletOutline,
  documentOutline,
  businessOutline,
  personOutline,
  calendarOutline,
  optionsOutline,
  calculatorOutline,
} from 'ionicons/icons';
import { DocumentData, LineItem, Orientation, PageSize, TemplateType } from '../../interfaces/pdf.interface';
import { UiService } from '../../services/ui.service';

@Component({
  selector: 'app-document-form',
  templateUrl: './document-form.component.html',
  styleUrls: ['./document-form.component.scss'],
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
    IonBadge,
    IonText,
  ],
})
export class DocumentFormComponent {
  private uiService = inject(UiService);

  readonly activeTemplate = input<TemplateType>('invoice');

  readonly previewRequested = output<DocumentData>();
  readonly generateRequested = output<DocumentData>();

  // Signals for form state
  readonly companyName = signal<string>('Capawesome Digital Inc.');
  readonly companyTagline = signal<string>('Premium Mobile Solutions');
  readonly clientName = signal<string>('Acme Corporation');
  readonly clientEmail = signal<string>('billing@acme.com');
  readonly title = signal<string>('Mobile Application Development');
  readonly serviceDescription = signal<string>('Capacitor Native PDF Generator Setup');
  readonly invoiceNumber = signal<string>('INV-2026-904');
  readonly date = signal<string>(new Date().toISOString().substring(0, 10));
  readonly currencySymbol = signal<string>('$');
  readonly taxRatePercent = signal<number>(10);
  readonly discountPercent = signal<number>(0);
  readonly notes = signal<string>('Payment is due within 14 days of invoice issuance. Thank you for your partnership!');
  readonly orientation = signal<Orientation>(Orientation.Portrait);
  readonly pageSize = signal<PageSize>(PageSize.A4);
  readonly timeout = signal<number>(30000);

  readonly items = signal<LineItem[]>([
    { id: '1', description: 'Capacitor Native PDF Generator Setup', quantity: 1, rate: 2450 },
  ]);

  // Computed Totals
  readonly subtotal = computed(() => {
    return this.items().reduce((sum, item) => sum + item.quantity * item.rate, 0);
  });

  readonly taxAmount = computed(() => {
    return (this.subtotal() * (this.taxRatePercent() || 0)) / 100;
  });

  readonly discountAmount = computed(() => {
    return (this.subtotal() * (this.discountPercent() || 0)) / 100;
  });

  readonly grandTotal = computed(() => {
    return Math.max(0, this.subtotal() + this.taxAmount() - this.discountAmount());
  });

  readonly orientationOptions = [
    { label: 'Portrait', value: Orientation.Portrait },
    { label: 'Landscape', value: Orientation.Landscape },
  ];

  readonly pageSizeOptions = [
    { label: 'A4 Standard', value: PageSize.A4 },
    { label: 'US Letter', value: PageSize.Letter },
    { label: 'A3 Poster', value: PageSize.A3 },
    { label: 'A5 Compact', value: PageSize.A5 },
  ];

  constructor() {
    addIcons({
      addOutline,
      trashOutline,
      eyeOutline,
      sparklesOutline,
      createOutline,
      walletOutline,
      documentOutline,
      businessOutline,
      personOutline,
      calendarOutline,
      optionsOutline,
      calculatorOutline,
    });
  }

  async addItem(): Promise<void> {
    await this.uiService.triggerSelectionHaptic();
    const newItem: LineItem = {
      id: Date.now().toString(),
      description: 'New Service Item',
      quantity: 1,
      rate: 500,
    };
    this.items.update((prev) => [...prev, newItem]);
  }

  async removeItem(id: string): Promise<void> {
    await this.uiService.triggerHaptic();
    this.items.update((prev) => prev.filter((i) => i.id !== id));
  }

  updateItemDescription(id: string, description: string): void {
    this.items.update((prev) =>
      prev.map((i) => (i.id === id ? { ...i, description } : i))
    );
  }

  updateItemQuantity(id: string, val: string | number): void {
    const quantity = Math.max(1, Number(val) || 1);
    this.items.update((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity } : i))
    );
  }

  updateItemRate(id: string, val: string | number): void {
    const rate = Math.max(0, Number(val) || 0);
    this.items.update((prev) =>
      prev.map((i) => (i.id === id ? { ...i, rate } : i))
    );
  }

  getFormData(): DocumentData {
    return {
      title: this.title() || 'Document',
      clientName: this.clientName(),
      clientEmail: this.clientEmail(),
      serviceDescription: this.serviceDescription(),
      invoiceNumber: this.invoiceNumber(),
      date: this.date(),
      items: this.items(),
      taxRatePercent: this.taxRatePercent(),
      discountPercent: this.discountPercent(),
      currencySymbol: this.currencySymbol(),
      notes: this.notes(),
      orientation: this.orientation(),
      pageSize: this.pageSize(),
      companyName: this.companyName(),
      companyTagline: this.companyTagline(),
      timeout: this.timeout(),
    };
  }

  async onPreview(): Promise<void> {
    await this.uiService.triggerHaptic();
    this.previewRequested.emit(this.getFormData());
  }

  async onGenerate(): Promise<void> {
    await this.uiService.triggerNotificationHaptic();
    this.generateRequested.emit(this.getFormData());
  }
}
