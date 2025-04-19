import { Component, OnInit } from '@angular/core';
import { ResourceService } from 'src/app/services/resource.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-explorar',
  templateUrl: './explorar.page.html',
  styleUrls: ['./explorar.page.scss'],
})
export class ExplorarPage implements OnInit { 
  categories = ['Aprender', 'Meditación y Mindfulness', 'Música y Sonidos Relajantes', 'Prácticas para Dormir', 'Ejercicios de Respiración', 'Podcast'];
  resources: any[] = [];
  showCategories: boolean = true;
  currentCategory: string = '';

  constructor(
    private resourceService: ResourceService,
    private router: Router
  ) {}

  ngOnInit() {}

  loadResources(categoria: string) {
    this.currentCategory = categoria;  
    this.resourceService.getByCategory(categoria).subscribe(data => {
      this.resources = data;
      this.showCategories = false;
    });
  }

  showCategoryList() {
    this.showCategories = true;
    this.resources = []; 
    this.currentCategory = '';
  }

  verDetalle(resourceId: string) {
    this.router.navigate(['/recurso-detalle', resourceId]);
  }
}
