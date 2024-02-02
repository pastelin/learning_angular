import { Component } from '@angular/core';

@Component({
    selector: 'app-header', // nombre con el que se llamara este componente
    templateUrl: './header.component.html', // ruta de archivo html a mostrar
})

// Se registra en la configuracion del modulo en app.module.ts
export class HeaderComponent {
    title = 'App Angular'; // variables que podran ser usadas en archivo definido dentro de templateUrl
}
