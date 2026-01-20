import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import { ForbiddenExceptionFilter } from './common/forbidden.filter';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3000;

  app.use(compression());
  app.use(cookieParser());
  app.useGlobalFilters(new ForbiddenExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('Fetching API')
    .setDescription('The Fetching API description')
    .setVersion('1.0')
    .addTag('fetching')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
