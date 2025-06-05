import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  estudiantes: any[] = [];
  constructor(private userService: UserService) {}

  ngOnInit() {
    this.getEstudiantes();
  }

  // Método para cargar los estudiantes
  getEstudiantes() {
    this.userService.getUsers().subscribe((users) => {
      const estudiantesFiltrados = users
        .filter((user: { rol: string }) => user.rol === 'Estudiante')
        .map((user: { profileImage: string; _id: any }) => {
          user.profileImage = this.userService.getProfileImageUrl(user._id);
          return user;
        });

      this.estudiantes = estudiantesFiltrados;

      setTimeout(() => {
        this.estudiantes.forEach((est) => {
          // 👇 Ajustar zona horaria de las fechas aquí
          if (est.estadoDeAnimo) {
            est.estadoDeAnimo = est.estadoDeAnimo.map((e: any) => ({
              ...e,
              fecha: new Date(
                new Date(e.fecha).getTime() +
                  new Date().getTimezoneOffset() * 60000
              ),
            }));
          }

          this.renderLineChart(est);
          this.renderPieChart(est);
        });
      }, 500);
    });
  }

  renderLineChart(estudiante: any) {
    const estados = estudiante.estadoDeAnimo || [];
    const sortedEstados = [...estados].sort(
      (a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
    );

    const labels = sortedEstados.map((e) =>
      new Date(e.fecha).toLocaleDateString()
    );
    const data = sortedEstados.map((e) => this.estadoToValor(e.estado));

    new Chart(`lineChart-${estudiante._id}`, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Estado de Ánimo',
            data,
            borderColor: 'rgba(54, 162, 235, 1)',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            fill: false,
            tension: 0,
            pointRadius: 4,
            pointHoverRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: 10,
        },
        plugins: {
          legend: {
            display: true,
            labels: {
              font: {
                size: 12,
              },
            },
          },
          tooltip: {
            mode: 'index',
            intersect: false,
          },
        },
        scales: {
          x: {
            ticks: {
              autoSkip: true,
              maxTicksLimit: 6,
              font: {
                size: 10,
              },
            },
          },
          y: {
            suggestedMin: 1,
            suggestedMax: 5,
            ticks: {
              stepSize: 1,
              callback: (value) => this.valorToEstado(value as number),
              font: {
                size: 10,
              },
            },
          },
        },
      },
    });
  }

  renderPieChart(estudiante: any) {
    const estados = estudiante.estadoDeAnimo || [];
    const conteo: Record<string, number> = {};

    estados.forEach((e: any) => {
      conteo[e.estado] = (conteo[e.estado] || 0) + 1;
    });

    const labels = Object.keys(conteo);
    const data = Object.values(conteo);
    const backgroundColors = labels.map(
      (estado) => this.getMoodColor(estado).hex
    );

    const total = (data as number[]).reduce((acc, val) => acc + val, 0);
    const percentageLabels = labels.map((label, i) => {
      const percentage = ((data[i] / total) * 100).toFixed(1);
      return `${label} (${percentage}%)`;
    });

    new Chart(`pieChart-${estudiante._id}`, {
      type: 'pie',
      data: {
        labels: percentageLabels,
        datasets: [
          {
            data,
            backgroundColor: backgroundColors,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: 10,
        },
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              font: {
                size: 12,
              },
              padding: 10,
            },
          },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const label = ctx.label || '';
                return label;
              },
            },
          },
        },
      },
    });
  }

  getMoodColor(estado: string): { ionic: string; hex: string } {
    const moods = {
      'Muy bien': { ionic: 'success', hex: '#28a745' },
      Bien: { ionic: 'primary', hex: '#007bff' },
      Neutro: { ionic: 'warning', hex: '#ffc107' },
      Mal: { ionic: 'tertiary', hex: '#6c757d' },
      'Muy mal': { ionic: 'danger', hex: '#dc3545' },
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

  // Convierte estados en valores numéricos para el gráfico de líneas
  estadoToValor(estado: string): number {
    const estadosMap: Record<string, number> = {
      'muy mal': 1,
      mal: 2,
      neutro: 3,
      bien: 4,
      'muy bien': 5,
    };

    return estadosMap[estado.toLowerCase()] || 3;
  }

  valorToEstado(valor: number): string {
    const valoresMap: Record<number, string> = {
      1: 'Muy mal',
      2: 'Mal',
      3: 'Neutro',
      4: 'Bien',
      5: 'Muy bien',
    };
    return valoresMap[valor] || '';
  }
}
