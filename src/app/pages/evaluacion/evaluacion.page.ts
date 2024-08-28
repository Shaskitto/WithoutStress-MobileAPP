import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-evaluacion',
  templateUrl: './evaluacion.page.html',
  styleUrls: ['./evaluacion.page.scss'],
})
export class EvaluacionPage{
  questions = [
    { id: 'carrera', texto: '¿Cuál es tu carrera?' },
    { id: 'semestre', texto: '¿Qué semestre estás cursando?' },
    { id: 'edad', texto: '¿Cuántos años tienes?' },
    { id: 'sexo', texto: '¿Cuál es tu sexo?' }, 
    { id: 'tecnicas', texto: '¿Has probado alguna vez técnicas de relajación o meditación para manejar el estrés académico?'},
    { id: 'actividades', texto: '¿Qué tipo de contenido te gustaria ver más?' } 
  ];

  answers: { [key: string]: string | number | string[] } = {
    carrera: '',
    semestre: 0,
    edad: 0,
    sexo: '',
    actividades: []
  };

  currentQuestionIndex = 0;

  constructor(private authService: AuthService, private router: Router) {}

  nextQuestion() {
    if (this.isQuestionAnswered()) {
      if (this.currentQuestionIndex < this.questions.length - 1) {
        this.currentQuestionIndex++;
      }
    }
  }
  
  isQuestionAnswered(): boolean {
    const currentQuestion = this.questions[this.currentQuestionIndex];
    if (currentQuestion.id === 'tecnicas') {
      return this.answers[currentQuestion.id] !== undefined;
    }
    return this.answers[currentQuestion.id] !== undefined && this.answers[currentQuestion.id] !== '';
  }

  updateUser() {
    this.authService.updateUser(this.answers).subscribe(
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