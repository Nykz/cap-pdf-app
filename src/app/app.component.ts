import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { addIcons } from 'ionicons';
import {
  closeOutline,
  openOutline,
  checkmarkCircleOutline,
  trashOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor() {
    addIcons({
      closeOutline,
      openOutline,
      checkmarkCircleOutline,
      trashOutline,
    });
    this.initializeApp();
  }

  private async initializeApp(): Promise<void> {
    if (Capacitor.isNativePlatform()) {
      try {
        await StatusBar.setStyle({ style: Style.Dark });
        await StatusBar.setBackgroundColor({ color: '#070b14' });
        await StatusBar.setOverlaysWebView({ overlay: false });
      } catch (err) {
        console.warn('Capacitor StatusBar config failed', err);
      }
    }
  }
}
