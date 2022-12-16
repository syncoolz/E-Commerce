import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getManager, Repository, SelectQueryBuilder } from 'typeorm';
import Order from './entities/order.entity';
import CreateOrderDto from './dto/createOrder.dto';
import UpdateOrderDto from './dto/updateOrder.dto';
import { PaginationDto } from './dto/pagination.dto';
import { PaginatedOrdersResultDto } from "./dto/paginatedOrdersResult.dto";
import { FilteringDto } from './dto/filtering.dto';

@Injectable()
export default class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
  ) {}

  private static getFilterQuery(
    filteringDto: FilteringDto,
    ordersQueryBuilder: SelectQueryBuilder<Order>
  ): SelectQueryBuilder<Order> {
    let ordersFilterQuery = ordersQueryBuilder;

    if (filteringDto.id) {
      ordersFilterQuery = ordersQueryBuilder
        .where('orders.id = :id', {
          id: filteringDto.id,
        });
    }
    
    if (filteringDto.orderBy) {
      ordersFilterQuery = ordersFilterQuery
        .andWhere('orders.orderBy = :orderBy', {
          orderBy: filteringDto.orderBy,
        });
    }

    if (filteringDto.orderCode) {
      ordersFilterQuery = ordersFilterQuery
        .andWhere('orders.orderCode = :orderCode', {
          orderCode: filteringDto.orderCode,
        });
    }

    if (filteringDto.orderType) {
      ordersFilterQuery = ordersFilterQuery
        .andWhere('orders.orderType = :orderType', {
          orderType: filteringDto.orderType,
        });
    }

    if (filteringDto.orderStatus) {
      ordersFilterQuery = ordersFilterQuery
        .andWhere('orders.orderStatus = :orderStatus', {
          orderStatus: filteringDto.orderStatus,
        });
    }

    return ordersFilterQuery;
  }

  async getAllOrders(paginationDto: PaginationDto, filteringDto: FilteringDto): Promise<PaginatedOrdersResultDto> {
    const skippedItems = (paginationDto.page - 1) * paginationDto.limit;

    const totalCount = await this.ordersRepository.count()
    const ordersQueryBuilder = this.ordersRepository.createQueryBuilder('orders');

    const ordersFilterQuery = OrdersService.getFilterQuery(filteringDto, ordersQueryBuilder);

    const orders = await ordersFilterQuery
      .orderBy('id', 'DESC')
      .offset(skippedItems)
      .limit(paginationDto.limit)
      .getMany();

    return {
      totalCount,
      page: paginationDto.page,
      limit: paginationDto.limit,
      data: orders,
    }
  }

  async getOrderById(id: number) {
    const order = await this.ordersRepository.findOneBy({id});
    if (order) {
      return order;
    }
    throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
  }

  async getOrderByEmail(email: string) {
    const order = await this.ordersRepository.findBy({orderBy: email});
    if (order) {
      return order;
    }
    throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
  }

  async createOrder(order: CreateOrderDto) {
    const newOrder = await this.ordersRepository.create(order);
    await this.ordersRepository.save(newOrder);
    return newOrder;
  }

  async updateOrder(id: number, order: UpdateOrderDto) {
    await this.ordersRepository.update(id, order);
    const updatedOrder = await this.ordersRepository.findOneBy({id});
    if (updatedOrder) {
      return updatedOrder
    }
    throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
  }

  async deleteOrder(id: number) {
    const deleteResponse = await this.ordersRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    }
  }

  /**
   * TODO: Optimize these shitty queries
   *
   * @param reportDate
   */
  async queryDailyReport(reportDate: string) {
    const start = `${reportDate} 00:00:00`;
    const end = `${reportDate} 23:59:59`;

    // Get revenue (1) and number of orders (2)
    const ordersReport = await this.ordersRepository.createQueryBuilder('orders')
      .select('SUM(orders.totalPrice)', 'revenue')
      .addSelect('COUNT(orders.orderCode)', 'numberOfOrders')
      .where(`orders.updatedAt BETWEEN '${start}' AND '${end}'`)
      .getRawOne();

    const joinTableQb = this.ordersRepository.createQueryBuilder()
      .select('*')
      .innerJoin('products', 'products', "products.product_code = ANY (Order.products)")
      .where(`updated_at BETWEEN '${start}' AND '${end}'`);

    // Get number of products (3)
    const numberOfProducts = await getManager().createQueryBuilder()
      .select("SUM(quantity)", "totalProducts")
      .from("(" + joinTableQb.getQuery() + ")", "joinTable")
      .getRawOne();

    const quantityByProductQb = getManager().createQueryBuilder()
      .select("product_code", "product_code")
      .addSelect("updated_at", "updated_at")
      .addSelect("SUM(quantity)", "sum_quantity")
      .from("(" + joinTableQb.getQuery() + ")", "joinTable")
      .groupBy('product_code')
      .addGroupBy('updated_at');

    // Get product with most sales (4)
    const mostSalesProductQb = await getManager().createQueryBuilder()
      .select("product_code", "product_code")
      .addSelect("sum_quantity", "max_quantity")
      .from("(" + quantityByProductQb.getQuery() + ")", "quantityByProduct")
      .groupBy('product_code')
      .addGroupBy('sum_quantity')
      .orderBy('sum_quantity', 'DESC')
      .limit(1);

    const mostSalesProduct = await mostSalesProductQb.getRawOne();

    return {
      ...ordersReport,
      ...numberOfProducts,
      ...mostSalesProduct,
    };
  }
}
