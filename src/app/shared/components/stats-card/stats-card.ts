import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

import { StatsCardItem } from './stats-card-item';

@Component({
  selector: 'app-stats-card',
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './stats-card.html',
})
export class StatsCard {
  @Input() cards: StatsCardItem[] = [];
}
