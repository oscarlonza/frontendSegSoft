import { Component, inject } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { FormBuilder, Validators } from '@angular/forms';
import { getErrorMessage, hideSpinner, showSpinner } from '../../services/functions.service';
import { NotificationImplService } from '../../services/notification.service';
import { DownloadService } from '../../services/download.service';

@Component({
  selector: 'app-cryptography',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './cryptography.component.html',
  styleUrl: './cryptography.component.scss'
})
export default class CryptographyComponent {
  fb = inject(FormBuilder);
  operation = 'Encriptar'
  key = null
  base64File: any = null;
  fileName: string | null = null;
  public notificationService = inject(NotificationImplService);
  public download = inject(DownloadService);
  onFileSelected(event: Event): void {
    const element = event.target as HTMLInputElement;
    if (element && element.files && element.files.length) {
      const file = element.files[0];
      this.fileName = file.name;
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64Prefix = /^data:[a-z]+\/[a-z0-9-+.]+;base64,/i;
        this.base64File = result.replace(base64Prefix, '');
      };
      reader.readAsDataURL(file);
    } else {
      this.fileName = null;
    }
  }
  execution() {
    if (this.key && this.base64File) {
      try {
        this.download.downloadFilePost({ inputKey: this.key, fileData: this.base64File},this.operation)
      } catch (error) {
        hideSpinner()
        const message = getErrorMessage(error)
        this.notificationService.errorNotification(message);
      }
    } else {
      hideSpinner()
      this.notificationService.errorNotification('Todos los campos son obligatorios.');
    }

  }
  changeValue(e:any){
    this.base64File=null
    this.fileName=null
  }
}
