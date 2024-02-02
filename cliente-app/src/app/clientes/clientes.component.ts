import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import Swal from 'sweetalert2';
import { tap } from 'rxjs';

@Component({
    selector: 'app-clientes', // nombre con el que se hara referencia en el componente principal
    templateUrl: './clientes.component.html',
})
export class ClientesComponent implements OnInit {
    clientes: Cliente[] = [];

    // Forma de usarse con injeccion de dependencias
    // Injecta capa de servicio
    constructor(private clienteService: ClienteService) {}

    // Evento que se ejecuta cuando inicia el componente
    ngOnInit(): void {
        // Obtiene arreglo de objetos observables de la capa de servicio
        this.clienteService.getClientes().pipe(
            // tap no retorna nada, solo realiza un tipo de tarea
            tap( clientes  => {
                clientes.forEach( cliente => {
                    console.log(cliente.nombre);
                });
            })
        ).subscribe( // es un metodo que permite subscribirnos dentro dentro de un flujo
            // Actualiza el listado de clientes y se pasa a la plantilla
            (clientes) => (this.clientes = clientes)
        );
    }

    delete(cliente: Cliente): void {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: 'btn btn-success',
                cancelButton: 'btn btn-danger',
            },
            buttonsStyling: false,
        });

        swalWithBootstrapButtons
            .fire({
                title: 'Estas seguro?',
                text: `¿Seguro que desea eliminar al cliente ${cliente.nombre} ${cliente.apellido}?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Si, eliminar!',
                cancelButtonText: 'No, cancelar!',
                reverseButtons: true,
            })
            .then((result) => {
                if (result.isConfirmed) {
                    console.log(cliente.id);
                    this.clienteService
                        .delete(cliente.id)
                        .subscribe((response) => {
                            this.clientes = this.clientes.filter(
                                (cli) => cli !== cliente
                            );
                            swalWithBootstrapButtons.fire(
                                'Cliente eliminado!',
                                `Cliente ${cliente.nombre} eliminado con éxito.`,
                                'success'
                            );
                        });
                } else if (
                    /* Read more about handling dismissals below */
                    result.dismiss === Swal.DismissReason.cancel
                ) {
                    swalWithBootstrapButtons.fire(
                        'Cancelled',
                        'Your imaginary file is safe :)',
                        'error'
                    );
                }
            });
    }
}
