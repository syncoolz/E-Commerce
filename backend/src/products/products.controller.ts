import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FiltersProductDto } from './dto/filters-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  getAllProducts() {
    return this.productsService.getAllProducts();
  }

  @Get(':id')
  getProductById(@Param('id') id: string) {
    return this.productsService.getProductById(Number(id));
  }
  
  @Post('products/by/search')
  async searchProduct(@Body() filters: FiltersProductDto) {
    return this.productsService.getSearchProduct(filters);
  }

  @Post()
  async createProduct(@Body() product: CreateProductDto) {
    console.log(product)
    return this.productsService.createProduct(product);
  }

  @Patch(':id')
  async replaceProduct(@Param('id') id: string, @Body() product: UpdateProductDto) {
    return this.productsService.updateProduct(Number(id), product);
  }

  @Delete(':id')
  async deleteProduct(@Param('id') id: string) {
    return this.productsService.deleteProduct(Number(id));
  }
}
