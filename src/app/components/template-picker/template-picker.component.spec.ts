import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TemplatePickerComponent } from './template-picker.component';
import { PdfTemplateService } from '../../services/pdf-template.service';

describe('TemplatePickerComponent', () => {
  let component: TemplatePickerComponent;
  let fixture: ComponentFixture<TemplatePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemplatePickerComponent],
      providers: [PdfTemplateService],
    }).compileComponents();

    fixture = TestBed.createComponent(TemplatePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create template picker component', () => {
    expect(component).toBeTruthy();
  });
});
