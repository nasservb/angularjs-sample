import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'afs-embed',
  templateUrl: 'src/controllers/embed.html'
})
export class Embed {
  object: any = {};

  constructor() {
    this.object = window.Afs.MindsEmbed || { };
  }
}
