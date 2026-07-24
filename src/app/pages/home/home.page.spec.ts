import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomePage } from './home.page';
import { ModalController } from '@ionic/angular/standalone';
import { PdfTemplateService } from '../../services/pdf-template.service';
import { PdfService } from '../../services/pdf.service';
import { PdfHistoryService } from '../../services/pdf-history.service';
import { UiService } from '../../services/ui.service';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
  let modalCtrlSpy: jasmine.SpyObj<ModalController>;

  beforeEach(async () => {
    modalCtrlSpy = jasmine.createSpyObj('ModalController', ['create']);

    await TestBed.configureTestingModule({
      imports: [HomePage],
      providers: [
        { provide: ModalController, useValue: modalCtrlSpy },
        PdfTemplateService,
        PdfService,
        PdfHistoryService,
        UiService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create home page', () => {
    expect(component).toBeTruthy();
  });
});
