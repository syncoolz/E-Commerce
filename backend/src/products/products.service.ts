import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FiltersProductDto } from './dto/filters-product.dto';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private productsRepository: Repository<Product>,
      ) {}

    async getSearchProduct(filtersProduct:FiltersProductDto):Promise<Product[]> {
        const products = await this.productsRepository.find();
        const productsfilter = products.filter(product=>{
          if(filtersProduct.filters ==="price" && product.price > filtersProduct.skip && product.price < filtersProduct.limit){
            return product
          }
        })
        if (productsfilter.length > 0) {
            return productsfilter;
        }
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }
    async getAllProducts(): Promise<Product[]> {
        return this.productsRepository.find();
    }

    async getProductById(id:number):Promise<Product> {
        const product = await this.productsRepository.findOneBy({id});
        if (product) {
            return product;
        }
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }

    async deleteProduct(id: number) {
        const deleteResponse = await this.productsRepository.delete(id);
        if (!deleteResponse.affected) {
          throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
        }
      }

    async createProduct(product: CreateProductDto) {
        const newProduct = await this.productsRepository.create(product);
        await this.productsRepository.save(newProduct);
        return newProduct;
    }

    async updateProduct(id: number, product: UpdateProductDto) {
        await this.productsRepository.update(id, product);
        const updatedProduct = await this.productsRepository.findOneBy({id});
        if (updatedProduct) {
          return updatedProduct
        }
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
      }  

}
