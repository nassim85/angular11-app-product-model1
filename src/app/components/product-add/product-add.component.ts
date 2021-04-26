import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ProductsService} from '../../services/products.service';


@Component({
  selector: 'app-product-add',
  templateUrl: './product-add.component.html',
  styleUrls: ['./product-add.component.css']
})
export class ProductAddComponent implements OnInit {

  productFormGroup!: FormGroup;
  submitted:Boolean=true;

  constructor(private fb : FormBuilder, private productsService:ProductsService) { }

  ngOnInit(): void {
    this.reactiveForm();
  }
  reactiveForm(){
    this.productFormGroup=this.fb.group({
      name: ["", Validators.required],
      price:[0, Validators.required],
      quantity:[0, Validators.required],
      selected:[true, Validators.required],
      available:[true, Validators.required],
    });

}

  onSave() {
    this.submitted=true;
    if(this.productFormGroup?.invalid) return;
    this.productsService.save(this.productFormGroup.value).subscribe(
      data=>{
        alert("Enregistre avec Succé")

      });
  }
}
