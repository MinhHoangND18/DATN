import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  Query,
  Put,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes } from '@nestjs/swagger';
import { UploadService } from '@/base/multer/upload.service';
import { ListDto } from '@/shared/dtos/common.dto';
import { Public } from '@/auth/decorator/public.decorator';
import { GetUser } from '@/auth/decorator/get-user.decorator';
import { User } from '@/user/entities/user.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ToNumber } from '@/base/decorators/common.decorator';
import axios from 'axios';

class ProductListQuery extends ListDto {
  @ApiProperty({ required: false })
  @IsNumber()
  @ToNumber()
  @IsOptional()
  price_min?: number;
  @ApiProperty({ required: false })
  @IsNumber()
  @ToNumber()
  @IsOptional()
  price_max?: number;
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  sort_by?: 'popular' | 'newest' | 'price_asc' | 'price_desc';
}

@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private uploadService: UploadService,
  ) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'images', maxCount: 10 }]))
  async create(
    @Body() payload: CreateProductDto,
    @UploadedFiles() files: { images?: Express.Multer.File[] },
  ) {
    try {
      const fileNames = await this.uploadService.uploadMultipeFile(files.images);

      return this.productService.create({
        ...payload,
        variants: payload.variants.map((variant, index: number) => {
          return {
            ...variant,
            image: fileNames[index],
          };
        }),
      });
    } catch (error) {
      console.log(error);

      throw error;
    }
  }

  @Get()
  findAll(@Query() query: ListDto) {
    return this.productService.findAll(query);
  }

  @Get('client')
  @Public()
  list(@Query() query: ProductListQuery) {
    return this.productService.listClient(query);
  }

  @Get('recommend')
  listRecommend(@Query() query: ListDto, @GetUser() user: User) {
    return this.productService.listRecommend(query, user);
  }

  @Get('views')
  @Public()
  listViews() {
    return this.productService.listViews();
  }

  @Get('buy')
  @Public()
  listBuy(@Query() query: ListDto) {
    return this.productService.listBuy();
  }

  @Get('related/:id')
  async getRelatedProducts(@Param('id') id: string, @GetUser() user: User) {
    return this.productService.getRelatedProducts(+id, user.id);
  }

  @Get('related-client/:id')
  @Public()
  async getRelatedProductsClient(@Param('id') id: string) {
    return this.productService.getRelatedProductsClient(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @GetUser() user: User) {
    return this.productService.findOne(+id, user);
  }

  @Public()
  @Get(':id/client')
  findOneClient(@Param('id') id: string) {
    return this.productService.findOneClient(+id);
  }

  @Put(':id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'images', maxCount: 10 }]))
  async update(
    @Param('id') id: string,
    @Body() payload: UpdateProductDto,
    @UploadedFiles() files: { images?: Express.Multer.File[] },
  ) {
    let fileNames = undefined;
    if (files?.images?.length) fileNames = await this.uploadService.uploadMultipeFile(files.images);

    if (Array.isArray(fileNames)) {
      payload.variants?.forEach(v => {
        if (!v?.image) v.image = fileNames.shift();
      });
    }
    return this.productService.update(+id, {
      ...payload,
    });
  }
  catch(error) {
    console.log(error);

    throw error;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }

  @Patch(':id/active')
  active(@Param('id') id: string, @Body('active') active: boolean) {
    return this.productService.active(+id, active);
  }
}
