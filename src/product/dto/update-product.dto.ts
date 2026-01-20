import { ApiProperty } from '@nestjs/swagger';

export class UpdateProductDto {
  @ApiProperty({ example: 1, description: 'The ID of the product to update' })
  id: number;

  @ApiProperty({ example: 'Updated T-Shirt', description: 'Updated name', required: false })
  product_name?: string;

  @ApiProperty({ example: 30000, description: 'Updated price', required: false })
  price?: number;

  @ApiProperty({ example: 'Updated description', description: 'Updated description', required: false })
  description?: string;

  @ApiProperty({ example: 'http://example.com/new_img.jpg', description: 'Updated image URL', required: false })
  image_url?: string;

  @ApiProperty({ example: 1, description: 'Brand ID', required: false })
  brand_id?: number;

  @ApiProperty({ example: [101, 102], description: 'List of Option IDs to delete', required: false, type: [Number] })
  delete_ids?: number[];

  @ApiProperty({ example: [201, 202], description: 'List of Option IDs to update stock', required: false, type: [Number] })
  info_id?: number[];

  @ApiProperty({ example: [50, 20], description: 'List of Stock values corresponding to info_id', required: false, type: [Number] })
  info_stock?: number[];

  @ApiProperty({ example: ['Blue'], description: 'List of New Colors to add', required: false, type: [String] })
  new_color?: string[];

  @ApiProperty({ example: ['XL'], description: 'List of New Sizes to add', required: false, type: [String] })
  new_size?: string[];

  @ApiProperty({ example: [10], description: 'List of Initial Stocks for new options', required: false, type: [Number] })
  new_stock?: number[];
}
