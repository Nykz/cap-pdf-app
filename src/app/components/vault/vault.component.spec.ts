import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VaultComponent } from './vault.component';
import { PdfHistoryService } from '../../services/pdf-history.service';
import { PdfService } from '../../services/pdf.service';
import { PdfTemplateService } from '../../services/pdf-template.service';
import { UiService } from '../../services/ui.service';

import { ModalController } from '@ionic/angular/standalone';

describe('VaultComponent', () => {
  let component: VaultComponent;
  let fixture: ComponentFixture<VaultComponent>;
  let modalCtrlSpy: jasmine.SpyObj<ModalController>;

  beforeEach(async () => {
    modalCtrlSpy = jasmine.createSpyObj('ModalController', ['create']);

    await TestBed.configureTestingModule({
      imports: [VaultComponent],
      providers: [
        PdfHistoryService,
        PdfService,
        PdfTemplateService,
        UiService,
        { provide: ModalController, useValue: modalCtrlSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(VaultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create vault component', () => {
    expect(component).toBeTruthy();
  });
});
