import {
  Component,
  Input,
  OnInit,
  ViewChild,
  ElementRef,
  ChangeDetectionStrategy,
  EventEmitter,
  Output,
  OnDestroy,
  Renderer2,
} from '@angular/core';
import {
  filter,
  fromEvent,
  skip,
  Subscription,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';

export interface Item {
  text: number;
}

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownComponent implements OnInit, OnDestroy {
  @Input()
  items: Array<Item> | undefined;

  @ViewChild('dropdown', { static: true })
  dropdownRef: ElementRef<HTMLElement> | undefined;

  @ViewChild('dropdownMenu')
  private set dropdownMenuRef(elemRef: ElementRef<HTMLElement>) {
    if (elemRef) {
      const { bottom } = elemRef.nativeElement.getBoundingClientRect();

      if (bottom > window.innerHeight) {
        this.renderer.addClass(elemRef.nativeElement, 'showTop');
      }
    }
  }

  @Output()
  selectItem = new EventEmitter<Item>();

  @Input()
  selectedItem: Item | undefined;

  protected showMenu = new EventEmitter<boolean>(false);
  private subscription: Subscription | undefined;
  protected isShowMenu = false;

  constructor(private renderer: Renderer2) {}

  onSelectItem(item: Item) {
    this.selectItem.emit(item);
    this.showToggle();
  }

  showToggle() {
    this.isShowMenu = !this.isShowMenu;
    this.showMenu.next(this.isShowMenu);
  }

  ngOnInit(): void {
    if (this.dropdownRef) {
      this.subscription = fromEvent(this.dropdownRef.nativeElement, 'click')
        .pipe(
          tap(() => {
            this.showToggle();
          }),
          filter(() => this.isShowMenu),
          switchMap(() =>
            fromEvent(document, 'click').pipe(skip(1), takeUntil(this.showMenu))
          )
        )
        .subscribe((event) => {
          if (!(event.target as HTMLElement).contains(document)) {
            this.showToggle();
          }
        });
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
