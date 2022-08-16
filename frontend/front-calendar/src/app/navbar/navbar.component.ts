import { Component, OnInit } from '@angular/core';
import { EventsService } from '../events.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private eventservice: EventsService) { }

  ngOnInit(): void {
  }

}
