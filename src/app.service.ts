import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brand } from './entities/Brand.entity';
import { Product } from './entities/Product.entity';

@Injectable()
export class AppService {
    constructor(
        @InjectRepository(Brand)
        private brandRepository: Repository<Brand>,
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
    ) { }

    async getHome(
        brandId: string,
        minPrice: string,
        maxPrice: string,
        qs: string,
        sort: string,
        user?: any,
    ): Promise<any> {
        // 1. Fetch all brands for filters
        const brandsData = await this.brandRepository.find();

        // 2. Build Dynamic Query
        const queryBuilder = this.productRepository
            .createQueryBuilder('p')
            .leftJoinAndSelect('p.brand', 'b')
            .select([
                'p.id',
                'p.name',
                'p.price',
                'p.image_url',
                'p.like_count',
                'b.name', 
                'b.id'
            ]);

        if (brandId) {
            queryBuilder.andWhere('p.brand_id = :brandId', { brandId });
        }
        if (minPrice) {
            queryBuilder.andWhere('p.price >= :minPrice', { minPrice });
        }
        if (maxPrice) {
            queryBuilder.andWhere('p.price <= :maxPrice', { maxPrice });
        }
        if (qs) {
            queryBuilder.andWhere('p.name LIKE :qs', { qs: `%${qs}%` });
        }

        if (sort === 'price_asc') {
            queryBuilder.orderBy('p.price', 'ASC');
        } else if (sort === 'price_desc') {
            queryBuilder.orderBy('p.price', 'DESC');
        } else if (sort === 'like_desc') {
            queryBuilder.orderBy('p.like_count', 'DESC');
        } else {
            // Newest default (by ID desc)
            queryBuilder.orderBy('p.id', 'DESC');
        }

        const products = await queryBuilder.getMany();

        return {
            products: products.map(p => ({
                ...p,
                brand_name: p.brand ? p.brand.name : 'No Brand'
            })),
            brands: brandsData
        };
    }
}
