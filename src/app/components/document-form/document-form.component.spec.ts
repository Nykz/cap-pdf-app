import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DocumentFormComponent } from './document-form.component';
import { UiService } from '../../services/ui.service';

describe('DocumentFormComponent', () => {
  let component: DocumentFormComponent;
  let fixture: ComponentFixture<DocumentFormComponent>;
  let uiSpy: jasmine.SpyObj<UiService>;

  beforeEach(async () => {
    uiSpy = jasmine.createSpyObj('UiService', ['triggerHaptic', 'triggerSelectionHaptic', 'triggerNotificationHaptic']);

    await TestBed.configureTestingModule({
      imports: [DocumentFormComponent],
      providers: [{ provide: UiService, useValue: uiSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(DocumentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create document form component', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate subtotal correctly', () => {
    expect(component.subtotal()).toBe(2450);
  });

  it('should add item when addItem is called', async () => {
    const initialLen = component.items().length;
    await component.addItem();
    expect(component.items().length).toBe(initialLen + 1);
  });
});
