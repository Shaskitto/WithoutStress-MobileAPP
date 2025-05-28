import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { PlanService } from 'src/app/services/plan.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})

export class PerfilPage implements OnInit {
  user: any;
  isLoading = true;
  perfilForm!: FormGroup;
  isEditing = false;
  isValidFileType = true;
  selectedFile: File | null = null;
  validationMessage: string = '';
  originalHorario: any;

  constructor(private userService: UserService, private authService: AuthService, private fb: FormBuilder, private planService: PlanService, private router: Router) { }

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
          this.user.profileImage = this.userService.getProfileImageUrl(userId) + '?t=' + timestamp;
        }
        this.initializeForm();  
        this.originalHorario = JSON.parse(JSON.stringify(this.user.horario));
      }
    });
  }

  // Inicializa el formulario con los datos del usuario
  initializeForm() {
    this.perfilForm = this.fb.group({
      username: [this.user.username, [Validators.required]],
      nombre_completo: [this.user.nombre_completo, [Validators.required]],
      profileImage: [this.user.profileImage], 
      edad: [this.user.edad, [Validators.required, Validators.min(17)]],
      semestre: [this.user.semestre, [Validators.min(1), Validators.max(4)]],
      sexo: [this.user.sexo],
      carrera: [this.user.carrera],
      actividades: [this.user.actividades, [Validators.required]],
      email: [this.user.email],
      informacion: [this.user.informacion, [Validators.required, Validators.maxLength(140)]],
      horario: this.fb.group({  
        manana: [this.user.horario?.manana || '', [this.maxLengthArrayValidator(2)]], 
        tarde: [this.user.horario?.tarde || '', [this.maxLengthArrayValidator(2)]],    
        noche: [this.user.horario?.noche || '', [this.maxLengthArrayValidator(2)]]   
      })
    });
  }

  // Validador personalizado para limitar la cantidad de horarios seleccionados
  maxLengthArrayValidator(max: number) {
    return (control: AbstractControl) => {
      if (control.value && control.value.length > max) {
        return { maxLengthArray: true };
      }
      return null;
    };
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

      const horarioCambio = this.horarioHaCambiado(userData.horario, this.originalHorario);

      // Datos básicos del usuario
      formData.append('nombre_completo', userData.nombre_completo);
      formData.append('username', userData.username);
      formData.append('edad', userData.edad);
      formData.append('semestre', userData.semestre);
      formData.append('sexo', userData.sexo);
      formData.append('carrera', userData.carrera);
      formData.append('email', userData.email);
      formData.append('informacion', userData.informacion);

      // Horario
      if (userData.horario) {
        if (userData.horario.manana) {
          userData.horario.manana.forEach((hora: string) => {
            formData.append('horario[manana][]', hora);
          });
        }
        if (userData.horario.tarde) {
          userData.horario.tarde.forEach((hora: string) => {
            formData.append('horario[tarde][]', hora);
          });
        }
        if (userData.horario.noche) {
          userData.horario.noche.forEach((hora: string) => {
            formData.append('horario[noche][]', hora);
          });
        }
      }

      // Imagen
      if (this.selectedFile) {
        formData.append('profileImage', this.selectedFile);
      }

      // Actividades
      userData.actividades.forEach((actividad: string) => {
        formData.append('actividades[]', actividad);
      });

      const userId = localStorage.getItem('userId');

      // Actualizar usuario
      this.userService.updateUser(formData).subscribe(
        response => {

          if (userId && horarioCambio) {
            this.planService.reorganizarPlanPorHorario(userId).subscribe(
              res => {
                this.planService.notifyPlanUpdated();
              },
              err => {
              }
            );
          }

          this.isEditing = false;
          this.loadUserData(); 
        },
        error => {
        }
      );
    }
  }

  // Comparar horarios
  horarioHaCambiado(nuevo: any, original: any): boolean {
    const franjas = ['manana', 'tarde', 'noche'];
    for (const franja of franjas) {
      const a = (original?.[franja] || []).slice().sort();
      const b = (nuevo?.[franja] || []).slice().sort();
      if (a.length !== b.length || a.some((val: any, i: string | number) => val !== b[i])) {
        return true;
      }
    }
    return false;
  }
  

  // Cerrar sesión
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }  
}