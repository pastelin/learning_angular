import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import swal from 'sweetalert2';

@Component({
    selector: 'app-form',
    templateUrl: './form.component.html',
})
export class FormComponent implements OnInit {
    cliente: Cliente = new Cliente();
    titulo: string = 'Crear Cliente';
    errores: string[];

    constructor(
        private clienteService: ClienteService,
        private router: Router,
        private activateRoute: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this.cargarCliente();
    }

    cargarCliente(): void {
        // Subscribe un observador al recibir un id por parametro
        this.activateRoute.params.subscribe((params) => {
            let id = params['id'];
            if (id) {
                // Registra el observador que asigna el cliente de la consulta al atributo cliente
                this.clienteService
                    .getCliente(id)
                    .subscribe((cliente) => (this.cliente = cliente));
            }
        });
    }

    public create(): void {
        this.clienteService.create(this.cliente).subscribe({
            next: (cliente: Cliente) => {
                this.router.navigate(['/clientes']);
                swal.fire(
                    'Nuevo cliente',
                    `El cliente ${cliente.nombre} ha sido creado con éxito`,
                    'success'
                );
            },
            error: (err) => {
                console.log(err);
                this.errores = err.error.errors as string[];
                console.error(`Codigo del error desde el backend: ${err.status} `);
                console.error(err.error.errors);
            }
        });
    }

    update(): void {
        this.clienteService.update(this.cliente).subscribe((json) => {
            this.router.navigate(['/clientes']);
            swal.fire(
                'Cliente Actualizado',
                `${json.mensaje} ${json.cliente.nombre}`,
                'success'
            );
        },
        err => {
            this.errores = err.error.errors as string[];
            console.error(`Codigo del error desde el backend: ${err.status} `);
            console.error(err.error.errors);
        });
    }
}
