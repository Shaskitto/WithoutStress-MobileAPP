import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-perfil-psicologo',
  templateUrl: './perfil-psicologo.page.html',
  styleUrls: ['./perfil-psicologo.page.scss'],
})
export class PerfilPsicologoPage implements OnInit {
  user: any;
  isLoading = true;
  perfilForm!: FormGroup;
  isEditing = false;
  isValidFileType = true;
  selectedFile: File | null = null;
  validationMessage: string = '';

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  // Cargar los datos del usuario cuando se inicializa el componente
  ngOnInit() {
    this.loadUserData();
  }

  // Cargar los datos del usuario cada vez que la vista vuelve a ser visible
  ionViewWillEnter() {
    this.loadUserData();
  }

  // Método para cargar los datos del usuario
  loadUserData() {
    this.userService.getUser().subscribe({
      next: (userData) => {
        this.user = userData;
        this.isLoading = false;

        const userId = localStorage.getItem('userId');
        if (userId && this.user.profileImage) {
          const timestamp = new Date().getTime();
          this.user.profileImage =
            this.userService.getProfileImageUrl(userId) + '?t=' + timestamp;
        }
        this.initializeForm();
      },
    });
  }

  // Inicializa el formulario con los datos del usuario
  initializeForm() {
    this.perfilForm = this.fb.group({
      username: [this.user.username, [Validators.required]],
      nombre_completo: [this.user.nombre_completo, [Validators.required]],
      profileImage: [this.user.profileImage],
      edad: [this.user.edad, [Validators.required, Validators.min(17)]],
      sexo: [this.user.sexo],
      email: [this.user.email],
      informacion: [
        this.user.informacion,
        [Validators.required, Validators.maxLength(140)],
      ],
    });
  }

  // Maneja la selección de archivos
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      const fileType = file.type.split('/')[0];

      if (fileType !== 'image') {
        this.isValidFileType = false; 
        this.selectedFile = null;  
        this.validationMessage = 'El archivo seleccionado no es una imagen';
      } else {
        this.isValidFileType = true;  
        this.selectedFile = file;
        this.validationMessage = '';
      }
    } 
  }

  // Si está en modo de edición y la edición se cierra, resetear a los valores originales
  toggleEdit() {
    if (this.isEditing) {
      this.perfilForm.reset(this.user);
    }
    this.isEditing = !this.isEditing;
  }

  // Actualizar datos el usuario
  updateUser() {
    if (this.perfilForm.valid) {
      const formData = new FormData();
      const userData = this.perfilForm.value;

      formData.append('nombre_completo', userData.nombre_completo);
      formData.append('username', userData.username);
      formData.append('edad', userData.edad);
      formData.append('sexo', userData.sexo);
      formData.append('email', userData.email);
      formData.append('informacion', userData.informacion);

      if (this.selectedFile) {
        formData.append('profileImage', this.selectedFile);
      }

      this.userService.updateUser(formData).subscribe(
        response => {
          this.isEditing = false;
          this.loadUserData(); 
        },
        error => {
        }
      );
    }
  }

  // Cerrar sesión
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
