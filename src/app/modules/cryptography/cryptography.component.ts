import { Component, inject } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-cryptography',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './cryptography.component.html',
  styleUrl: './cryptography.component.scss'
})
export default class CryptographyComponent {
  fb = inject(FormBuilder);
  operation='Encriptar'
  key=null
  base64Image: any = null;
  fileName: string | null = null;;
  onFileSelected(event: Event): void {
    const element = event.target as HTMLInputElement;
    if (element && element.files && element.files.length) {
      const file = element.files[0];
      this.fileName = file.name; 
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        this.base64Image = result.replace(/^data:image\/[a-z]+;base64,/, '');
        console.log(this.base64Image);
      };
      reader.readAsDataURL(file);
    } else {
      this.fileName = null;
    }
  }
}
