import { Component, OnInit, ViewChild } from '@angular/core';
import { IonModal, IonRouterOutlet } from '@ionic/angular';
import { format, parseISO } from 'date-fns';
import { CalendarComponent, CalendarMode } from 'ionic6-calendar';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.page.html',
  styleUrls: ['./calendario.page.scss'],
})
export class CalendarioPage implements OnInit {
  calendar = { 
    mode: 'month' as CalendarMode, 
    currentDate: new Date(),
  };
  viewTitle = '';
  eventSource: any[] = [];
  showStart = false;
  showEnd = false;
  formattedStart = '';
  formattedEnd = '';

  @ViewChild(CalendarComponent) myCal!: CalendarComponent;
  @ViewChild('modal') modal!: IonModal;
  presentingElement:any = null;

  newEvent: any = {
    tittle: '',
    content: '',
    allDay: false,
    startTime: null,
    endTime: null,
  };


  constructor(private ionRouterOutlet: IonRouterOutlet, private userService: UserService) {
    this.presentingElement = ionRouterOutlet.nativeEl;
    
  }

  ngOnInit() {
    this.loadNotes();
  }

  setToday(){ 
    this.myCal.currentDate = new Date();
  }

  calendarBack(){
    this.myCal.slidePrev();
  }

  calendarForward(){
    this.myCal.slideNext();
  }

  onTimeSelected(ev: { selectedTime: Date; events: any[] }){
    this.formattedStart = format(ev.selectedTime, 'HH:mm, MMM d, yyyy');
    this.newEvent.startTime = format(ev.selectedTime, "yyyy-MM-dd'T'HH:mm:ss");
    
    const later = ev.selectedTime.setHours(ev.selectedTime.getHours() + 1);
    
    this.formattedEnd = format(later, 'HH:mm, MMM d, yyyy');
    this.newEvent.endTime = format(later, "yyyy-MM-dd'T'HH:mm:ss");

    if (this.calendar.mode === 'day' || this.calendar.mode === 'week') {
      this.modal.present();
    }
  }

  startChanged(value: any){
    this.newEvent.startTime = value;
    this.formattedStart = format(parseISO(value), 'HH:mm, MMM d, yyyy');
  }

  endChanged(value: any){
    this.newEvent.endTime = value;
    this.formattedEnd = format(parseISO(value), 'HH:mm, MMM d, yyyy');
  }

  //Cargar notas desde el servidor y mostrarlas en el calendario
  loadNotes() {
    this.userService.getNotes().subscribe((notes) => {
      this.eventSource = notes.map((note: any) => ({
        title: note.titulo,
        content: note.contenido,
        startTime: new Date(note.fecha + 'T' + (note.horaInicio || '06:00')),
        endTime: new Date(note.fecha + 'T' + (note.horaFin || '23:00')),
        allDay: note.allDay,
        noteId: note._id, 
      }));
    });
  }

  //Guardar un nuevo evento (nota)
  scheduleEvent() {
    if (!this.newEvent.startTime) {
      console.error('Error: La fecha de inicio es requerida.');
      return;
    }

    const note: any = {
      titulo: this.newEvent.title,
      contenido: this.newEvent.content,
      fecha: this.newEvent.startTime.split('T')[0],
      allDay: this.newEvent.allDay,
    };

    if (this.newEvent.allDay) {
      note.horaInicio = "06:00:00";
      note.horaFin = "23:00:00";
    } else {
      note.horaInicio = this.newEvent.startTime.split('T')[1] || "00:00:00";
      note.horaFin = this.newEvent.endTime?.split('T')[1] || "00:00:00";
    }

    console.log('Datos enviados al backend:', JSON.stringify(note, null, 2));

    this.userService.createNote(note).subscribe(
      (res) => {
        console.log('Nota creada:', res);
        this.loadNotes();
        this.modal.dismiss();
      },
      (err) => {
        console.error('Error al crear la nota:', err);
      }
    );
  }

  //Editar una nota existente
  editNote(note: any) {
    const updatedNote = {
      titulo: note.title,
      contenido: note.content,
      fecha: format(note.startTime, 'yyyy-MM-dd'),
      horaInicio: format(note.startTime, 'HH:mm'),
      horaFin: format(note.endTime, 'HH:mm'),
      allDay: note.allDay,
    };

    this.userService.updateNote(note.noteId, updatedNote).subscribe(() => {
      console.log('Nota actualizada');
      this.loadNotes();
    });
  }

  //Eliminar una nota
  deleteNote(note: any) {
    this.userService.deleteNote(note.noteId).subscribe(() => {
      console.log('Nota eliminada');
      this.loadNotes();
    });
  }
}