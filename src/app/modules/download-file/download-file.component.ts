import { Component, inject } from '@angular/core';
import { DownloadService } from '../../services/download.service';
import { getErrorMessage, hideSpinner, showSpinner } from '../../services/functions.service';
import { NotificationImplService } from '../../services/notification.service';

@Component({
  selector: 'app-download-file',
  standalone: true,
  imports: [],
  templateUrl: './download-file.component.html',
  styleUrl: './download-file.component.scss'
})
export default class DownloadFileComponent {
  public download = inject(DownloadService);
  public notificationService = inject(NotificationImplService);

  async downloadFile() {
    console.log(sessionStorage.getItem('dataUser'));
    const result = await this.download.downloadFile();
  }
}