"use server";
import connectMongo from '@/utils/db';
import SaleRecord from '@/models/SaleRecord';
import Product from '@/models/Product';
import CustomPrice from '@/models/CustomPrice';
import { getSession } from '@/utils/auth';
import { revalidatePath } from 'next/cache';

export async function addSale(formData) {
  try {
    const session = await getSession();
    if (!session) throw new Error('Unauthorized');

    await connectMongo();

    const productId = formData.get('product');
    const customerId = null;
    const quantity = parseInt(formData.get('quantity').toString().replace(/\./g, ''), 10);

    const product = await Product.findById(productId);
    if (!product) throw new Error('Product not found');

    let unitPrice = product.defaultPrice;

    if (customerId) {
      const customPrice = await CustomPrice.findOne({ product: productId, customer: customerId });
      if (customPrice) {
        unitPrice = customPrice.price;
      }
    }

    const totalPrice = unitPrice * quantity;

    await SaleRecord.create({
      product: productId,
      customer: customerId,
      quantity,
      unitPrice,
      totalPrice,
      createdBy: session.userId
    });

    revalidatePath('/');
    revalidatePath('/sales');
    return { success: true };
  } catch (err) {
    return { error: err.message };
  }
}

export async function deleteSale(id) {
  try {
    const session = await getSession();
    if (!session) throw new Error('Unauthorized');
    await connectMongo();
    const existingSale = await SaleRecord.findById(id);
    if (!existingSale || existingSale.createdBy.toString() !== session.userId) throw new Error('Unauthorized');
    await SaleRecord.findByIdAndDelete(id);
    revalidatePath('/');
    revalidatePath('/sales');
    return { success: true };
  } catch (err) {
    return { error: err.message };
  }
}

export async function updateSale(id, formData) {
  try {
    const session = await getSession();
    if (!session) throw new Error('Unauthorized');
    await connectMongo();

    const productId = formData.get('product');
    const customerId = null;
    const quantity = parseInt(formData.get('quantity').toString().replace(/\./g, ''), 10);

    const existingSale = await SaleRecord.findById(id);
    if (!existingSale) throw new Error('Không tìm thấy giao dịch');
    if (existingSale.createdBy.toString() !== session.userId) throw new Error('Unauthorized');

    let unitPrice = existingSale.unitPrice;

    if (existingSale.product.toString() !== productId || 
        (existingSale.customer ? existingSale.customer.toString() : null) !== customerId) {
      const product = await Product.findById(productId);
      if (!product) throw new Error('Product not found');
      unitPrice = product.defaultPrice;
      if (customerId) {
        const customPrice = await CustomPrice.findOne({ product: productId, customer: customerId });
        if (customPrice) {
          unitPrice = customPrice.price;
        }
      }
    }

    const totalPrice = unitPrice * quantity;

    await SaleRecord.findByIdAndUpdate(id, {
      product: productId,
      customer: customerId,
      quantity,
      unitPrice,
      totalPrice
    });

    revalidatePath('/');
    revalidatePath('/sales');
    return { success: true };
  } catch (err) {
    return { error: err.message };
  }
}
