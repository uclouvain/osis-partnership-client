import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';

export class CheckboxItem {
  value: string;
  label: string;
  checked: boolean;
  constructor(value: any, label: any, checked?: boolean) {
    this.value = value;
    this.label = label;
    this.checked = checked ? checked : false;  }
}

@Component({
  selector: 'app-checkbox-group',
  templateUrl: './checkbox-group.component.html',
  styleUrls: ['./checkbox-group.component.css']
})
export class CheckboxGroupComponent implements OnInit, OnChanges {
  @Input() options = Array<CheckboxItem>();
  @Input() selectedValues: string[] = [];
  @Output() toggle = new EventEmitter<any[]>();
  constructor() { }
  ngOnInit() {}
  onToggle() {
    const checkedOptions = this.options.filter(x => x.checked);
    this.selectedValues = checkedOptions.map(x => x.value);
    this.toggle.emit(checkedOptions.map(x => x.value));
  }
  ngOnChanges() {
    this.selectedValues.forEach(value => {
      const element = this.options.find(x => x.value === value);
      if (element) {
        element.checked = true;
      }
    });
  }
}
