import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-resources',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './resources.component.html'
})
export class ResourcesComponent {
}

