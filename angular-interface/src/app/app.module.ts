import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatToolbarModule, MatExpansionModule,MatCardModule,
        MatSnackBarModule, MatCheckboxModule,MatTabsModule,MatNativeDateModule,MatInputModule, MatSliderModule, MatIconModule, MatButtonModule, MatRippleModule, MatProgressBarModule  } from '@angular/material';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDatepickerModule } from '@angular/material/datepicker';

import { AppRoutingModule } from './app-routing.module';
import { ColorPickerModule } from 'ngx-color-picker';

import { AppComponent } from './app.component';
import { DmxService } from './services/dmx.service'
import { SortablejsModule } from 'angular-sortablejs'
import { Ng5TimePickerModule } from '@akiocloud/ng5-time-picker';
import { DevicesComponent } from './devices/devices.component';
import { SequencesComponent } from './sequences/sequences.component';
@NgModule({
  declarations: [
    AppComponent,
    DevicesComponent,
    SequencesComponent
  ],
  imports: [
    BrowserModule,
        BrowserAnimationsModule,
    HttpModule, HttpClientModule,FormsModule,
    AppRoutingModule,
    SortablejsModule.forRoot({ animation: 150 }),
    MatToolbarModule,
    MatExpansionModule,
    Ng5TimePickerModule,MatCardModule,
    MatSnackBarModule,
    MatSelectModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatTabsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,MatSliderModule,MatIconModule,ColorPickerModule,MatButtonModule, MatRippleModule, MatProgressBarModule
  ],
  providers: [DmxService],
  bootstrap: [AppComponent]
})
export class AppModule { }
