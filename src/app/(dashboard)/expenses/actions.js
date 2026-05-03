"use server";
import connectMongo from '@/utils/db';
import ExpenseRecord from '@/models/ExpenseRecord';
import { getSession } from '@/utils/auth';
import { revalidatePath } from 'next/cache';

export async function addExpense(formData) {
  try {
    const session = await getSession();
    if (!session) throw new Error('Unauthorized');

    await connectMongo();

    const name = formData.get('name');
    const amount = parseInt(formData.get('amount').toString().replace(/\./g, ''), 10);
    const description = formData.get('description');

    await ExpenseRecord.create({
      name,
      amount,
      description,
      createdBy: session.userId
    });

    revalidatePath('/');
    revalidatePath('/expenses');
    return { success: true };
  } catch (err) {
    return { error: err.message };
  }
}

export async function deleteExpense(id) {
  try {
    const session = await getSession();
    if (!session) throw new Error('Unauthorized');
    await connectMongo();
    const existingExpense = await ExpenseRecord.findById(id);
    if (!existingExpense || existingExpense.createdBy.toString() !== session.userId) throw new Error('Unauthorized');
    await ExpenseRecord.findByIdAndDelete(id);
    revalidatePath('/');
    revalidatePath('/expenses');
    return { success: true };
  } catch (err) {
    return { error: err.message };
  }
}

export async function updateExpense(id, formData) {
  try {
    const session = await getSession();
    if (!session) throw new Error('Unauthorized');
    await connectMongo();

    const existingExpense = await ExpenseRecord.findById(id);
    if (!existingExpense) throw new Error('Không tìm thấy khoản chi');
    if (existingExpense.createdBy.toString() !== session.userId) throw new Error('Unauthorized');

    const name = formData.get('name');
    const amount = parseInt(formData.get('amount').toString().replace(/\./g, ''), 10);
    const description = formData.get('description');

    await ExpenseRecord.findByIdAndUpdate(id, {
      name,
      amount,
      description
    });

    revalidatePath('/');
    revalidatePath('/expenses');
    return { success: true };
  } catch (err) {
    return { error: err.message };
  }
}
