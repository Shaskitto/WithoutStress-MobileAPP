import { Component, OnInit, ViewChild } from '@angular/core';
import { IonModal, IonRouterOutlet } from '@ionic/angular';
import { format, parseISO } from 'date-fns';
import { CalendarComponent, CalendarMode } from 'ionic6-calendar';

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
    allDay: false,
    startTime: null,
    endTime: null,
  };


  constructor(private ionRouterOutlet: IonRouterOutlet) {
    this.presentingElement = ionRouterOutlet.nativeEl;
    
  }

  ngOnInit() {}

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

  scheduleEvent(){}
}