import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-fileupload',
  templateUrl: './fileupload.component.html',
  styleUrls: ['./fileupload.component.css']
})
export class FileuploadComponent implements OnInit {

  @Output()
  textAreaDisplayEvent = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }

  async loadFile($event : any) {
    let text = await $event.target.files[0].text();
    this.textAreaDisplayEvent.emit(text);
  }

}
