import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Product } from '../entities/Product.entity';
import { ProductInfo } from '../entities/ProductInfo.entity';
import { Brand } from '../entities/Brand.entity';
import { Review } from '../entities/Review.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(ProductInfo)
    private productInfoRepository: Repository<ProductInfo>,
    @InjectRepository(Brand)
    private brandRepository: Repository<Brand>,
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
  ) {}

  async createProduct(body: any): Promise<number> {
    const {
      product_name,
      price,
      description,
      brand_id,
      image_url,
      size,
      color,
      stock,
    } = body;

    const newProduct = this.productRepository.create({
      name: product_name,
      price: Number(price),
      description: description,
      image_url: image_url,
      brand_id: Number(brand_id),
    });

    const savedProduct = await this.productRepository.save(newProduct);

    const newInfo = this.productInfoRepository.create({
      product_id: savedProduct.id,
      size: size,
      color: color,
      stock: Number(stock),
    });

    await this.productInfoRepository.save(newInfo);

    return savedProduct.id;
  }

  async getProductDetail(productId: number, user?: any): Promise<any> {
    const product = await this.productRepository.findOne({
      where: { id: productId },
      relations: ['brand'],
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const options = await this.productInfoRepository.find({
      where: { product_id: productId },
    });

    const reviews = await this.reviewRepository.find({
      where: { product_id: productId },
      order: { created_at: 'DESC' },
    });

    return {
        product: {
            ...product,
            brand_name: product.brand ? product.brand.name : 'No Brand'
        },
        options,
        reviews
    };
  }

  async updateProduct(body: any, user?: any): Promise<number> {
    const productId = body.id;
    
    if (user && user.role === 'SELLER') {
        const product = await this.productRepository.findOne({ where: { id: productId } });
        if (product && product.brand_id !== user.brandId) {
             throw new Error('You do not own this product');
        }
    }

    let updateData: any = {
      name: body.product_name,
      description: body.description,
      price: Number(body.price),
      image_url: body.image_url,
      brand_id: Number(body.brand_id),
    };

    if (user && user.role === 'SELLER') {
       updateData.brand_id = user.brandId;
    }

    await this.productRepository.update(productId, updateData);

    // Delete handling
    let deleteIds: number[] = [];
    if (body.delete_ids) {
      deleteIds = Array.isArray(body.delete_ids)
        ? body.delete_ids.map(Number)
        : [Number(body.delete_ids)];
      await this.productInfoRepository.delete({ id: In(deleteIds) });
    }

    // Update stocks
    if (body.info_id) {
      const infoIds = Array.isArray(body.info_id)
        ? body.info_id
        : [body.info_id];
      const infoStocks = Array.isArray(body.info_stock)
        ? body.info_stock
        : [body.info_stock];

      const updatePromises = [];
      for (let i = 0; i < infoIds.length; i++) {
        if (!deleteIds.includes(Number(infoIds[i]))) {
          updatePromises.push(
            this.productInfoRepository.update(infoIds[i], {
              stock: Number(infoStocks[i]),
            }),
          );
        }
      }
      await Promise.all(updatePromises);
    }

    // Insert new options
    const newColors = body.new_color
      ? Array.isArray(body.new_color)
        ? body.new_color
        : [body.new_color]
      : [];
    const newSizes = body.new_size
      ? Array.isArray(body.new_size)
        ? body.new_size
        : [body.new_size]
      : [];
    const newStocks = body.new_stock
      ? Array.isArray(body.new_stock)
        ? body.new_stock
        : [body.new_stock]
      : [];

    const insertPromises = [];
    for (let i = 0; i < newColors.length; i++) {
      const color = newColors[i];
      const size = newSizes[i];
      const stock = newStocks[i] || 0;

      if (color && size) {
        insertPromises.push(
            this.productInfoRepository.save({
                product_id: productId,
                size: size,
                color: color,
                stock: Number(stock)
            })
        );
      }
    }
    await Promise.all(insertPromises);

    return productId;
  }

  async deleteProduct(id: number, user?: any): Promise<void> {
    if (user && user.role === 'SELLER') {
        const product = await this.productRepository.findOne({ where: { id } });
        if (product && product.brand_id !== user.brandId) {
             throw new Error('You do not own this product');
        }
    }
    await this.productRepository.delete(id);
  }

  async likeProduct(productId: number): Promise<void> {
    await this.productRepository.increment({ id: productId }, 'like_count', 1);
  }

  async createReview(body: any): Promise<void> {
    const { product_id, writer, content } = body;
    await this.reviewRepository.save({
      product_id: Number(product_id),
      writer,
      content,
    });
  }
}
