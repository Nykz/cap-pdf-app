import { TestBed } from '@angular/core/testing';
import { PdfService } from './pdf.service';
import { PdfTemplateService } from './pdf-template.service';
import { PdfHistoryService } from './pdf-history.service';
import { UiService } from './ui.service';
import { DocumentData, Orientation, PageSize } from '../interfaces/pdf.interface';

import { ModalController } from '@ionic/angular/standalone';

describe('PdfService', () => {
  let service: PdfService;
  let historySpy: jasmine.SpyObj<PdfHistoryService>;
  let uiSpy: jasmine.SpyObj<UiService>;
  let modalCtrlSpy: jasmine.SpyObj<ModalController>;

  const mockData: DocumentData = {
    title: 'Test Invoice',
    clientName: 'Test Corp',
    serviceDescription: 'Web App',
    invoiceNumber: 'INV-99',
    date: '2026-07-21',
    items: [{ id: '1', description: 'Design', quantity: 2, rate: 150 }],
    currencySymbol: '$',
    orientation: Orientation.Portrait,
    pageSize: PageSize.A4,
    companyName: 'CapStudio',
  };

  beforeEach(() => {
    historySpy = jasmine.createSpyObj('PdfHistoryService', ['addRecord']);
    uiSpy = jasmine.createSpyObj('UiService', [
      'triggerHaptic',
      'triggerNotificationHaptic',
      'showToast',
    ]);
    modalCtrlSpy = jasmine.createSpyObj('ModalController', ['create']);

    TestBed.configureTestingModule({
      providers: [
        PdfService,
        PdfTemplateService,
        { provide: PdfHistoryService, useValue: historySpy },
        { provide: UiService, useValue: uiSpy },
        { provide: ModalController, useValue: modalCtrlSpy },
      ],
    });

    service = TestBed.inject(PdfService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should generate PDF record and add to history', async () => {
    const record = await service.generatePdf(mockData, 'invoice');
    expect(record).toBeTruthy();
    expect(record.totalAmount).toBe(300);
    expect(historySpy.addRecord).toHaveBeenCalledWith(record);
  });
});
