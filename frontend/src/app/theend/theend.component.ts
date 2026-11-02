import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';

@Component({
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'app-theend',
  templateUrl: './theend.component.html',
  styleUrls: ['./theend.component.css']
})
export class TheendComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
