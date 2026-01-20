import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'seller1', description: 'The username of the new user' })
  username: string;

  @ApiProperty({ example: 'password123', description: 'The password of the new user' })
  password: string;

  @ApiProperty({ example: 'SELLER', description: 'The role of the user (CUSTOMER, SELLER, ADMIN)' })
  role: string;

  @ApiProperty({ example: 1, description: 'Brand ID if the user is a SELLER', required: false })
  brand_id?: number;
}
