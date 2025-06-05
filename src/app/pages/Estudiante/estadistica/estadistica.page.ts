import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-estadistica',
  templateUrl: './estadistica.page.html',
  styleUrls: ['./estadistica.page.scss'],
})
export class EstadisticaPage implements OnInit {
  user: any;
  isLoading = true;
  groupedMoods: { semana: string; moods: any[] }[] = [];

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadUserData();
  }

  // Método para cargar los datos del usuario
  loadUserData() {
    this.userService.getUser().subscribe({
      next: (userData) => {
        this.user = userData;
        this.groupedMoods = this.groupMoodsByWeek(userData.estadoDeAnimo || []);
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  // Agrupar estados de ánimo por fecha
  groupMoodsByWeek(moods: any[]): { semana: string; moods: any[] }[] {
    const grouped: { [key: string]: any[] } = {};

    moods.forEach((mood) => {
      const fecha = new Date(mood.fecha);
      const monday = this.getStartOfWeek(fecha); // lunes
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6); // domingo

      const key = `Semana del ${this.formatDateShort(
        monday
      )} al ${this.formatDateShort(sunday)}`;

      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(mood);
    });

    return Object.keys(grouped).map((semana) => ({
      semana,
      moods: grouped[semana],
    }));
  }

  getStartOfWeek(date: Date): Date {
    const day = date.getDay(); // 0 (domingo) a 6 (sábado)
    const diff = day === 0 ? -6 : 1 - day; // si es domingo, retrocede 6
    const monday = new Date(date);
    monday.setDate(date.getDate() + diff);
    monday.setHours(0, 0, 0, 0);
    return monday;
  }

  // Fecha corta con día y formato amigable
  formatDateShort(date: Date): string {
    return date.toLocaleDateString('es-CO', {
      day: '2-digit',
      month: 'short',
    });
  }

  getMostFrequentMood(): string {
    if (!this.user?.estadoDeAnimo || this.user.estadoDeAnimo.length === 0)
      return '';

    const count: Record<string, number> = {};

    this.user.estadoDeAnimo.forEach((mood: { estado: string | number }) => {
      count[mood.estado] = (count[mood.estado] || 0) + 1;
    });

    return Object.keys(count).reduce(
      (a, b) => (count[a] > count[b] ? a : b),
      ''
    );
  }

  getMoodColor(estado: string): { ionic: string; hex: string } {
    const moods = {
      'Muy bien': { ionic: 'success', hex: '#28a745' }, // Verde
      Bien: { ionic: 'primary', hex: '#007bff' }, // Azul
      Neutro: { ionic: 'warning', hex: '#ffc107' }, // Amarillo
      Mal: { ionic: 'tertiary', hex: '#6c757d' }, // Gris
      'Muy mal': { ionic: 'danger', hex: '#dc3545' }, // Rojo
    } as const;

    return (
      moods[estado as keyof typeof moods] || { ionic: 'medium', hex: '#6c757d' }
    );
  }

  getMoodIcon(estado: string): string {
    const icons = {
      'Muy bien': 'happy-outline',
      Bien: 'thumbs-up-outline',
      Neutro: 'remove-circle-outline',
      Mal: 'sad-outline',
      'Muy mal': 'alert-circle-outline',
    } as const;

    return icons[estado as keyof typeof icons] || 'help-circle-outline';
  }

  getMoodStatistics() {
    const counts: { [key: string]: number } = {};

    if (!this.user || !this.user.estadoDeAnimo) return [];

    this.user.estadoDeAnimo.forEach((mood: any) => {
      counts[mood.estado] = (counts[mood.estado] || 0) + 1;
    });

    return Object.entries(counts).map(([estado, cantidad]) => ({
      estado,
      cantidad,
    }));
  }

  formatDate(fecha: string): string {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
