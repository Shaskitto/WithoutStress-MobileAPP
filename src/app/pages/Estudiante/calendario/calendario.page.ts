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
        if (!response || !Array.isArray(response.notas)) {
          this.eventSource = [];
          return;
        }
       
        this.eventSource = response.notas.map((note: any) => {
          const startTime = note.allDay
          ? new Date(`${note.fechaInicio.split('T')[0]}T00:00:00Z`)
          : new Date(`${note.fechaInicio.split('T')[0]}T${note.horaInicio || '00:00:00'}`);

        let endTime = note.allDay
          ? new Date(`${note.fechaFin.split('T')[0]}T23:59:59Z`)
          : new Date(`${note.fechaFin.split('T')[0]}T${note.horaFin || '23:59:59'}`);

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
      }
    );
  }
  

  //Guardar un nuevo evento (nota)
  scheduleEvent() {
    if (!this.newEvent.startTime) {
      return;
    }
   
    const note: any = {
      titulo: this.newEvent.title,
      fechaInicio: this.newEvent.startTime.split('T')[0],
      fechaFin: this.newEvent.endTime.split('T')[0],
      allDay: this.newEvent.allDay,
    };

    if (this.newEvent.allDay) {
      note.horaInicio = null;
      note.horaFin = null;
    } else {
      note.horaInicio = this.newEvent.startTime.split('T')[1] || '00:00:00';
      note.horaFin = this.newEvent.endTime.split('T')[1] || '23:59:59';
    }

    this.userService.createNote(note).subscribe(
      (res) => {
        this.loadNotes();
        this.modal.dismiss();
        if (this.myCal) {
          this.myCal.loadEvents();
        }
      },
      (err) => {
      }
    );
  }

  //Editar una nota existente
  editNote() {
    if (!this.selectedEvent) return;

    const updatedNote = {
      titulo: this.newEvent.title,
      fechaInicio: this.newEvent.startTime.split('T')[0],
      fechaFin: this.newEvent.endTime?.split('T')[0],
      horaInicio: this.newEvent.allDay ? null : this.newEvent.startTime.split('T')[1],
      horaFin: this.newEvent.allDay ? null : this.newEvent.endTime?.split('T')[1],
      allDay: this.newEvent.allDay,
    };

    this.userService.updateNote(this.selectedEvent.noteId, updatedNote).subscribe(() => {
      this.modal.dismiss();
      this.loadNotes();
      this.selectedEvent = null;
    });
  }

  //Eliminar una nota
  deleteNote() {
    if (!this.selectedEvent) return;

    this.userService.deleteNote(this.selectedEvent.noteId).subscribe(() => {
      this.modal.dismiss();
      this.loadNotes();
      this.selectedEvent = null;
    });
  }
}