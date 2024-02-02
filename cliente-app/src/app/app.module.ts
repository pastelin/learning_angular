import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { DirectivaComponent } from './directiva/directiva.component';
import { ClientesComponent } from './clientes/clientes.component';
import { ClienteService } from './clientes/cliente.service';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormComponent } from './clientes/form.component';
import { FormsModule } from '@angular/forms';
import { registerLocaleData } from '@angular/common';
import localeES from '@angular/common/locales/es-MX';

// Configuracion de locale de manera global para formatear la fecha
registerLocaleData(localeES, 'es');

const routes: Routes = [
    { path: '', redirectTo: '/clientes', pathMatch: 'full' },
    { path: 'directivas', component: DirectivaComponent },
    { path: 'clientes', component: ClientesComponent },
    { path: 'clientes/form', component: FormComponent },
    { path: 'clientes/form/:id', component: FormComponent }
];

@NgModule({
    // declaracion de componentes
    declarations: [
        AppComponent,
        HeaderComponent,
        FooterComponent,
        DirectivaComponent,
        ClientesComponent,
        FormComponent,
    ],
    imports: [BrowserModule, RouterModule.forRoot(routes), HttpClientModule, FormsModule],
    // declaracion de clases de servicio
    providers: [ClienteService, {provide: LOCALE_ID, useValue: 'es-MX'}],// agrega locale_id para indicar el formato a mostrar de la fecha
    bootstrap: [AppComponent],
})
export class AppModule {}
