import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
    name: 'safeHtml',
    standalone: false
})
export class SafeHtmlPipe implements PipeTransform {

    constructor(
        private sanitizer: DomSanitizer
    ){}

  transform(html: string): unknown {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

}
