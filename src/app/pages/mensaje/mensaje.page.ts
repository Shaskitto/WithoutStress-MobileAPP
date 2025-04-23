import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-mensaje',
  templateUrl: './mensaje.page.html',
  styleUrls: ['./mensaje.page.scss'],
})
export class MensajePage implements OnInit {
  showMotivationalPhrase: boolean = false;
  phrase: string = '';
  author: string = '';

  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const nextRoute = params['next'] || '/tabs/plan';
  
      this.authService.getDailyPhrase().subscribe((data: any) => {
        this.phrase = data.phrase;
        this.author = data.author;
        this.showMotivationalPhrase = true;
  
        setTimeout(() => {
          this.showMotivationalPhrase = false;
          this.router.navigate([nextRoute]);
        }, 10000);
      });
    });
  }
  
}
