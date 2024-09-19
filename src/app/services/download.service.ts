import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { BasicResponse } from '../models/basic-response.model';
import { RequestService } from '../../app/services/request.service';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { NotificationImplService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class DownloadService {
  public notificationService = inject(NotificationImplService);
  constructor(private http: HttpClient) { }
  downloadFile() {
    const rawToken = sessionStorage.getItem("dataUser");
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
        console.log(response);
        const fileName = this.getFileNameFromHeader(response.headers);
        this.saveFile(response.body, fileName);
      });
  }

  private getFileNameFromHeader(headers: HttpHeaders): string {
    console.log(headers);
    const contentDisposition = headers.get('Content-Disposition');
    console.log(contentDisposition);
    const fileNameMatch = contentDisposition?.match(/filename="(.+)"/);
    console.log(fileNameMatch);
    return fileNameMatch ? fileNameMatch[1] : 'User_Export.txt';
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
    const rawToken = sessionStorage.getItem("dataUser");
    const token = rawToken ? rawToken.replace(/"/g, '') : '';
    const headers = new HttpHeaders({
      'Authorization': `${token}`,
      'Content-Type': 'application/json',
    });
    const action = operation == "Encriptar" ? 'encrypt' : 'decrypt'

    this.http
      .post(`${environment.apiUrl}/functions/${action}`, requestBody, {
        headers: headers,
        responseType: 'json', // Obtenemos la respuesta como JSON
        observe: 'response',
      })
      .subscribe((response: any) => {
        if (response.body.process) {
          const fileInfo = response.body.data.headers;
          const bufferData = response.body.data.buffer.data; // Aquí está el arreglo de bytes
          const fileName = this.extractFileName(fileInfo);

          this.saveFilePost(bufferData, fileName); // Guardamos el archivo usando los datos del buffer
        }else{
          this.notificationService.errorNotification(response.body.message);
        }
      });
  }

  private extractFileName(headersData: any): string {
    const contentDisposition = headersData['Content-Disposition'];
    const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
    return fileNameMatch ? fileNameMatch[1] : 'Encrypted_File.txt';
  }

  private saveFilePost(bufferData: number[], fileName: string) {
    // Convertimos el arreglo de bytes a un Blob
    const byteArray = new Uint8Array(bufferData);
    const blob = new Blob([byteArray], { type: 'text/plain' }); // Ajustamos el MIME type a text/plain
    const link = document.createElement('a');
    const url = window.URL.createObjectURL(blob);
    link.href = url;
    link.download = fileName;
    link.click();
    window.URL.revokeObjectURL(url);
  }
}

