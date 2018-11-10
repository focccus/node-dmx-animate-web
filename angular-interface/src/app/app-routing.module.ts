import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component'
import { DevicesComponent } from './devices/devices.component';
import { SequencesComponent } from './sequences/sequences.component';
const routes: Routes = [
  //{path: '', component: AppComponent, children: [
    { path: '', redirectTo: 'devices', pathMatch: 'full' },
    {path: 'devices', component: DevicesComponent},
    {path: 'sequences', component: SequencesComponent},
  //]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
