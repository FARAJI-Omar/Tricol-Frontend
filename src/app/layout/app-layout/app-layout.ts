import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from "../../shared/components/header/header";
import { Footer } from "../../shared/components/footer/footer";

@Component({
  selector: 'app-app-layout',
  imports: [Header, Footer, RouterOutlet],
  templateUrl: './app-layout.html',
})
export class AppLayout {

}
