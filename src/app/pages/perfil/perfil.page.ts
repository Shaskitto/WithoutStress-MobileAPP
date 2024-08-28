import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})

export class PerfilPage implements OnInit {
  private apiUrl = environment.apiUrl;
  user: any;
  perfilForm!: FormGroup;
  isEditing = false;
  selectedFile: File | null = null;

  constructor(private authService: AuthService, private fb: FormBuilder) { }

  ngOnInit() { 
    this.loadUserData();
  }

  // Método para cargar los datos del usuario
  loadUserData() {
    this.authService.getUser().subscribe({
      next: (userData) => {
        this.user = userData; 
        if (this.user.profileImage) {
          const userId = localStorage.getItem('userId');
          if (userId) {
            const timestamp = new Date().getTime();
            this.user.profileImage = `${this.apiUrl}/api/user/${userId}/profile-image?t=${timestamp}`;
          }
        }
        this.initializeForm();  
      }
    });
  }

  // Inicializa el formulario con los datos del usuario
  initializeForm() {
    this.perfilForm = this.fb.group({
      username: [this.user.username],
      profileImage: [this.user.profileImage], 
      edad: [this.user.edad, [Validators.min(1)]],
      semestre: [this.user.semestre, [Validators.min(1), Validators.max(4)]],
      sexo: [this.user.sexo],
      carrera: [this.user.carrera],
      actividades: [this.user.actividades],
      email: [this.user.email]
    });
  }

  // Maneja la selección de archivos
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.selectedFile = input.files[0]; 
    }
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      this.perfilForm.reset(this.user); 
    }
  }

  updateUser() {
    if (this.perfilForm.valid) {
      const formData = new FormData();
      const userData = this.perfilForm.value;

      formData.append('username', userData.username);
      formData.append('edad', userData.edad);
      formData.append('semestre', userData.semestre);
      formData.append('sexo', userData.sexo);
      formData.append('carrera', userData.carrera);
      formData.append('email', userData.email);

      if (this.selectedFile) {
        formData.append('profileImage', this.selectedFile);
      }

      userData.actividades.forEach((actividad: string) => {
        formData.append('actividades[]', actividad);
      });

      this.authService.updateUser(formData).subscribe(
        response => {
          console.log('Usuario actualizado con éxito:', response);
          this.isEditing = false; 
          this.loadUserData();
        },
        error => {
          console.error('Error al actualizar el usuario:', error);
        }
      );
    }
  }

  logout() {
    this.authService.logout();
  }
}
