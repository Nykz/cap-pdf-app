import { TestBed } from '@angular/core/testing';
import { UiService } from './ui.service';
import { ToastController } from '@ionic/angular/standalone';

describe('UiService', () => {
  let service: UiService;
  let toastCtrlSpy: jasmine.SpyObj<ToastController>;

  beforeEach(() => {
    toastCtrlSpy = jasmine.createSpyObj('ToastController', ['create']);
    const mockToast = jasmine.createSpyObj('HTMLIonToastElement', ['present']);
    toastCtrlSpy.create.and.returnValue(Promise.resolve(mockToast));

    TestBed.configureTestingModule({
      providers: [
        UiService,
        { provide: ToastController, useValue: toastCtrlSpy },
      ],
    });
    service = TestBed.inject(UiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should present toast when showToast is called', async () => {
    await service.showToast('Test Toast', 'success');
    expect(toastCtrlSpy.create).toHaveBeenCalled();
  });

  it('should not throw error on triggerHaptic', async () => {
    await expectAsync(service.triggerHaptic()).toBeResolved();
  });
});
