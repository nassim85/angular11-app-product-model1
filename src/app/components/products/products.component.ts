import {Component, OnInit} from '@angular/core';
import {ProductsService} from '../../services/products.service';
import {Product} from '../../model/product.model';
import {Observable, of} from 'rxjs';
import {ActionEvent, AppDataState, DataStateEnum, ProductActionsTypes} from '../../state/product.state';
import {catchError, map, startWith} from 'rxjs/operators';
import {Router} from '@angular/router';
import {Action} from 'rxjs/internal/scheduler/Action';


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

  onActionEvent($event: ActionEvent) {
    switch ($event.type){
      case ProductActionsTypes.GET_ALL_PRODUCTS:this.onGetAllProducts();break;
      case ProductActionsTypes.GET_AVAILABLE_PRODUCTS:this.onGetAvailableProducts();break;
      case ProductActionsTypes.GET_SELECTED_PRODUCTS:this.onGetSelectedProducts();break;
      case ProductActionsTypes.New_PRODUCT:this.onNewProduct();break;
      case ProductActionsTypes.SEARCH_PRODUCTS:this.onSearch($event.payload);break;
      case ProductActionsTypes.SELECT_PRODUCT:this.onSelect($event.payload);break;
      case ProductActionsTypes.EDIT_PRODUCT:this.onEdit($event.payload);break;
      case ProductActionsTypes.DELETE_PRODUCT:this.onDelete($event.payload);break;
    }

  }
}
