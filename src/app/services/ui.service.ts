import { Injectable, inject } from '@angular/core';
import { ToastController, LoadingController } from '@ionic/angular/standalone';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

@Injectable({
  providedIn: 'root',
})
export class UiService {
  private toastCtrl = inject(ToastController);
  private loadingCtrl = inject(LoadingController);
  private loadingEl: any = null;

  async triggerHaptic(style: ImpactStyle = ImpactStyle.Light): Promise<void> {
    try {
      await Haptics.impact({ style });
    } catch {
      // Ignore fallback when haptics unavailable on web
    }
  }

  async triggerNotificationHaptic(type: NotificationType = NotificationType.Success): Promise<void> {
    try {
      await Haptics.notification({ type });
    } catch {
      // Ignore fallback when haptics unavailable on web
    }
  }

  async triggerSelectionHaptic(): Promise<void> {
    try {
      await Haptics.selectionStart();
      await Haptics.selectionChanged();
      await Haptics.selectionEnd();
    } catch {
      // Ignore fallback
    }
  }

  async showToast(
    message: string,
    color: 'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'danger' | 'dark' = 'primary',
    duration: number = 2500,
    icon?: string
  ): Promise<void> {
    const toast = await this.toastCtrl.create({
      message,
      color,
      duration,
      position: 'bottom',
      buttons: [{ role: 'cancel', icon: 'close-outline' }],
      icon,
    });
    await toast.present();
  }

  async showLoading(message: string): Promise<void> {
    this.loadingEl = await this.loadingCtrl.create({
      message,
      spinner: 'crescent',
      translucent: true,
      backdropDismiss: false,
    });
    await this.loadingEl.present();
  }

  async dismissLoading(): Promise<void> {
    if (this.loadingEl) {
      await this.loadingEl.dismiss();
      this.loadingEl = null;
    }
  }
}
