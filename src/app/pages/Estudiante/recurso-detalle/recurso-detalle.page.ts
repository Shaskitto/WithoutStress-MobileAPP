import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ResourceService } from 'src/app/services/resource.service';

@Component({
  selector: 'app-recurso-detalle',
  templateUrl: './recurso-detalle.page.html',
  styleUrls: ['./recurso-detalle.page.scss'],
})
export class RecursoDetallePage implements OnInit {
  resourceId: string | undefined;
  resource: any;
  showContent: boolean = false;
  safeUrl: SafeResourceUrl | undefined;

  constructor(
    private route: ActivatedRoute,
    private resourceService: ResourceService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.resourceId = this.route.snapshot.paramMap.get('id')!;
    this.resourceService.getResource(this.resourceId).subscribe(data => {
      this.resource = data;
    });
  }

  loadContent() {
    this.showContent = true;
    if (this.resource.mediaType === 'pdf') {
      this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        'https://docs.google.com/gview?embedded=true&url=' + this.resource.contenidoUrl
      );
    } else if (this.resource.mediaType === 'youtube') {
      this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        'https://www.youtube.com/embed/' + this.resource.contenidoUrl
      );
    }
  }
}
