import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({ example: 1, description: 'The ID of the product to review' })
  product_id: number;

  @ApiProperty({ example: 'Great product!', description: 'The content of the review' })
  content: string;
  
  // writer is taken from the logged-in user
}
