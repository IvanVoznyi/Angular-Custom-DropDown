import { Component } from '@angular/core';
import { Item } from './dropdown/dropdown.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  items: Array<Item> = [
    {
      text: 1
    },
    {
      text: 2
    },
    {
      text: 3
    },
    {
      text: 4
    }
  ];

  selectedFirstItem: Item | undefined = undefined
  selectedSecondItem: Item | undefined = undefined

  selectFirstItem(item: Item) {
    this.selectedFirstItem = item;
  }
  selectSecondItem(item: Item) {
    this.selectedSecondItem = item;
  }
}
