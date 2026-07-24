import { TestBed } from '@angular/core/testing';
import { PdfHistoryService } from './pdf-history.service';
import { PdfDocumentRecord } from '../interfaces/pdf.interface';

describe('PdfHistoryService', () => {
  let service: PdfHistoryService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(PdfHistoryService);
  });

  it('should be created and load default sample records when storage empty', () => {
    expect(service).toBeTruthy();
    expect(service.records().length).toBeGreaterThan(0);
  });

  it('should add a new record to top of history', () => {
    const newRecord: PdfDocumentRecord = {
      id: 'test-123',
      title: 'New Test Doc',
      templateType: 'invoice',
      path: '',
      fileName: 'Test.pdf',
      createdAt: new Date().toISOString(),
      clientName: 'Test Client',
      totalAmount: 500,
      currencySymbol: '$',
      pageSize: 'A4' as any,
      orientation: 'portrait' as any,
    };
    service.addRecord(newRecord);
    expect(service.records()[0].id).toEqual('test-123');
  });

  it('should delete record by id', () => {
    const targetId = service.records()[0].id;
    service.deleteRecord(targetId);
    expect(service.getRecordById(targetId)).toBeUndefined();
  });

  it('should filter records by query and category', () => {
    service.searchQuery.set('apex');
    service.selectedCategory.set('invoice');
    const filtered = service.filteredRecords();
    expect(filtered.length).toBeGreaterThan(0);
    expect(filtered[0].clientName).toContain('Apex');
  });
});
