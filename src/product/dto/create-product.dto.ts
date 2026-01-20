import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: 'Awesome T-Shirt', description: 'The name of the product' })
  product_name: string;

  @ApiProperty({ example: 25000, description: 'The price of the product' })
  price: number;

  @ApiProperty({ example: 'A very comfortable cotton t-shirt', description: 'Description of the product' })
  description: string;

  @ApiProperty({ example: 'http://example.com/image.jpg', description: 'Image URL of the product' })
  image_url: string;

  @ApiProperty({ example: 'L', description: 'Initial size option' })
  size: string;

  @ApiProperty({ example: 'White', description: 'Initial color option' })
  color: string;

  @ApiProperty({ example: 100, description: 'Initial stock quantity' })
  stock: number;
  
  @ApiProperty({ example: 1, description: 'Brand ID (Required for Admins, auto-filled for Sellers)', required: false })
  brand_id?: number;
}
