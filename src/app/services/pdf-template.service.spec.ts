import { TestBed } from '@angular/core/testing';
import { PdfTemplateService } from './pdf-template.service';
import { DocumentData, Orientation, PageSize } from '../interfaces/pdf.interface';

describe('PdfTemplateService', () => {
  let service: PdfTemplateService;

  const mockData: DocumentData = {
    title: 'Test Invoice',
    clientName: 'Acme Corp',
    serviceDescription: 'Web App Development',
    invoiceNumber: 'INV-101',
    date: '2026-07-21',
    items: [
      { id: '1', description: 'Development', quantity: 10, rate: 100 },
    ],
    currencySymbol: '$',
    orientation: Orientation.Portrait,
    pageSize: PageSize.A4,
    companyName: 'CapStudio Inc',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PdfTemplateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return template list', () => {
    expect(service.templates.length).toBeGreaterThan(0);
  });

  it('should generate invoice HTML with Plus Jakarta Sans font', () => {
    const html = service.generateHtml(mockData, 'invoice');
    expect(html).toContain('Plus Jakarta Sans');
    expect(html).toContain('Acme Corp');
    expect(html).toContain('$1000.00');
  });

  it('should generate certificate HTML', () => {
    const html = service.generateHtml(mockData, 'certificate');
    expect(html).toContain('Test Invoice');
    expect(html).toContain('Acme Corp');
  });
});
