import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { BasicResponse } from '../models/basic-response.model';
import { RequestService } from '../../app/services/request.service';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class DownloadService {

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
}

