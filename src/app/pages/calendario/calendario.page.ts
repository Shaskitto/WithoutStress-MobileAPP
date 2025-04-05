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
  selectedEvent: any = null;

  @ViewChild(CalendarComponent) myCal!: CalendarComponent;
  @ViewChild('modal') modal!: IonModal;
  presentingElement:any = null;

  newEvent: any = {
    tittle: '',
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

  resetNewEvent() {
    this.newEvent = {
      title: '',
      allDay: false,
      startTime: null,
      endTime: null,
    };
  
    this.formattedStart = '';
    this.formattedEnd = '';
  }

  onTimeSelected(ev: { selectedTime: Date; events: any[] }) {
    this.selectedEvent = null;
    this.resetNewEvent(); 
    let selectedDate = new Date(ev.selectedTime);
  
    if (this.calendar.mode === 'month') {
      selectedDate.setHours(6, 0, 0);
    }
  
    this.formattedStart = format(selectedDate, 'HH:mm, MMM d, yyyy');
    this.newEvent.startTime = format(selectedDate, "yyyy-MM-dd'T'HH:mm:ss");
  
    const later = new Date(selectedDate);
    later.setHours(selectedDate.getHours() + 1);
  
    if (this.calendar.mode === 'month') {
      later.setHours(23, 0, 0);
    }
  
    this.formattedEnd = format(later, 'HH:mm, MMM d, yyyy');
    this.newEvent.endTime = format(later, "yyyy-MM-dd'T'HH:mm:ss");
  
    if (this.calendar.mode === 'day' || this.calendar.mode === 'week') {
      this.modal.present();
    }
  }
  
  onEventSelected(event: any) {
    this.newEvent = {
      title: event.title,
      allDay: event.allDay,
      startTime: format(event.startTime, "yyyy-MM-dd'T'HH:mm:ss"),
      endTime: format(event.endTime, "yyyy-MM-dd'T'HH:mm:ss"),
    };
  
    this.formattedStart = format(event.startTime, 'HH:mm, MMM d, yyyy');
    this.formattedEnd = format(event.endTime, 'HH:mm, MMM d, yyyy');
    this.selectedEvent = event;
  
    this.modal.present();
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
    this.userService.getNotes().subscribe(
      (response) => {
        console.log('Notas recibidas:', response); 

  
        if (!response || !Array.isArray(response.notas)) {
          console.error('Error: La respuesta no contiene un array válido', response);
          this.eventSource = [];
          return;
        }
       
        this.eventSource = response.notas.map((note: any) => {
          const fechaBase = note.fecha.split('T')[0];
        
          const startTime = note.allDay 
            ? new Date(`${fechaBase}T00:00:00Z`)  
            : new Date(`${fechaBase}T${note.horaInicio || '00:00:00'}`);

          const endTime = note.allDay
            ? new Date(`${fechaBase}T23:59:59Z`)  
            : new Date(`${fechaBase}T${note.horaFin || '23:59:59'}`);
        
          return {
            title: note.titulo,
            startTime: startTime,
            endTime: endTime,
            allDay: note.allDay,
            noteId: note._id,
          };
        });
        
        if (this.myCal) {
          this.myCal.eventSource = [...this.eventSource]; 
          this.myCal.loadEvents();
        }
        
      },
      (error) => {
        console.error('Error al cargar notas:', error);
      }
    );
  }
  

  //Guardar un nuevo evento (nota)
  scheduleEvent() {
    if (!this.newEvent.startTime) {
      console.error('Error: La fecha de inicio es requerida.');
      return;
    }
    
    const note: any = {
      titulo: this.newEvent.title,
      fecha: this.newEvent.startTime.split('T')[0],
      allDay: this.newEvent.allDay,
    };

    if (this.newEvent.allDay) {
      note.horaInicio = null; // Empieza a medianoche
      note.horaFin = null;
    } else {
      note.horaInicio = this.newEvent.startTime.split('T')[1] || "00:00:00";
      note.horaFin = this.newEvent.endTime?.split('T')[1] || "00:00:00";
    }

    this.userService.createNote(note).subscribe(
      (res) => {
        console.log('Nota creada:', res);
        this.loadNotes();
        this.modal.dismiss();
        if (this.myCal) {
          this.myCal.loadEvents();
        }
      },
      (err) => {
        console.error('Error al crear la nota:', err);
      }
    );
  }

  //Editar una nota existente
  editNote() {
    if (!this.selectedEvent) return;

    const updatedNote = {
      titulo: this.newEvent.title,
      fecha: this.newEvent.startTime.split('T')[0],
      horaInicio: this.newEvent.allDay ? null : this.newEvent.startTime.split('T')[1],
      horaFin: this.newEvent.allDay ? null : this.newEvent.endTime?.split('T')[1],
      allDay: this.newEvent.allDay,
    };

    this.userService.updateNote(this.selectedEvent.noteId, updatedNote).subscribe(() => {
      console.log('Nota actualizada');
      this.modal.dismiss();
      this.loadNotes();
      this.selectedEvent = null;
    });
  }

  //Eliminar una nota
  deleteNote() {
    if (!this.selectedEvent) return;

    this.userService.deleteNote(this.selectedEvent.noteId).subscribe(() => {
      console.log('Nota eliminada');
      this.modal.dismiss();
      this.loadNotes();
      this.selectedEvent = null;
    });
  }
}