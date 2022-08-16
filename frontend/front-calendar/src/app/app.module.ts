import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlatpickrModule } from 'angularx-flatpickr';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CalendarioComponent } from './calendario/calendario.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { registerLocaleData } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import localePt from '@angular/common/locales/pt';
import { ListFilterPipe } from './calendario/listFolderPipe';

registerLocaleData(localePt);



@NgModule({
  declarations: [
    AppComponent,
    CalendarioComponent,
    NavbarComponent,
    FooterComponent,
    ListFilterPipe
  ],
  exports: [CalendarioComponent],
  imports: [
    AppRoutingModule,
    BrowserModule,
    CommonModule,
    FormsModule,
    NgbModalModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    NgbModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
