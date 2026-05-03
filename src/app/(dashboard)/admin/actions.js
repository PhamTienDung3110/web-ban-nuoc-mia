"use server";
import connectMongo from '@/utils/db';
import Product from '@/models/Product';
import Customer from '@/models/Customer';
import Account from '@/models/Account';
import CustomPrice from '@/models/CustomPrice';
import bcrypt from 'bcryptjs';
import { getSession } from '@/utils/auth';
import { revalidatePath } from 'next/cache';

export async function addProduct(formData) {
  try {
    const session = await getSession();
    if (!session) throw new Error('Unauthorized');

    await connectMongo();
    await Product.create({
      name: formData.get('name'),
      defaultPrice: parseInt(formData.get('defaultPrice').toString().replace(/\./g, ''), 10),
      unit: formData.get('unit'),
      createdBy: session.userId
    });

    revalidatePath('/admin');
    revalidatePath('/sales');
    return { success: true };
  } catch (err) {
    return { error: err.message };
  }
}

export async function addCustomer(formData) {
  try {
    const session = await getSession();
    if (!session) throw new Error('Unauthorized');

    await connectMongo();
    await Customer.create({
      name: formData.get('name'),
      phone: formData.get('phone'),
      notes: formData.get('notes'),
      createdBy: session.userId
    });

    revalidatePath('/admin');
    revalidatePath('/sales');
    return { success: true };
  } catch (err) {
    return { error: err.message };
  }
}

export async function addCustomPrice(formData) {
  try {
    const session = await getSession();
    if (!session) throw new Error('Unauthorized');

    await connectMongo();
    const customer = formData.get('customer');
    const product = formData.get('product');
    const price = parseInt(formData.get('price').toString().replace(/\./g, ''), 10);

    await CustomPrice.findOneAndUpdate(
      { customer, product, createdBy: session.userId },
      { price },
      { upsert: true, new: true }
    );

    revalidatePath('/admin');
    revalidatePath('/sales');
    return { success: true };
  } catch (err) {
    return { error: err.message };
  }
}


