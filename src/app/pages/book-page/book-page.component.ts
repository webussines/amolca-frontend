import { Component, OnInit } from '@angular/core';
import { GetBookService } from '../../services/book/get-book.service';
import { ActivatedRoute, Router } from '../../../../node_modules/@angular/router';
import { AppComponent } from '../../app.component';
import { Meta } from '../../../../node_modules/@angular/platform-browser';

@Component({
  selector: 'app-book-page',
  templateUrl: './book-page.component.html',
  styleUrls: ['./book-page.component.css']
})
export class BookPageComponent implements OnInit {

  private sub: any;
  bookActive: any;
  book: any = {};
  exists = true;

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

    this.getBookInfo(this.bookActive);
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

}
