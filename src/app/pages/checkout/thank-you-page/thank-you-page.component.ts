import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-thank-you-page',
  template: `
    <div class="conteiner">
      <h1 class="title">Thank you!</h1>
      <p class="content">Your order is on the way!</p>
      <span>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Deserunt non
        aperiam repellat ipsum eum maiores a at sapiente, officiis cupiditate
        quas itaque veniam optio expedita consectetur repudiandae, asperiores
        vero hic?
      </span>
    </div>
  `,
  styleUrls: ['./thank-you-page.component.scss'],
})

export class ThankYouPageComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
