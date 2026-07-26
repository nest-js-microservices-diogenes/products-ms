import { BadGatewayException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma.service';
import { PaginationDto } from 'src/common/dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    const newProduct = await this.prisma.product.create({
      data: createProductDto,
    });

    return newProduct;
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, page = 1 } = paginationDto;
    const skip = (page - 1) * limit;
    const total = await this.prisma.product.count({
      where: { available: true },
    });
    const remainingPages = Math.ceil(total / limit);

    const products = await this.prisma.product.findMany({
      take: limit,
      skip,
      where: { available: true },
    });

    return {
      data: products,
      meta: {
        currentPage: page,
        limit: limit,
        totalRecords: total,
        remainingPages,
      },
    };
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findFirst({
      where: { id: id, available: true },
    });

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const currentProduct = await this.findOne(id);

    const { id: _, ...rest } = updateProductDto;

    if (!currentProduct) {
      throw new BadGatewayException({
        ok: false,
        message: 'Product not found',
      });
    }

    return this.prisma.product.update({
      where: { id: id },
      data: rest,
    });
  }

  async remove(id: number) {
    const currentProduct = await this.findOne(id);

    if (!currentProduct) {
      throw new BadGatewayException({
        ok: false,
        message: 'Product not found',
      });
    }

    return this.prisma.product.update({
      where: { id: id },
      data: { available: false },
    });
  }
}
