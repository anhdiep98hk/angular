import { Injectable } from '@angular/core';
import {Http, Response, Headers, URLSearchParams, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { Article } from './article';


@Injectable()
export class ArticleService {

  //URLs for CRUD operations - url cho hoạt động CRUD
  allArticlesUrl = "http://localhost:8181/user/all-articles";
  articleUrl = "http://localhost:8181/user/article";

  //Constructor to get Http instance - Tạo constructor để lấy instance của Http
  constructor(private http:Http) { }

  //Lấy tất cả articles
  getAllArticles() : Observable<Article[]>{
    return this.http.get(this.allArticlesUrl)
          .map(this.extractData)
          .catch(this.handleError);
  }
  //Lấy article theo id
  getArticleById(articleId: string): Observable<Article>{
    let cpHeaders = new Headers({'Content-Type':'application/json'});
    let cpParams = new URLSearchParams();
    cpParams.set('id',articleId);
    let options = new RequestOptions({headers:cpHeaders,params:cpParams});
    return this.http.get(this.articleUrl,options)
          .map(this.extractData)
          .catch(this.handleError);
  }
  //Tạo article
  createArticle(article: Article) : Observable<number> {
    let cpHeaders = new Headers({ 'Content-Type' : 'application/json' });
    let options = new RequestOptions({ headers:cpHeaders });
    return this.http.post(this.articleUrl,article,options)
          .map(success => success.status)
          .catch(this.handleError);
  }  
  //Cập nhật article
  updateArticle(article: Article):Observable<number>{
    let cpHeaders = new Headers({'Content-Type':'application/json'});
    let options = new RequestOptions({headers: cpHeaders});
    return this.http.put(this.articleUrl,article,options)
          .map(success => success.status)
          .catch(this.handleError);
  }
  //Xóa article
  deleteArticle(articleId:string):Observable<number>{
    let cpHeaders = new Headers({'Cotnent-Type':'application/json'});
    let cpParams = new URLSearchParams();
    cpParams.set('id',articleId);
    let options = new RequestOptions({headers:cpHeaders,params:cpParams});
    return this.http.delete(this.articleUrl,options)
          .map(success => success.status)
          .catch(this.handleError);
  }





  private extractData(res: Response){
    let body = res.json();
    return body;
  }
  private handleError(error: Response | any){
    console.error(error.message || error);
    return Observable.throw(error.status);
  }
}
