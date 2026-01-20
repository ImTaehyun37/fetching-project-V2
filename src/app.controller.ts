import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';
import { OptionalJwtAuthGuard } from './auth/optional-jwt-auth.guard';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';

@ApiTags('General')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(OptionalJwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get home page data (products and brands)' })
  @ApiQuery({ name: 'brand_id', required: false, description: 'Filter by Brand ID' })
  @ApiQuery({ name: 'min_price', required: false, description: 'Minimum Price Filter' })
  @ApiQuery({ name: 'max_price', required: false, description: 'Maximum Price Filter' })
  @ApiQuery({ name: 'qs', required: false, description: 'Search Query String' })
  @ApiQuery({ name: 'sort', required: false, description: 'Sort order (e.g. price_asc, price_desc, like_desc)' })
  async getHome(
    @Query('brand_id') brandId: string,
    @Query('min_price') minPrice: string,
    @Query('max_price') maxPrice: string,
    @Query('qs') qs: string,
    @Query('sort') sort: string,
    @Request() req,
  ) {
    return this.appService.getHome(
      brandId,
      minPrice,
      maxPrice,
      qs,
      sort,
      req.user,
    );
  }
}
