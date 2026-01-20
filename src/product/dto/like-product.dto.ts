import { ApiProperty } from '@nestjs/swagger';

export class LikeProductDto {
  @ApiProperty({ example: 1, description: 'The ID of the product to like' })
  product_id: number;
}
