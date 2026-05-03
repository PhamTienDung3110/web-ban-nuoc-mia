import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "vietnamese"], variable: '--font-inter' });

export const metadata = {
  title: "Quản Lý Bán Nước Mía",
  description: "Phần mềm tính toán bán nước mía chuyên nghiệp",
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body className={inter.variable}>
        {children}
      </body>
    </html>
  );
}
