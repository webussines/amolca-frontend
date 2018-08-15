import { Component, OnInit } from '@angular/core';
import { TooltipPosition } from '@angular/material';
import { GetBookService } from '../../services/book/get-book.service';
import { ActivatedRoute, Router } from '../../../../node_modules/@angular/router';
import { AppComponent } from '../../app.component';
import { Meta } from '../../../../node_modules/@angular/platform-browser';

declare var jQuery: any;

@Component({
  selector: 'app-book-page',
  templateUrl: './book-page.component.html',
  styleUrls: ['./book-page.component.scss']
})
export class BookPageComponent implements OnInit {

  //Declare position tooltip
  tooltipPositionOptions: TooltipPosition[] = ['after', 'before', 'above', 'below', 'left', 'right'];
  tooltipPosition = this.tooltipPositionOptions[2];

  private sub: any;
  bookActive: any;
  book: any = {};
  exists = true;

  showCartBtn: Boolean = true;

  footerOffset: any = jQuery('.footer').offset().top - 40;
  mainHigher: Boolean = false;

  constructor(
    //Meta info for this book
    private _appComponent: AppComponent,
    private _meta: Meta,

    //Book services
    private _getBookService: GetBookService,

    //Router services
    private _activatedRoute: ActivatedRoute,
    private _router: Router
  ) { }

  ngOnInit() {
    this.sub = this._activatedRoute.params.subscribe(params => {
      this.bookActive = params['slug']
    })

    jQuery(document).ready(function() {
      jQuery('.materialboxed').materialbox();
    });

    this.getBookInfo(this.bookActive);
  }

  ngAfterViewInit() {
    this.scrollInteraction();
  }

  //Get Book info by SLUG
  getBookInfo(slug) {
    this._getBookService.getBooksBySlug(slug)
      .map(resp => resp.json())
      .subscribe(
        data => this.setBookInfoPage(data),
        err => this.exists = false
      )
  }

  //Set book info for page
  setBookInfoPage(b) {
    this.book = b;
    this._appComponent.setMetaTitle(this.book.name);
    this._meta.addTag({ name: "description", content: this.book.description });
  }

  scrollInteraction() {
    let me = this;
    jQuery(document).ready(function(){

      let imgCont = jQuery('#image-container');

      if(jQuery('.main').height() > (me.footerOffset - 180 - imgCont.height()) ) {
        me.mainHigher = true;
      }

      jQuery(window).scroll(function(){
        let scroll = jQuery(window).scrollTop();

        if(me.mainHigher) {
          //If show full image
          if(scroll < 100) {
            imgCont.removeClass('scroll-waiting');
            imgCont.removeClass('scroll-fixed');
            jQuery('#image-container .scroll-info').fadeOut();
          }

          //Position fixed 
          if(scroll >= 100) {
            jQuery('#image-container .scroll-info').fadeIn();
            imgCont.removeClass('scroll-waiting');
            imgCont.addClass('scroll-fixed');
          }

          //Waiting scroll while looking footer
          if(scroll > 100 && scroll >= (me.footerOffset - 180 - imgCont.height()) ) {
            imgCont.removeClass('scroll-fixed');
            imgCont.addClass('scroll-waiting');
            console.log('Ya paso')
          }
        }

      });

    });    
  }

  changeFooterOffsetTop() {
    let me = this;
    this.footerOffset = jQuery('.footer').offset().top;
    if(jQuery('.main').height() > (me.footerOffset - 180 - jQuery('#image-container').height()) ) {
      me.mainHigher = true;
    }
  }
}