import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ResourceService } from 'src/app/services/resource.service';

@Component({
  selector: 'app-explorar',
  templateUrl: './explorar.page.html',
  styleUrls: ['./explorar.page.scss'],
})
export class ExplorarPage implements OnInit { 
  categories = ['Aprender', 'Meditación', 'Sonidos Relajantes', 'Prácticas para Dormir', 'Ejercicios de respiración', 'Música'];
  resources: any[] = [];
  selectedResource: any = null;
  showCategories: boolean = true;
  currentCategory: string = '';
  pdfURL: string  | null = null;
  audioURL: string | null = null;

  constructor(private resourceService: ResourceService, private sanitizer: DomSanitizer) { }

  ngOnInit() {
    
  }

  // Método para cargar recursos de la categoría seleccionada
  loadResources(categoria: string) {
    this.resourceService.getByCategory(categoria).subscribe(data => {
      this.resources = data; 
      this.selectedResource = null;
      this.showCategories = false;
    });
  }

  // Método para carga un recursos en especifico
  realizar(resourceId: any) {
    this.resourceService.getResource(resourceId._id).subscribe(data => {
      this.selectedResource = data; 
    });
  }

  // Método para volver a mostrar la lista de categorías
  showCategoryList() {
    this.showCategories = true;
    this.resources = []; 
    this.selectedResource = null; 
    this.currentCategory = '';
  }

  // Método para volver
  volver() {
    this.selectedResource = null; 
  }

  comenzar(resource: any) {
    this.resourceService.getContent(resource._id).subscribe(
      (blob: Blob) => {
        const mimeType = blob.type;
        const fileURL = URL.createObjectURL(blob);

        if (mimeType === 'application/pdf') {
          this.pdfURL = fileURL; 
          window.open(fileURL);
        } else if (mimeType === 'audio/mpeg' || mimeType === 'audio/mp3') {
          this.audioURL = fileURL;
        } else {
          console.error('Tipo de archivo no soportado:', mimeType);
        }
      },
      error => {
        console.error('Error al obtener el contenido del recurso:', error);
      }
    );
  }
  
  // Método para abrir el visor de PDF en la misma página
  openPdfViewer(pdfURL: string) {
    this.pdfURL = pdfURL; // Almacena la URL en una propiedad para el visor
  }
  
  // Método para reproducir audio
  playAudio(audioURL: string) {
    const audio = new Audio(audioURL);
    audio.play().then(() => {
      console.log('Reproduciendo audio:', audioURL);
    }).catch(error => {
      console.error('Error al reproducir audio:', error);
    });
  }
}