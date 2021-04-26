import {Component, OnInit} from '@angular/core';
import {ProductsService} from '../../services/products.service';
import {Product} from '../../model/product.model';
import {Observable, of} from 'rxjs';
import {AppDataState, DataStateEnum} from '../../state/product.state';
import {catchError, map, startWith} from 'rxjs/operators';
import {KeyedWrite} from '@angular/compiler';
import {Route, Router} from '@angular/router';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products$:Observable<AppDataState<Product[]>>|null=null;
  readonly DataStateEnum=DataStateEnum;
  constructor(private  productsService:ProductsService, private router: Router) { }

  ngOnInit(): void {
  }

  onGetAllProducts() {
    this.products$=this.productsService.getAllProducts().pipe(
      map(data=>{
        return ({dataSate:DataStateEnum.LOADED, data:data})
      }),
      startWith({dataSate:DataStateEnum.LOADING}),
      catchError(err => of({dataState:DataStateEnum.ERROR, errorMessage: err.message}))
    );

  }

  onGetSelectedProducts() {
    this.products$=this.productsService.getSelectedProducts().pipe(
      map(data=>{
        return ({dataSate:DataStateEnum.LOADED, data:data})
      }),
      startWith({dataSate:DataStateEnum.LOADING}),
      catchError(err => of({dataState:DataStateEnum.ERROR, errorMessage:err.message}))
    );
  }

  onGetAvailableProducts() {
    this.products$=this.productsService.getAvailableProducts().pipe(
      map(data=>{
        return ({dataSate:DataStateEnum.LOADED, data:data})
      }),
      startWith({dataSate:DataStateEnum.LOADING}),
      catchError(err => of({dataState:DataStateEnum.ERROR, errorMessage:err.message}))
    );
  }

  onSearch(dataForm: any) {
    this.products$=this.productsService.searchProducts(dataForm.Keyword).pipe(
      map(data=>{
        return ({dataSate:DataStateEnum.LOADED, data:data})
      }),
      startWith({dataSate:DataStateEnum.LOADING}),
      catchError(err => of({dataState:DataStateEnum.ERROR, errorMessage:err.message}))
    );

  }

  onSelect(p: Product) {
    this.productsService.select(p).subscribe(data=> {
      p.selected = data.selected;

    })

  }

  onDelete(p: Product) {
    let v=confirm("ETES-VOUS SURS ??");
    if (v==true)
    this.productsService.delete(p).subscribe(data=>{
      this.onGetAllProducts();
    })
  }

  onNewProduct() {
    this.router.navigateByUrl("/newProduct");
  }

  onEdit(p: Product) {
    this.router.navigateByUrl("/editProduct/"+p.id);
  }
}
