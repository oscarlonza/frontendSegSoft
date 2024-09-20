import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { BasicResponse } from '../models/basic-response.model';
import { RequestService } from '../../app/services/request.service';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { NotificationImplService } from './notification.service';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { AuthService } from './auth.service';
import { hideSpinner, showSpinner } from './functions.service';

@Injectable({
  providedIn: 'root'
})
export class DownloadService {
  public notificationService = inject(NotificationImplService);
  public auth = inject(AuthService);
  constructor(private http: HttpClient) { }
  downloadFile() {
    showSpinner();
    const rawToken = this.auth.user;
    const token = rawToken ? rawToken.replace(/"/g, '') : '';
    const headers = new HttpHeaders({
      'Authorization': `${token}`,
      'Content-Type': 'application/json',
    });

    this.http
      .get(`${environment.apiUrl}/functions/exportAll`, {
        headers: headers,
        responseType: 'blob',
        observe: 'response',
      })
      .subscribe((response: any) => {
        const fileName = this.getFileNameFromHeader(response.headers);
        this.saveFile(response.body, fileName);
        hideSpinner();
      });
  }

  private getFileNameFromHeader(headers: HttpHeaders, operation?: string): string {
    const contentDisposition = headers.get('Content-Disposition');
    const fileNameMatch = contentDisposition?.match(/filename="(.+)"/);
    if (operation && operation == 'Encriptar') {
      return fileNameMatch ? fileNameMatch[1] : 'Encripted_File.txt';
    } else if (operation == 'Desencriptar') {
      return fileNameMatch ? fileNameMatch[1] : 'Decrypted_File.txt';
    } else {
      return fileNameMatch ? fileNameMatch[1] : 'User_Export.txt';
    }
  }

  private saveFile(blob: Blob, fileName: string) {
    const link = document.createElement('a');
    const url = window.URL.createObjectURL(blob);
    link.href = url;
    link.download = fileName;
    link.click();
    window.URL.revokeObjectURL(url);
  }
  downloadFilePost(requestBody: any, operation: string) {
    showSpinner();
    const rawToken = this.auth.user;
    const token = rawToken ? rawToken.replace(/"/g, '') : '';
    const headers = new HttpHeaders({
      'Authorization': `${token}`,
      'Content-Type': 'application/json',
    });
    const action = operation == "Encriptar" ? 'encrypt' : 'decrypt'

    this.http
      .post(`${environment.apiUrl}/functions/${action}`, requestBody, {
        headers: headers,
        responseType: 'blob',
        observe: 'response',
      })
      .pipe(
        tap((response: any) => {
          const fileName = this.getFileNameFromHeader(response.headers, operation);
          this.saveFile(response.body, fileName);
          this.notificationService.successNotification('Generación de archivo', 'Archivo generado con éxito.');
          hideSpinner()
        }),
        catchError((error) => {
          this.notificationService.errorNotification('Por favor rectifique la clave ingresada');
          hideSpinner()
          return of(error); // Manejar el error de forma adecuada
        })
      )
      .subscribe();
  }

}

