import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { Repository } from 'typeorm';
import { CartItem } from './entities/cart-item.entity';
import { ProductVariant } from '@/product/entities/product-variant.entity';
import { Bill } from '@/bill/entities/bill.entity';
import { BehaviorService } from '@/behavior/behavior.service';
import { Product } from '@/product/entities/product.entity';
import { MomoPaymentService } from './momo.payment';
import { IResponseSuccessPayment, ICreatePayment } from 'momo-payment-api/src/type';
import { PaymentStatus } from './enums/payment-status.enum';
import { PaymentMethod } from './enums/payment-method.enum';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart) private cartRepo: Repository<Cart>,
    @InjectRepository(CartItem) private cartItemRepo: Repository<CartItem>,
    @InjectRepository(ProductVariant) private productVariantRepo: Repository<ProductVariant>,
    @InjectRepository(Bill) private billRepo: Repository<Bill>,
    @InjectRepository(Product) private readonly productRepository: Repository<Product>,
    private momoPaymentService: MomoPaymentService,
    private behaviorService: BehaviorService,
  ) {}

  async getUserCart(userId: number) {
    let cart = await this.cartRepo.findOne({
      where: { user: { id: userId }, checked_out: false },
      relations: { cart_items: { variant: { product: true } } },
    });

    if (!cart) {
      cart = this.cartRepo.create({ user: { id: userId }, cart_items: [] });
      await this.cartRepo.save(cart);
    }

    return cart;
  }

  async addToCart(userId: number, productVariantId: number, quantity: number) {
    const cart = await this.getUserCart(userId);

    const variant = await this.productVariantRepo.findOne({
      where: { id: productVariantId },
      relations: { product: true },
    });

    if (!variant) throw new NotFoundException('Product variant not found');
    if (variant.stock < quantity) throw new BadRequestException('Số lượng vượt quá tồn kho');

    let cartItem = cart.cart_items.find(item => item.variant.id === productVariantId);

    if (cartItem) {
      cartItem.quantity += quantity;
      if (cartItem.quantity < 1) throw new BadRequestException('Số lượng không được nhỏ hơn 1');
      if (variant.stock < cartItem.quantity)
        throw new BadRequestException('Số lượng vượt quá tồn kho');
      await this.cartItemRepo.save(cartItem);
    } else {
      if (quantity < 1) throw new BadRequestException('Số lượng không được nhỏ hơn 1');
      cartItem = this.cartItemRepo.create({ cart, variant, quantity });
      await this.cartItemRepo.save(cartItem);
      cart.cart_items.push(cartItem);
    }

    await this.behaviorService.createOrUpdate(userId, variant.product.id, quantity, 'cart_adds');

    return cart;
  }

  async removeFromCart(userId: number, productVariantId: number) {
    const cart = await this.getUserCart(userId);
    const cartItem = cart.cart_items.find(item => item.id == productVariantId);

    if (!cartItem) throw new NotFoundException('Mục không tồn tại trong giỏ hàng');

    await this.cartItemRepo.remove(cartItem);
    cart.cart_items = cart.cart_items.filter(item => item.id !== productVariantId);
    return cart;
  }

  async checkoutCart(userId: number, paymentMethod: PaymentMethod) {
    const cart = await this.getUserCart(userId);
    if (cart.cart_items.length === 0) {
      throw new BadRequestException('Giỏ hàng trống, không thể thanh toán');
    }

    if (paymentMethod === PaymentMethod.MOMO) {
      const total = cart.cart_items.reduce(
        (acc, cur) => acc + cur.quantity * cur.variant.product.price,
        0,
      );

      const requestId = `REQUEST_${Date.now()}`;
      const paymentRequest: ICreatePayment = {
        requestId,
        orderId: `ORDER_${Date.now()}`,
        orderInfo: `Thanh toán đơn hàng ${cart.id}`,
        amount: total,
        items: cart.cart_items.map(item => ({
          id: item.variant.product.id.toString(),
          name: item.variant.product.name,
          price: item.variant.product.price,
          quantity: item.quantity,
          imageUrl: item.variant.image || '',
          currency: 'VND',
          totalPrice: item.quantity * item.variant.product.price,
        })),
        redirectUrl: `${process.env.FRONTEND_URL}/payment/success`,
        ipnUrl: `${process.env.BACKEND_URL}/api/cart/confirm-payment`,
        requestType: 'captureWallet',
        extraData: Buffer.from(JSON.stringify({ cartId: cart.id })).toString('base64'),
        lang: 'vi',
        autoCapture: true,
        storeName: 'Socks Store',
        storeId: 'SOCKS_STORE',
      };

      try {
        cart.payment_method = PaymentMethod.MOMO;
        cart.payment_status = PaymentStatus.PENDING;
        await this.cartRepo.save(cart);

        const momoResponse = await this.momoPaymentService.createPayment(paymentRequest);
        return {
          paymentUrl: momoResponse.payUrl,
          cartId: cart.id,
        };
      } catch (error) {
        throw new BadRequestException('Không thể tạo thanh toán. Vui lòng thử lại sau.');
      }
    } else {
      // Xử lý thanh toán COD
      cart.checked_out = true;
      cart.payment_method = PaymentMethod.CASH;
      cart.payment_status = PaymentStatus.COMPLETED;
      await this.cartRepo.save(cart);

      const bill = await this.billRepo.save({
        cart,
        total: cart.cart_items.reduce(
          (acc, cur) => acc + cur.quantity * cur.variant.product.price,
          0,
        ),
      });

      const newCart = this.cartRepo.create({ user: { id: userId }, cart_items: [] });
      await this.cartRepo.save(newCart);

      for (const cart_item of cart.cart_items) {
        await this.behaviorService.createOrUpdate(
          userId,
          cart_item.variant.product.id,
          cart_item.quantity,
          'purchases',
        );

        const variant = await this.productVariantRepo.findOneBy({ id: cart_item.variant.id });
        await this.productVariantRepo.update(cart_item.variant.id, {
          stock: variant.stock - cart_item.quantity,
        });

        await this.productRepository.update(cart_item.variant.product.id, {
          buy: cart_item.variant.product.buy + 1,
        });
      }

      return {
        bill,
        cart: newCart,
        message: 'Đặt hàng thành công',
      };
    }
  }

  async buyNow(userId: number, productVariantId: number, quantity: number) {
    const variant = await this.productVariantRepo.findOne({
      where: { id: productVariantId },
      relations: { product: true },
    });

    if (!variant) throw new NotFoundException('Product variant not found');
    if (variant.stock < quantity) throw new BadRequestException('Số lượng vượt quá tồn kho');
    if (quantity < 1) throw new BadRequestException('Số lượng không được nhỏ hơn 1');

    const cart = this.cartRepo.create({
      user: { id: userId },
      cart_items: [],
      payment_method: PaymentMethod.CASH,
    });
    await this.cartRepo.save(cart);

    const cartItem = this.cartItemRepo.create({ cart, variant, quantity });
    await this.cartItemRepo.save(cartItem);
    cart.cart_items.push(cartItem);

    cart.checked_out = true;
    await this.cartRepo.save(cart);

    const bill = await this.billRepo.save({
      cart,
      total: quantity * variant.product.price,
    });

    await this.productVariantRepo.update(productVariantId, {
      stock: variant.stock - quantity,
    });

    await this.productRepository.update(variant.product.id, {
      buy: variant.product.buy + 1,
    });

    await this.behaviorService.createOrUpdate(userId, variant.product.id, quantity, 'purchases');

    return {
      bill,
      cart,
      message: 'Mua hàng thành công',
    };
  }

  async createPayment(userId: number, productVariantId: number, quantity: number) {
    const variant = await this.productVariantRepo.findOne({
      where: { id: productVariantId },
      relations: { product: true },
    });

    if (!variant) throw new NotFoundException('Product variant not found');
    if (variant.stock < quantity) throw new BadRequestException('Số lượng vượt quá tồn kho');
    if (quantity < 1) throw new BadRequestException('Số lượng không được nhỏ hơn 1');

    const cart = this.cartRepo.create({
      user: { id: userId },
      cart_items: [],
      payment_method: PaymentMethod.MOMO,
      payment_status: PaymentStatus.PENDING,
    });
    await this.cartRepo.save(cart);

    const cartItem = this.cartItemRepo.create({ cart, variant, quantity });
    await this.cartItemRepo.save(cartItem);
    cart.cart_items.push(cartItem);

    const total = quantity * variant.product.price;

    const requestId = `REQUEST_${Date.now()}`;
    const paymentRequest: ICreatePayment = {
      requestId,
      orderId: `ORDER_${Date.now()}`,
      orderInfo: `Thanh toán đơn hàng ${cart.id}`,
      amount: total,
      items: [
        {
          id: variant.product.id.toString(),
          name: variant.product.name,
          price: variant.product.price,
          quantity: quantity,
          imageUrl: variant.image || '',
          currency: 'VND',
          totalPrice: total,
        },
      ],
      redirectUrl: `${process.env.FRONTEND_URL}/payment/success`,
      ipnUrl: `${process.env.BACKEND_URL}/api/cart/confirm-payment`,
      requestType: 'captureWallet',
      extraData: Buffer.from(JSON.stringify({ cartId: cart.id })).toString('base64'),
      lang: 'vi',
      autoCapture: true,
      storeName: 'Socks Store',
      storeId: 'SOCKS_STORE',
    };

    try {
      const momoResponse = await this.momoPaymentService.createPayment(paymentRequest);

      return {
        paymentUrl: momoResponse.payUrl,
        cartId: cart.id,
      };
    } catch (error) {
      await this.cartItemRepo.remove(cartItem);
      await this.cartRepo.remove(cart);
      throw new BadRequestException('Không thể tạo thanh toán. Vui lòng thử lại sau.');
    }
  }

  async confirmPayment(body: IResponseSuccessPayment) {
    try {
      const cart = await this.cartRepo.findOne({
        where: { id: parseInt(body.transId) },
        relations: { cart_items: { variant: { product: true } } },
      });

      if (!cart) {
        throw new NotFoundException('Cart not found');
      }

      if (body.resultCode === 0) {
        cart.checked_out = true;
        cart.payment_status = PaymentStatus.COMPLETED;
        await this.cartRepo.save(cart);

        await this.billRepo.save({
          cart,
          total: cart.cart_items.reduce(
            (acc, cur) => acc + cur.quantity * cur.variant.product.price,
            0,
          ),
        });

        for (const cart_item of cart.cart_items) {
          await this.behaviorService.createOrUpdate(
            cart.user.id,
            cart_item.variant.product.id,
            cart_item.quantity,
            'purchases',
          );

          const variant = await this.productVariantRepo.findOneBy({ id: cart_item.variant.id });
          await this.productVariantRepo.update(cart_item.variant.id, {
            stock: variant.stock - cart_item.quantity,
          });

          await this.productRepository.update(cart_item.variant.product.id, {
            buy: cart_item.variant.product.buy + 1,
          });
        }

        return { message: 'Thanh toán thành công' };
      } else {
        cart.payment_status = PaymentStatus.FAILED;
        await this.cartRepo.save(cart);
        throw new BadRequestException('Thanh toán thất bại');
      }
    } catch (error) {
      throw error;
    }
  }
}
