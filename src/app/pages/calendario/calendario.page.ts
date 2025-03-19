import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.page.html',
  styleUrls: ['./calendario.page.scss'],
})
export class CalendarioPage implements OnInit {
  calendarioForm!: FormGroup;
  selectedDate: string = new Date().toISOString();
  isEditing = false;
  editingNoteId: string | null = null;
  userNotes: any[] = []; 

  constructor(private fb: FormBuilder, private userService: UserService, private alertController: AlertController) {}

  ngOnInit() {
    this.initializeForm();
    this.loadUserNotes(); 
  }

  // Método modificado para mostrar una alerta antes de eliminar la nota
  async confirmDeleteNote(noteId: string) {
    const alert = await this.alertController.create({
      header: 'Eliminar Nota',
      message: '¿Estás seguro de que quieres eliminar esta nota?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Eliminación cancelada');
          }
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.deleteNote(noteId);
          }
        }
      ]
    });

    await alert.present();
  }

  // Inicializa el formulario
  initializeForm() {
    this.calendarioForm = this.fb.group({
      fecha: ['', Validators.required],
      hora: ['', Validators.required],
      titulo: ['', [Validators.required, Validators.maxLength(50)]],
      contenido: ['', [Validators.required, Validators.maxLength(200)]]
    });
  }

  // Maneja la selección de la fecha
  onDateChange(event: any) {
    const fullDate = event.detail.value;
    this.selectedDate = fullDate.slice(0, 10);
    this.calendarioForm.patchValue({ fecha: this.selectedDate });

    // Buscar si hay una nota existente para la fecha seleccionada
    const existingNote = this.userNotes.find(note => note.fecha === this.selectedDate);
    if (existingNote) {
      this.editNote(existingNote);
    } else {
      this.isEditing = false;
      this.editingNoteId = null;
      this.calendarioForm.reset({ fecha: this.selectedDate });
    }
  }

  getFormattedDate(isoDate: string): string {
    const date = new Date(isoDate);
    return date.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: '2-digit', day: '2-digit' });
  }
  

  // Cargar todas las notas del usuario y eliminar las expiradas
  loadUserNotes() {
    this.userService.getNotes().subscribe({
      next: (response) => {
        const notes = response?.notas; 
        
        if (Array.isArray(notes)) {
          const now = new Date(); 

          notes.forEach(note => {
            const noteDate = new Date(note.fecha);
            const timeDiff = now.getTime() - noteDate.getTime();
            const hoursDiff = timeDiff / (1000 * 60 * 60); 

            if (hoursDiff > 24) {
              this.deleteNote(note._id); 
            }
          });

          this.userNotes = notes.filter(note => {
            const noteDate = new Date(note.fecha);
            return (now.getTime() - noteDate.getTime()) <= (24 * 60 * 60 * 1000);
          });
        } else {
          console.error("Error: La respuesta no es un array", response);
          this.userNotes = []; 
        }
      },
      error: (err) => console.error('Error al cargar notas:', err)
    });
  }

  // Crear nueva nota
  createNote() {
    if (this.calendarioForm.valid) {
      const noteData = this.calendarioForm.value;

      this.userService.createNote(noteData).subscribe({
        next: (newNote) => {
          this.userNotes.push(newNote); 
          this.calendarioForm.reset();
          this.loadUserNotes();
        },
        error: (err) => console.error('Error al crear nota:', err)
      });
    }
  }

  // Editar una nota existente
  editNote(note: any) {
    this.isEditing = true;
    this.editingNoteId = note._id;
    this.calendarioForm.patchValue(note);
  }

  // Guardar cambios en una nota existente
  updateNote() {
    if (this.calendarioForm.valid && this.editingNoteId) {
      const noteData = this.calendarioForm.value;

      this.userService.updateNote(this.editingNoteId, noteData).subscribe({
        next: () => {
          const index = this.userNotes.findIndex(n => n._id === this.editingNoteId);
          if (index !== -1) this.userNotes[index] = { ...noteData, _id: this.editingNoteId }; 
          this.cancelEdit();
        },
        error: (err) => console.error('Error al actualizar nota:', err)
      });
    }
  }

  // Método para eliminar la nota (se ejecuta solo si el usuario confirma)
  private deleteNote(noteId: string) {
    this.userService.deleteNote(noteId).subscribe({
      next: () => {
        this.userNotes = this.userNotes.filter(n => n._id !== noteId);
        if (this.editingNoteId === noteId) this.cancelEdit();
      },
      error: (err) => console.error('Error al eliminar nota:', err)
    });
  }

  // Cancelar edición y volver a creación de nueva nota
  cancelEdit() {
    this.isEditing = false;
    this.editingNoteId = null;
    this.calendarioForm.reset({ fecha: this.selectedDate });
  }
}
