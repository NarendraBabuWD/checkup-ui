import { Component, OnInit, Input, EventEmitter, Output, AfterViewInit, OnChanges } from '@angular/core';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnChanges {
  @Input()private visibleLayoutOptions;
  public layoutOptions = [
    {displayName: 'Daily', value: 'day'},
    {displayName: 'Weekly', value: 'week'},
    {displayName: 'Monthly', value: 'month'},
    {displayName: 'Yearly', value: 'year'},
  ];
  public toggleOptions = [
    {label: 'Analysis', value: 'list'},
    {label: 'Chart', value: 'chart'},
  ];
  private selectedLayoutOption = 'day';
  private selectedToggleOption = 'list';
  @Output() public filterResultChange = new EventEmitter();
  constructor() {
    this.filterResultChange.emit({selectedLayoutOption: this.selectedLayoutOption, selectedToggleOption: this.selectedToggleOption});
  }

  ngOnChanges() {
    if (this.visibleLayoutOptions && this.visibleLayoutOptions.length > 0) {
      this.layoutOptions = this.layoutOptions.filter(option => this.visibleLayoutOptions.indexOf(option.value) > -1);
    }
  }
  displaytoggleChangeHandler(e) {
    this.selectedToggleOption = e.target.value;
    this.filterResultChange.emit({selectedLayoutOption: this.selectedLayoutOption, selectedToggleOption: this.selectedToggleOption});
  }
  displaylayoutChangeHandler(e) {
    this.selectedLayoutOption = e.target.value;
    this.selectedToggleOption = 'list';
    // this.filterResultChange.emit({selectedLayoutOption: this.selectedLayoutOption, selectedToggleOption: this.selectedToggleOption});
    this.filterResultChange.emit({selectedLayoutOption: this.selectedLayoutOption, selectedToggleOption: this.selectedToggleOption});
  }

}
