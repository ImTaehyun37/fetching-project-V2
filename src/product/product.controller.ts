import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Res,
  Redirect,
  UseGuards,
  Request,
  Render,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Response } from 'express';
import { ProductService } from './product.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../entities/User.entity';
import { OptionalJwtAuthGuard } from '../auth/optional-jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { DeleteProductDto } from './dto/delete-product.dto';
import { LikeProductDto } from './dto/like-product.dto';
import { CreateReviewDto } from './dto/create-review.dto';

@ApiTags('Product')
@ApiBearerAuth()
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SELLER)
  @Post('create')
  @ApiOperation({ summary: 'Create a new product (Seller/Admin only)' })
  async createProduct(@Body() body: CreateProductDto, @Request() req) {
    if (req.user.role === UserRole.SELLER) {
        if (!req.user.brandId) throw new ForbiddenException('Seller has no brand assigned');
        body.brand_id = req.user.brandId;
    }
    const newProductId = await this.productService.createProduct(body);
    return { message: 'Product created', productId: newProductId };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SELLER)
  @Post('update')
  @ApiOperation({ summary: 'Update an existing product' })
  async updateProduct(@Body() body: UpdateProductDto, @Request() req) {
    const productId = await this.productService.updateProduct(body, req.user);
    return { message: 'Product updated', productId };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SELLER)
  @Post('delete')
  @ApiOperation({ summary: 'Delete a product' })
  async deleteProduct(@Body() body: DeleteProductDto, @Request() req) {
    await this.productService.deleteProduct(Number(body.id), req.user);
    return { message: 'Product deleted' };
  }

  @UseGuards(JwtAuthGuard)
  @Post('like')
  @ApiOperation({ summary: 'Like a product' })
  async likeProduct(
    @Body() body: LikeProductDto,
  ) {
    await this.productService.likeProduct(Number(body.product_id));
    return { message: 'Product liked' };
  }

  @UseGuards(JwtAuthGuard)
  @Post('review')
  @ApiOperation({ summary: 'Write a review for a product' })
  async createReview(
    @Body() body: CreateReviewDto,
    @Request() req,
  ) {
    const reviewData = { ...body, writer: req.user.username };
    await this.productService.createReview(reviewData);
    return { message: 'Review created' };
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get product detail' })
  async getProductDetail(@Param('id') id: string, @Request() req) {
    return this.productService.getProductDetail(Number(id), req.user);
  }
}
