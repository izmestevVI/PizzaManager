import { Injectable, signal } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly _isDarkMode = signal<boolean>(false);
  isDarkMode = this._isDarkMode.asReadonly();

  constructor() {
    this._initTheme();
  }

  private _initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = typeof window !== 'undefined' && typeof window.matchMedia === 'function'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
      : false;

    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      this._setDarkTheme(true);
    }
  }
  
  private _setDarkTheme(isDark: boolean) {
    this._isDarkMode.set(isDark);
    const element = document.querySelector('html');
    if (isDark) {
      element?.classList.add('dark'); // Переключение класса темы Aura
      localStorage.setItem('theme', 'dark');
    } else {
      element?.classList.remove('dark'); // Переключение класса темы Aura
      localStorage.setItem('theme', 'light');
    }
  }

  toggleTheme() {
    this._setDarkTheme(!this._isDarkMode());
  }
}