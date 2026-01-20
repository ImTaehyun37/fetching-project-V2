import { ApiProperty } from '@nestjs/swagger';

export class DeleteProductDto {
  @ApiProperty({ example: 1, description: 'The ID of the product to delete' })
  id: number;
}
