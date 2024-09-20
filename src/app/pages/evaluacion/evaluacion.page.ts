import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-evaluacion',
  templateUrl: './evaluacion.page.html',
  styleUrls: ['./evaluacion.page.scss'],
})

export class EvaluacionPage{
  mostrarManana: boolean = false;
  mostrarTarde: boolean = false;
  mostrarNoche: boolean = false

  questions = [
    { id: 'carrera', texto: '¿Cuál es tu carrera?' },
    { id: 'semestre', texto: '¿Qué semestre estás cursando?' },
    { id: 'edad', texto: '¿Cuántos años tienes?' },
    { id: 'sexo', texto: '¿Cuál es tu sexo?' }, 
    { id: 'tecnicas', texto: '¿Has probado alguna vez técnicas de relajación o meditación para manejar el estrés académico?'},
    { id: 'actividades', texto: '¿Qué tipo de contenido te gustaria ver más?' },
    { id: 'horario', texto: '¿En qué horario prefieres realizar actividades?', 
      opcionesHorarios: {
        manana: ['06:00', '07:00', '08:00', '09:00', '10:00', '11:00'],
        tarde: ['12:00', '13:00', '14:00', '15:00', '16:00', '17:00'],
        noche: ['18:00', '19:00', '20:00', '21:00', '22:00', '23:00']
    }}
  ];

  answers: { [key: string]: string | number | string[] | any } = {
    carrera: '',
    semestre: 0,
    edad: 0,
    sexo: '',
    actividades: [],
    horario: {
      manana: [],
      tarde: [],
      noche: []
    }
  };

  currentQuestionIndex = 0;

  constructor(private userService: UserService, private router: Router) {}

  nextQuestion() {
    if (this.isQuestionAnswered()) {
      if (this.currentQuestionIndex < this.questions.length - 1) {
        this.currentQuestionIndex++;
      }
    }
  }
  
  isQuestionAnswered(): boolean {
    const currentQuestion = this.questions[this.currentQuestionIndex];
  
    if (currentQuestion.id === 'carrera') {
      return this.answers['carrera'] !== '';
    }
  
    if (currentQuestion.id === 'semestre') {
      return this.answers['semestre'] > 0; 
    }
  
    if (currentQuestion.id === 'edad') {
      return this.answers['edad'] > 0; 
    }
  
    if (currentQuestion.id === 'sexo') {
      return this.answers['sexo'] !== ''; 
    }
  
    if (currentQuestion.id === 'tecnicas') {
      return this.answers['tecnicas'] !== ''; 
    }
  
    if (currentQuestion.id === 'actividades') {
      return this.answers['actividades'].length > 0; 
    }
  
    if (currentQuestion.id === 'horario') {
      const horarios = this.answers['horario'];
      return horarios?.manana?.length > 0 || horarios?.tarde?.length > 0 || horarios?.noche?.length > 0;
    }
  
    return false; 
  }
  

  toggleSeleccion(periodo: 'manana' | 'tarde' | 'noche') {
    switch (periodo) {
      case 'manana':
        this.mostrarManana = !this.mostrarManana;
        break;
      case 'tarde':
        this.mostrarTarde = !this.mostrarTarde;
        break;
      case 'noche':
        this.mostrarNoche = !this.mostrarNoche;
        break;
    }
  }
  
  toggleHorario(opcion: string, periodo: 'manana' | 'tarde' | 'noche') {
    const selectedHorarios = this.answers['horario'][periodo];
    
    if (selectedHorarios.includes(opcion)) {
      this.answers['horario'][periodo] = selectedHorarios.filter((item: string) => item !== opcion);
    } else {
      if (selectedHorarios.length < 2) {
        selectedHorarios.push(opcion);
      }
    }
  }

  updateUser() {
    console.log('Datos a enviar:', this.answers);
    this.userService.updateUser(this.answers).subscribe(
      response => {
        console.log('Usuario actualizado con éxito:', response);
        this.navigateHome();
      },
      error => {
        console.error('Error al actualizar el usuario:', error);
      }
    );
  }

  navigateHome(){
    this.router.navigate(['/tabs/plan']);
  }
}