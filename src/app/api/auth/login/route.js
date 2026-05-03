import { NextResponse } from 'next/server';
import connectMongo from '@/utils/db';
import Account from '@/models/Account';
import bcrypt from 'bcryptjs';
import { setAuthCookie } from '@/utils/auth';

export async function POST(req) {
  try {
    await connectMongo();
    const { username, password } = await req.json();

    const user = await Account.findOne({ username });
    if (!user) {
      return NextResponse.json({ error: 'Tài khoản không tồn tại' }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json({ error: 'Sai mật khẩu' }, { status: 401 });
    }

    await setAuthCookie({
      userId: user._id.toString(),
      username: user.username,
      role: user.role,
      name: user.name
    });

    return NextResponse.json({ success: true, message: 'Đăng nhập thành công' });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Lỗi máy chủ' }, { status: 500 });
  }
}
