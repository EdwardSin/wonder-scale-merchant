import { Component, OnInit, Input, Output, ViewChild, EventEmitter, ElementRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'ws-uploader',
  templateUrl: './ws-uploader.component.html',
  styleUrls: ['./ws-uploader.component.scss']
})
export class WsUploaderComponent implements OnInit {
  @Input() id;
  @Input() input = [];
  @Input() max = 5;
  @Input() accept = 'image/*';
  @Output() output: EventEmitter<any> = new EventEmitter;
  @Output() overflow: EventEmitter<any> = new EventEmitter;

  array = [];
  results = [];
  numberOfInput: number = 0;

  constructor(private sanitization: DomSanitizer) { }

  ngOnInit() {
  }
  fileChangeEvent(event) {
    let files = <Array<File>>event.target.files;
    this.numberOfInput = this.input.length;
    this.results = [];
    for(let file of files) {
      if (this.numberOfInput < this.max) {
        this.numberOfInput++;
        this.previewImage(file, (result) =>{
          result.url = this.sanitization.bypassSecurityTrustResourceUrl(result.url);
          this.results.push(result);
          this.output.emit(this.results);
        });
      } else {
        console.log('Maximum files are uploaded!');
        this.overflow.emit(true);
        return;
      }
    }
    event.target.value = "";
  }
  previewImage(file, callback) {
    let reader = new FileReader;
    reader.onload = function (e) {
        let img = {
          name: Math.round(Math.random() * 10000) + file['name'],
          file: file,
          url: URL.createObjectURL(file),
          // done: isPreLoad,
          type: 'blob',
          base64: reader.result
      };
      if(file['name'] && file['name'].split('.').length > 1){
          img['ext'] = file['name'].split('.').pop();
      }
      callback(img);
    }
    reader.readAsDataURL(file);
  }
  validatePhoto(file) {
      var fileTypes = [
          'image/jpeg',
          'image/jpeg',
          'image/jpg',
          'image/png'
      ]
      //let MB = 5;
      //var OVER_SIZE_MB = MB * 1000 * 1000;
      // if (file.size > OVER_SIZE_MB) {
      //     WsToastService.toastSubject.next({ content: "File size limit " + MB + "mb!" });
      //     return false;
      // }
      for (var i = 0; i < fileTypes.length; i++) {
          if (file.type === fileTypes[i]) {
              return true;
          }
      }

      console.log("Upload file type is not in image format!");
      return false;
  }
}