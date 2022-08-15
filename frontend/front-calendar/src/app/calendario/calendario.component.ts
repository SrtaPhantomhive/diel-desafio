import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
} from '@angular/core';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
} from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from 'angular-calendar';
import { EventColor } from 'calendar-utils';
import { EventsService } from '../events.service';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';


const colors: Record<string, EventColor> = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#181842',
    secondary: '#181842',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};


@Component({
  selector: 'app-calendario',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.css']
})
export class CalendarioComponent {
  locale: string = "pt";
  @ViewChild('modalContent', { static: true }) modalContent!: TemplateRef<any>;
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;

  viewDate: Date = new Date();
  modalData!: {
    action: string;
    event: CalendarEvent;
  };

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
        this.handleEvent('Deleted', event);
      },
    },
  ];

  refresh = new Subject<void>();

  events: CalendarEvent[] = [
  ];

  activeDayIsOpen: boolean = false;


  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: 'lg' });
  }

  addEvent(): void {
    this.events = [
      ...this.events,
      {
        id: '',
        title: 'Novo evento',
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
        color: colors['blue'],
        draggable: false,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
        actions: this.actions
      },
    ];
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    let id = eventToDelete.id
    if (id != "") {
      this.eventService.delete(id).subscribe();
    }
    this.events = this.events.filter((event) => event !== eventToDelete);
  }
  saveEvent(eventToSave: CalendarEvent) {
    console.log(eventToSave)
    if (eventToSave.title.trim() == "") {
      Swal.fire({
        title: 'Título Inválido!',
        text: 'Por favor, insira o título do evento',
        icon: 'warning',
        confirmButtonText: 'Ok',
        confirmButtonColor: '#0DD2A5'
      });

      return;
    }
    if (eventToSave.end! < eventToSave.start) {
      Swal.fire({
        title: 'Atenção!',
        text: 'A data de expiração do evento deve ser superior a data de início.',
        icon: 'warning',
        confirmButtonText: 'Ok',
        confirmButtonColor: '#0DD2A5'
      });
      return;
    }
    if (eventToSave.id == "") {
      this.eventService.create(eventToSave).subscribe(res => {
        eventToSave.id = res.id;
      });
      Swal.fire({
        title: 'Sucesso!',
        text: 'O evento foi adicionado com sucesso.',
        icon: 'success',
        showConfirmButton: false,
        timer: 3000
      });
    } else {
      this.eventService.update(eventToSave.id, eventToSave).subscribe();
      Swal.fire({
        title: 'Aviso!',
        text: 'O evento foi alterado com sucesso.',
        icon: 'info',
        showConfirmButton: false,
        timer: 3000
      });
    }
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }
  setTitleUppercase() {

    document.getElementById("tituloMes")?.innerText.substring(0, 1).toLocaleUpperCase();
  }



  getEvents() {
    this.eventService.read().subscribe(res => {
      for (let index = 0; index < res.length; index++) {
        this.events.push({
          "id": res[index].id,
          "start": new Date(res[index].start),
          "end": new Date(res[index].end),
          "title": res[index].title,
          "color": colors["yellow"],
          "actions": this.actions,
          "allDay": true,
          "resizable": {
            "beforeStart": true,
            "afterEnd": true,
          },
          "draggable": false,
        });
      }
    })
  }

  constructor(private modal: NgbModal, private eventService: EventsService, private httpClient: HttpClient) { }

  ngOnInit(): void {
    this.setTitleUppercase();
    this.getEvents();

  }
}
