import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.page.html',
  styleUrls: ['./calendario.page.scss'],
})
export class CalendarioPage implements OnInit {
  calendarioForm!: FormGroup;
  selectedDate: string = '';  
  isEditing = false;
  editingNoteId: string | null = null;
  userNotes: any[] = []; // Lista de notas del usuario

  constructor(private fb: FormBuilder, private userService: UserService) {}

  ngOnInit() {
    this.initializeForm();
    this.loadUserNotes(); // Cargar notas al iniciar
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
    this.selectedDate = event.detail.value;
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

  // Cargar todas las notas del usuario
  loadUserNotes() {
    this.userService.getNotes().subscribe({
      next: (response) => {
        const notes = response?.notas; // Acceder a la propiedad "notas"
        
        if (Array.isArray(notes)) {
          this.userNotes = notes;
        } else {
          console.error("Error: La respuesta no es un array", response);
          this.userNotes = []; // Evitar errores en el *ngFor
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
          this.userNotes.push(newNote); // Agregar la nueva nota a la lista
          this.calendarioForm.reset();
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
          if (index !== -1) this.userNotes[index] = { ...noteData, _id: this.editingNoteId }; // Actualizar lista
          this.cancelEdit();
        },
        error: (err) => console.error('Error al actualizar nota:', err)
      });
    }
  }

  // Eliminar una nota
  deleteNote(noteId: string) {
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
