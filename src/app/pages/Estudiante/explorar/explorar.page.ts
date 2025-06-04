import { Component, OnInit } from '@angular/core';
import { ResourceService } from 'src/app/services/resource.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-explorar',
  templateUrl: './explorar.page.html',
  styleUrls: ['./explorar.page.scss'],
})
export class ExplorarPage implements OnInit {
  categories = [
    'Aprender',
    'Meditación y Mindfulness',
    'Música y Sonidos Relajantes',
    'Prácticas para Dormir',
    'Ejercicios de Respiración',
    'Podcast',
  ];
  resources: any[] = [];
  showCategories: boolean = true;
  currentCategory: string = '';
  currentDescription: string = '';
  showDescription: boolean = false;
  categoryDescriptions: { [key: string]: string } = {
    Aprender:
      'Aprender a cuidar tu mente es tan importante como cuidar tu cuerpo. En esta sección encontrarás recursos que te enseñarán las bases del bienestar emocional, el manejo del estrés, la comprensión de tus pensamientos y emociones, y cómo crear hábitos saludables que perduren en el tiempo. Este espacio es una guía para quienes buscan conocer más sobre sí mismos y dar los primeros pasos hacia una vida más plena y consciente.',
    'Meditación y Mindfulness':
      'La meditación no se trata de dejar la mente en blanco, sino de aprender a observarla con calma y sin juicio. Aquí encontrarás sesiones guiadas que te ayudarán a reducir la ansiedad, aumentar tu concentración y reconectarte contigo mismo. A través del mindfulness, podrás estar más presente en el aquí y ahora, cultivando una relación más amable contigo y con el mundo que te rodea. Si es tu primera vez, no te preocupes: te guiaremos paso a paso.',
    'Música y Sonidos Relajantes':
      'A veces, todo lo que necesitamos para sentirnos mejor es cerrar los ojos y dejarnos llevar por un sonido tranquilo. En esta categoría podrás disfrutar de paisajes sonoros diseñados para ayudarte a relajarte, dormir profundamente o mantener la concentración. Desde lluvia suave hasta melodías relajantes, este espacio es tu refugio auditivo para encontrar paz y equilibrio cuando lo necesites.',
    'Prácticas para Dormir':
      'Dormir bien es esencial para tu salud física y mental. Aquí descubrirás prácticas suaves para calmar tu mente antes de ir a la cama: ejercicios de respiración, meditaciones nocturnas, cuentos para dormir y sonidos que inducen al descanso profundo. Estas herramientas están pensadas para ayudarte a crear una rutina que favorezca un sueño reparador y un despertar lleno de energía.',
    'Ejercicios de Respiración':
      'Respirar es algo que hacemos todo el tiempo, pero rara vez le prestamos atención. Los ejercicios de respiración consciente son una forma simple y poderosa de reducir el estrés, regular tus emociones y mejorar tu bienestar general. En esta sección aprenderás técnicas que puedes usar en cualquier momento del día para recuperar la calma, encontrar enfoque y reconectar con tu cuerpo.',
    Podcast:
      'Acompáñate de voces que inspiran, educan y tranquilizan. En esta categoría encontrarás episodios en formato podcast sobre salud mental, crecimiento personal, manejo del estrés, y experiencias reales de personas como tú. Escúchalos mientras caminas, te relajas o simplemente necesitas una dosis de motivación y conexión emocional.',
  };

    categoryImages: { [key: string]: string } = {
    Aprender: 'assets/icon/Aprender.png',
    'Meditación y Mindfulness': 'assets/icon/Meditacion.png',
    'Música y Sonidos Relajantes': 'assets/icon/Musica.png',
    'Prácticas para Dormir': 'assets/icon/Dormir.png',
    'Ejercicios de Respiración': 'assets/icon/Respiracion.png',
    Podcast: 'assets/icon/Podcast.jpg',
  };

  currentImage: string = '';

  constructor(
    private resourceService: ResourceService,
    private router: Router
  ) {}

  ngOnInit() {}

  loadResources(categoria: string) {
    this.currentCategory = categoria;
    this.currentDescription = this.categoryDescriptions[categoria] || '';
    this.currentImage = this.categoryImages[categoria]
    this.showCategories = false;
    this.showDescription = true;
    this.resources = [];
  }

  mostrarRecursos() {
    this.resourceService
      .getByCategory(this.currentCategory)
      .subscribe((data) => {
        this.resources = data;
        this.showDescription = false;
      });
  }

  showCategoryList() {
    this.showCategories = true;
    this.showDescription = false;
    this.resources = [];
    this.currentCategory = '';
  }

  verDetalle(resourceId: string) {
    this.router.navigate(['/recurso-detalle', resourceId]);
  }
}
