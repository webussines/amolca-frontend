import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'footer-block-social',
  templateUrl: './block-social.component.html',
  styleUrls: ['../footer.component.css']
})
export class BlockSocialComponent implements OnInit {

  constructor() { }

  socialPosition = 'bottom';

  ngOnInit() {
  }

}