import { Component, OnInit } from '@angular/core';
import { ResourceService } from 'src/app/services/resource.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-explorar',
  templateUrl: './explorar.page.html',
  styleUrls: ['./explorar.page.scss'],
})
export class ExplorarPage implements OnInit { 
  categories = ['Aprender', 'Meditación y Mindfulness', 'Música y Sonidos Relajantes', 'Prácticas para Dormir', 'Ejercicios de Respiración', 'Podcast'];
  resources: any[] = [];
  selectedResource: any = null;
  showCategories: boolean = true;
  currentCategory: string = '';
  showContent: boolean = false; 
  safeUrl: SafeResourceUrl | undefined;
  
  constructor(private resourceService: ResourceService, private sanitizer: DomSanitizer) { }

  ngOnInit() {}

  // Método para cargar recursos de la categoría seleccionada
  loadResources(categoria: string) {
    this.currentCategory = categoria;  
    this.resourceService.getByCategory(categoria).subscribe(data => {
      this.resources = data;
      this.selectedResource = null;
      this.showCategories = false;
      this.showContent = false;
    });
  }

  // Método para carga un recursos en especifico
  realizar(resourceId: any) {
    this.resourceService.getResource(resourceId._id).subscribe(data => {
      this.selectedResource = data; 
      this.showContent = false;
    });
  }

  // Método para volver a mostrar la lista de categorías
  showCategoryList() {
    this.showCategories = true;
    this.resources = []; 
    this.selectedResource = null; 
    this.currentCategory = '';
    this.showContent = false;
  }

  // Método para volver
  volver() {
    this.selectedResource = null; 
    this.showContent = false;
  }

  // Método para cargar el contenido
  loadContent() {
    this.showContent = true;
    if (this.selectedResource.mediaType === 'pdf') {
      this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        'https://docs.google.com/gview?embedded=true&url=' + this.selectedResource.contenidoUrl
      );
    } else if (this.selectedResource.mediaType === 'youtube') {
      this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        'https://www.youtube.com/embed/' + this.selectedResource.contenidoUrl
      );
    }
  }
}