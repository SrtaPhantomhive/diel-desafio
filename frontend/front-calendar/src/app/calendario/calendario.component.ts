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
    // {
    //   start: new Date(),
    //   end: new Date(),
    //   title: 'A 3 day event',
    //   color: { ...colors['yellow'] },
    //   actions: this.actions,
    //   allDay: true,
    //   resizable: {
    //     beforeStart: true,
    //     afterEnd: true,
    //   },
    //   draggable: true,
    // },
  ];

  activeDayIsOpen: boolean = true;


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
    this.events = this.events.filter((event) => event !== eventToDelete);
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
  constructor(private modal: NgbModal, private eventService: EventsService, private httpClient: HttpClient) { }

  ngOnInit(): void {
    this.setTitleUppercase();

    this.eventService.read().subscribe(res => {
      for (let index = 0; index < res.length; index++) {
        this.events.push({
          "start": addDays(startOfDay(new Date(res[index].start,)), 1),
          "end": addDays(startOfDay(new Date(res[index].start,)), 1),
          "title": res[index].title,
          "color": { ...colors['yellow'] },
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

    // this.httpClient
    //   .get('http://localhost:3301/eventos')
    //   .subscribe((res: any) => {
    //     console.log("passou aqui...");
    //     console.log(res);
    //     this.events = [{
    //       "start": addDays(startOfDay(new Date(res[0].start,)), 1),
    //       "end": addDays(startOfDay(new Date(res[0].start,)), 1),
    //       "title": res[0].title,
    //       "color": { ...colors['yellow'] },
    //       "actions": this.actions,
    //       "allDay": true,
    //       "resizable": {
    //         "beforeStart": true,
    //         "afterEnd": true,
    //       },
    //       "draggable": false,
    //     }];
    //   });
  }
}
