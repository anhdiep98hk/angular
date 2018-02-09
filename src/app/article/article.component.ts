import { Component, OnInit } from '@angular/core';
import { FormControl,FormGroup,Validators } from '@angular/forms';

import { ArticleService } from '../article.service';
import { Article } from '../article';


@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']
})
export class ArticleComponent implements OnInit {

  //Thuộc tính
  allArticles: Article[];
  statusCode: number;
  requestProcessing = false;
  articleIdToUpdate = null;
  processValidation = false;

  //Tạo Form
  articleForm = new FormGroup({
    title: new FormControl('', Validators.required),
    category: new FormControl('',Validators.required)
  });

  //Constructor để lấy dịch vụ
  constructor(private articleService: ArticleService) { }
  //Tải dữ liệu articles
  ngOnInit():void {
    this.getAllArticles();
  }
  //Tìm nạp tất cả articles
  getAllArticles(){
    this.articleService.getAllArticles()
        .subscribe(data => this.allArticles = data,
        errorCode => this.statusCode = errorCode);
  }
  //Xử lý create và update  article
  onArticleFormSubmit(){
    this.processValidation = true;
    if(this.articleForm.invalid){
      return; //Validation lỗi => thoát khỏi method
    }
    //Form valid 
    this.preProcessConfigurations();
    let title = this.articleForm.get('title').value.trim();
    let category = this.articleForm.get('category').value.trim();
    if(this.articleIdToUpdate === null){
      //Nếu không có id thì tạo 1 article mới
      //Create article
      let article = new Article(null,title,category);
      this.articleService.createArticle(article)
          .subscribe(successCode => {
            this.statusCode = successCode;
            this.getAllArticles();
            this.backToCreateArticle();
          },errorCode => this.statusCode = errorCode);
    }else{
      //Update article
      let article = new Article(this.articleIdToUpdate,title,category);
      this.articleService.updateArticle(article)
          .subscribe(successCode => {
            this.statusCode = successCode;
            this.getAllArticles();
            this.backToCreateArticle();
          },errorCode => this.statusCode = errorCode);
    }
  }
  //load article theo id để edit
  loadArticleToEdit(articleId: string){
    this.preProcessConfigurations();
    this.articleService.getArticleById(articleId)
        .subscribe(article =>{
          this.articleIdToUpdate = article.articleId;
          this.articleForm.setValue({ title:article.title,category:article.category });
          this.processValidation = true;
          this.requestProcessing = false;
        },errorCode => this.statusCode = errorCode);
  }
  //Delete article
  deleteArticle(articleId:string){
    this.preProcessConfigurations();
    this.articleService.deleteArticle(articleId)
        .subscribe(successCode => {
          this.statusCode = successCode;
          this.getAllArticles();
          this.backToCreateArticle();
        },errorCode => this.statusCode = errorCode);
  }

  //Trở lại từ update đến create
  backToCreateArticle(){
    this.articleIdToUpdate = null;
    this.articleForm.reset();
    this.processValidation = false;
  }


  //Thực hiện cấu hình xử lý sơ bộ
  preProcessConfigurations(){
    this.statusCode = null;
    this.requestProcessing = true;
  }

}
