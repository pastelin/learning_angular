import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Cliente } from './cliente';
import { Observable, map, catchError, throwError, tap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import swal from 'sweetalert2';
import { Router } from '@angular/router';

// catchError: encargado de interceptar el observable en busca de fallas

@Injectable({
    providedIn: 'root',
})
export class ClienteService {
    // url del servicio a consumir
    private urlEndpoint: string = 'http://localhost:8092/api/clientes';

    private httpHeaders = new HttpHeaders({
        'Content-Type': 'application/json',
    });

    // Define la variable http como de clase y se le indica el tipo
    constructor(private http: HttpClient, private router: Router) {}

    // Observable actualiza el estado de CLIENTES cuando este cambia
    getClientes(): Observable<Cliente[]> {
        // return of(CLIENTES);

        // Ejecuta la peticion indicada en urlEndpoint
        // return this.http.get<Cliente[]>(this.urlEndpoint);
        return this.http.get(this.urlEndpoint).pipe(
            tap( response  => {
                let clientes = response as Cliente[];
                clientes.forEach( cliente => {
                    console.log(cliente.nombre);
                })
            }),
            map((response) => {
                let clientes = response as Cliente[];
                return clientes.map((cliente) => {
                    cliente.nombre = cliente.nombre.toUpperCase();
                    
                    let datePipe = new DatePipe('es');
                    // cliente.createAt = datePipe.transform(cliente.createAt, 'EEEE dd, MMMM yyyy'); //formatDate(cliente.createAt, 'dd-MM-yyyy', 'en-US')
                    return cliente;
                });
            }),
            tap( response  => {
                response.forEach( cliente => {
                    console.log(cliente.nombre);
                })
            })
        );
    }

    create(cliente: Cliente): Observable<Cliente> {
        return this.http
            .post(this.urlEndpoint, cliente, { headers: this.httpHeaders })
            .pipe(
                map((response: any) => response.cliente as Cliente),
                catchError((e) => {
                    if (e.status == 400) {
                        return throwError(e);
                    }

                    console.log(e.error.mensaje);
                    swal.fire(e.error.mensaje, e.error.error, 'error');
                    // Lanza mensaje de error obtenido del backend
                    return throwError(() => {
                        new Error(e);
                    });
                })
            );
    }

    getCliente(id: string): Observable<Cliente> {
        return this.http.get<Cliente>(`${this.urlEndpoint}/${id}`).pipe(
            catchError((e) => {
                this.router.navigate(['/clientes']);
                console.log(e.error.mensaje);
                swal.fire('Error al editar', e.error.mensaje, 'error');
                return throwError(() => {
                    new Error(e);
                });
            })
        );
    }

    update(cliente: Cliente): Observable<any> {
        console.log(cliente);
        return this.http
            .put<any>(`${this.urlEndpoint}/${cliente.id}`, cliente, {
                headers: this.httpHeaders,
            })
            .pipe(
                catchError((e) => {
                    if (e.status == 400) {
                        return throwError(() => {
                            new Error(e);
                        });
                    }

                    console.log(e.error.mensaje);
                    swal.fire(e.error.mensaje, e.error.error, 'error');
                    return throwError(() => {
                        new Error(e);
                    });
                })
            );
    }

    delete(id: number): Observable<Cliente> {
        console.log(id);
        return this.http
            .delete<Cliente>(`${this.urlEndpoint}/${id}`, {
                headers: this.httpHeaders,
            })
            .pipe(
                catchError((e) => {
                    console.log(e.error.mensaje);
                    swal.fire(e.error.mensaje, e.error.error, 'error');
                    return throwError(() => {
                        new Error(e);
                    });
                })
            );
    }
}
