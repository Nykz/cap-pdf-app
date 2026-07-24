import { Injectable, signal, computed } from '@angular/core';
import { PdfDocumentRecord, TemplateType } from '../interfaces/pdf.interface';

const STORAGE_KEY = 'capawesome_pdf_vault_records_v1';

@Injectable({
  providedIn: 'root',
})
export class PdfHistoryService {
  readonly records = signal<PdfDocumentRecord[]>(this.loadFromStorage());
  readonly searchQuery = signal<string>('');
  readonly selectedCategory = signal<string>('all');

  readonly filteredRecords = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const cat = this.selectedCategory().toLowerCase();

    return this.records().filter((record) => {
      const matchesCategory =
        cat === 'all' || record.templateType.toLowerCase() === cat;
      const matchesQuery =
        !query ||
        record.title.toLowerCase().includes(query) ||
        record.clientName.toLowerCase().includes(query) ||
        record.fileName.toLowerCase().includes(query);

      return matchesCategory && matchesQuery;
    });
  });

  addRecord(record: PdfDocumentRecord): void {
    this.records.update((prev) => [record, ...prev]);
    this.saveToStorage();
  }

  deleteRecord(id: string): void {
    this.records.update((prev) => prev.filter((r) => r.id !== id));
    this.saveToStorage();
  }

  getRecordById(id: string): PdfDocumentRecord | undefined {
    return this.records().find((r) => r.id === id);
  }

  clearAll(): void {
    this.records.set([]);
    this.saveToStorage();
  }

  private loadFromStorage(): PdfDocumentRecord[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch {
      // Fallback on error
    }
    return this.getInitialSampleRecords();
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.records()));
    } catch {
      // Ignore storage errors
    }
  }

  private getInitialSampleRecords(): PdfDocumentRecord[] {
    return [
      {
        id: 'sample-inv-1',
        title: 'Modern Invoice #INV-2026-001',
        templateType: 'invoice',
        path: '',
        fileName: 'Invoice_INV-2026-001.pdf',
        createdAt: new Date().toISOString(),
        clientName: 'Apex Global Logistics',
        totalAmount: 1450.0,
        currencySymbol: '$',
        pageSize: 'A4' as any,
        orientation: 'portrait' as any,
        isWebFallback: true,
      },
      {
        id: 'sample-cert-2',
        title: 'Certificate of Achievement',
        templateType: 'certificate',
        path: '',
        fileName: 'Certificate_John_Doe.pdf',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        clientName: 'Sarah Connor',
        totalAmount: 0,
        currencySymbol: '$',
        pageSize: 'A4' as any,
        orientation: 'landscape' as any,
        isWebFallback: true,
      },
    ];
  }
}
