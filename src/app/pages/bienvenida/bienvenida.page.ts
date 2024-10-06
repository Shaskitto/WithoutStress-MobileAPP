import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bienvenida',
  templateUrl: './bienvenida.page.html',
  styleUrls: ['./bienvenida.page.scss'],
})
export class BienvenidaPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  // Navegar al login
  navigateLogin(){
    this.router.navigate(['/login'])
  }

  // Navegar al registro
  navigateRegister(){
    this.router.navigate(['/registro'])
  }

}
