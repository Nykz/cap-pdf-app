import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { PdfService } from '../../services/pdf.service';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let pdfServiceSpy: jasmine.SpyObj<PdfService>;

  beforeEach(async () => {
    pdfServiceSpy = jasmine.createSpyObj('PdfService', ['isNativePlatform']);
    pdfServiceSpy.isNativePlatform.and.returnValue(false);

    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [{ provide: PdfService, useValue: pdfServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create header component', () => {
    expect(component).toBeTruthy();
  });
});
