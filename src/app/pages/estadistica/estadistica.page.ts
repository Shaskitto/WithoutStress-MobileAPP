import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-estadistica',
  templateUrl: './estadistica.page.html',
  styleUrls: ['./estadistica.page.scss'],
})
export class EstadisticaPage implements OnInit {
  user: any;
  
  constructor(private userService: UserService) { }

  ngOnInit() {
    this.loadUserData();
  }

  // Método para cargar los datos del usuario
  loadUserData() {
    this.userService.getUser().subscribe({
      next: (userData) => {
        this.user = userData; 
      }
    });
  }

  getMostFrequentMood(): string {
    if (!this.user?.estadoDeAnimo || this.user.estadoDeAnimo.length === 0) return '';
  
    const count: Record<string, number> = {};
    
    this.user.estadoDeAnimo.forEach((mood: { estado: string | number; }) => {
      count[mood.estado] = (count[mood.estado] || 0) + 1;
    });
  
    return Object.keys(count).reduce((a, b) => count[a] > count[b] ? a : b, '');
  }
  

  getMoodColor(estado: string): { ionic: string; hex: string } {
    const moods = {
      'Muy bien': { ionic: 'success', hex: '#28a745' },  // Verde
      'Bien': { ionic: 'primary', hex: '#007bff' },      // Azul
      'Neutro': { ionic: 'warning', hex: '#ffc107' },    // Amarillo
      'Mal': { ionic: 'tertiary', hex: '#6c757d' },      // Gris
      'Muy mal': { ionic: 'danger', hex: '#dc3545' }     // Rojo
    } as const;
  
    return moods[estado as keyof typeof moods] || { ionic: 'medium', hex: '#6c757d' };
  }
  
  
  getMoodIcon(estado: string): string {
    const icons = {
      'Muy bien': 'happy-outline',
      'Bien': 'thumbs-up-outline',
      'Neutro': 'remove-circle-outline',
      'Mal': 'sad-outline',
      'Muy mal': 'alert-circle-outline'
    } as const;
  
    return icons[estado as keyof typeof icons] || 'help-circle-outline';
  }

  getMoodStatistics() {
    const counts: { [key: string]: number } = {};
  
    if (!this.user || !this.user.estadoDeAnimo) return [];
  
    this.user.estadoDeAnimo.forEach((mood: any) => {
      counts[mood.estado] = (counts[mood.estado] || 0) + 1;
    });
  
    return Object.entries(counts).map(([estado, cantidad]) => ({ estado, cantidad }));
  }  
  
  formatDate(fecha: string): string {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}