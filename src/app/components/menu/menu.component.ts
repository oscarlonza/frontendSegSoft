import { Component } from '@angular/core';
import { SharedModule } from '../../modules/shared/shared.module';
import { AuthService } from '../../services/auth.service';
import { jwtDecode } from "jwt-decode";
@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export default class MenuComponent {
  static switch: any = 0;
  decodeToken:any;
  constructor(public auth: AuthService) {
  }
  getName() {
    try {
      this.decodeToken=jwtDecode(this.auth.user)
      return this.decodeToken.user.name
    } catch(Error) {
      return null;
    }
  }
}
