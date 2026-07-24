import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LivePreviewModalComponent } from './live-preview-modal.component';
import { ModalController } from '@ionic/angular/standalone';

describe('LivePreviewModalComponent', () => {
  let component: LivePreviewModalComponent;
  let fixture: ComponentFixture<LivePreviewModalComponent>;
  let modalCtrlSpy: jasmine.SpyObj<ModalController>;

  beforeEach(async () => {
    modalCtrlSpy = jasmine.createSpyObj('ModalController', ['dismiss']);

    await TestBed.configureTestingModule({
      imports: [LivePreviewModalComponent],
      providers: [{ provide: ModalController, useValue: modalCtrlSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(LivePreviewModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create live preview modal component', () => {
    expect(component).toBeTruthy();
  });

  it('should dismiss modal when dismiss() is called', () => {
    component.dismiss();
    expect(modalCtrlSpy.dismiss).toHaveBeenCalled();
  });
});
