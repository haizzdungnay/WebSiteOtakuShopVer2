'use client';

import { useState, useMemo, FormEvent } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  BarChart3,
  Coins,
  FilePlus,
  FolderPlus,
  ListChecks,
  LockKeyhole,
  PackageCheck,
  ShieldAlert,
  Users,
} from 'lucide-react';
import Link from 'next/link';

interface ProductFormState {
  name: string;
  sku: string;
  price: string;
  stock: string;
  category: string;
}

interface AnnouncementForm {
  title: string;
  summary: string;
  content: string;
}

interface Order {
  id: number;
  customer: string;
  items: number;
  total: number;
  status: 'pending' | 'approved' | 'rejected';
  channel: string;
}

const initialProducts = [
  {
    id: 1,
    name: 'Figure Itadori Yuji 1/7',
    sku: 'FIG-ITD-01',
    price: 2890000,
    stock: 12,
    category: 'Jujutsu Kaisen',
    status: 'active' as const,
  },
  {
    id: 2,
    name: 'Nendoroid Gojo Satoru',
    sku: 'NEN-GOJ-88',
    price: 1590000,
    stock: 8,
    category: 'Nendoroid',
    status: 'active' as const,
  },
  {
    id: 3,
    name: 'Mô hình Luffy Gear 5',
    sku: 'FIG-LUF-05',
    price: 3250000,
    stock: 5,
    category: 'One Piece',
    status: 'inactive' as const,
  },
];

const initialOrders: Order[] = [
  {
    id: 101,
    customer: 'Trần Duy',
    items: 3,
    total: 6890000,
    status: 'pending',
    channel: 'Website',
  },
  {
    id: 102,
    customer: 'Nguyễn Hà',
    items: 2,
    total: 3120000,
    status: 'approved',
    channel: 'Facebook',
  },
  {
    id: 103,
    customer: 'Hoàng Nam',
    items: 5,
    total: 9450000,
    status: 'pending',
    channel: 'Shopee',
  },
];

const initialAnnouncements = [
  {
    id: 1,
    title: 'Lịch nhập hàng tháng 5',
    summary: 'Cập nhật tiến độ container mới về với hơn 200 mẫu figure.',
    createdAt: '02/05/2024',
  },
];

export default function AdminPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState(initialProducts);
  const [orders, setOrders] = useState(initialOrders);
  const [announcements, setAnnouncements] = useState(initialAnnouncements);
  const [productForm, setProductForm] = useState<ProductFormState>({
    name: '',
    sku: '',
    price: '',
    stock: '',
    category: '',
  });
  const [announcementForm, setAnnouncementForm] = useState<AnnouncementForm>({
    title: '',
    summary: '',
    content: '',
  });
  const [manualIncome, setManualIncome] = useState<{ source: string; amount: string }>({
    source: '',
    amount: '',
  });
  const [incomeRecords, setIncomeRecords] = useState<{ source: string; amount: number }[]>([]);

  const approvedOrdersIncome = useMemo(
    () =>
      orders
        .filter((order) => order.status === 'approved')
        .reduce((sum, order) => sum + order.total, 0),
    [orders],
  );

  const totalIncome = useMemo(() => {
    const manual = incomeRecords.reduce((sum, record) => sum + record.amount, 0);
    return manual + approvedOrdersIncome;
  }, [incomeRecords, approvedOrdersIncome]);

  const pendingOrders = orders.filter((order) => order.status === 'pending');

  const handleAddProduct = (event: FormEvent) => {
    event.preventDefault();
    setProducts((prev) => [
      {
        id: Date.now(),
        name: productForm.name,
        sku: productForm.sku,
        price: Number(productForm.price),
        stock: Number(productForm.stock),
        category: productForm.category,
        status: 'active',
      },
      ...prev,
    ]);
    setProductForm({ name: '', sku: '', price: '', stock: '', category: '' });
  };

  const handleUpdateProductStatus = (id: number, status: 'active' | 'inactive') => {
    setProducts((prev) => prev.map((product) => (product.id === id ? { ...product, status } : product)));
  };

  const handleAdjustStock = (id: number, amount: number) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === id
          ? { ...product, stock: Math.max(0, product.stock + amount) }
          : product,
      ),
    );
  };

  const handleOrderDecision = (id: number, status: 'approved' | 'rejected') => {
    setOrders((prev) =>
      prev.map((order) => (order.id === id ? { ...order, status } : order)),
    );
  };

  const handleIncomeRecord = (event: FormEvent) => {
    event.preventDefault();
    if (!manualIncome.source || !manualIncome.amount) return;
    setIncomeRecords((prev) => [
      ...prev,
      { source: manualIncome.source, amount: Number(manualIncome.amount) },
    ]);
    setManualIncome({ source: '', amount: '' });
  };

  const handleAnnouncementSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!announcementForm.title || !announcementForm.summary) return;
    setAnnouncements((prev) => [
      {
        id: Date.now(),
        title: announcementForm.title,
        summary: announcementForm.summary,
        createdAt: new Date().toLocaleDateString('vi-VN'),
      },
      ...prev,
    ]);
    setAnnouncementForm({ title: '', summary: '', content: '' });
  };

  if (!user || user.role !== 'admin') {
    return (
      <section className="min-h-screen bg-slate-50 flex items-center justify-center px-6 py-16">
        <div className="max-w-xl w-full text-center bg-white shadow-lg rounded-3xl p-10 border border-slate-100">
          <div className="mx-auto mb-6 w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
            <ShieldAlert size={32} />
          </div>
          <h1 className="text-2xl font-semibold text-slate-900 mb-3">Không có quyền truy cập</h1>
          <p className="text-slate-600 mb-6">
            Khu vực này chỉ dành cho quản trị viên. Vui lòng đăng nhập bằng tài khoản quản trị để truy cập.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:bg-slate-800"
          >
            Đăng nhập
          </Link>
        </div>
      </section>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container-custom space-y-10">
        <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-8 text-white shadow-2xl">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-300">Admin workspace</p>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold">Xin chào, {user.username}</h1>
              <p className="text-slate-300 mt-2">
                Quản trị đơn hàng, doanh thu và nội dung chỉ trong một bảng điều khiển.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-white/10 px-6 py-4 text-center">
                <div className="text-2xl font-bold">{products.length}</div>
                <p className="text-sm text-slate-300">Mặt hàng đang quản lý</p>
              </div>
              <div className="rounded-2xl bg-white/10 px-6 py-4 text-center">
                <div className="text-2xl font-bold">{pendingOrders.length}</div>
                <p className="text-sm text-slate-300">Đơn chờ duyệt</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl bg-white p-6 shadow-lg border border-slate-100">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">Tổng thu nhập dự kiến</p>
              <Coins className="text-amber-500" size={20} />
            </div>
            <p className="mt-4 text-3xl font-bold text-slate-900">
              {totalIncome.toLocaleString('vi-VN')}đ
            </p>
            <p className="text-xs text-emerald-500 mt-1">Bao gồm đơn đã duyệt & thu nhập thủ công</p>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-lg border border-slate-100">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">Đơn chờ duyệt</p>
              <ListChecks className="text-blue-500" size={20} />
            </div>
            <p className="mt-4 text-3xl font-bold text-slate-900">{pendingOrders.length}</p>
            <p className="text-xs text-slate-500 mt-1">Theo dõi trạng thái từng đơn hàng</p>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-lg border border-slate-100">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">Nhân viên trực tuyến</p>
              <Users className="text-purple-500" size={20} />
            </div>
            <p className="mt-4 text-3xl font-bold text-slate-900">3</p>
            <p className="text-xs text-slate-500 mt-1">Giao ca đầy đủ</p>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-lg border border-slate-100">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">Bài đăng thông báo</p>
              <FilePlus className="text-rose-500" size={20} />
            </div>
            <p className="mt-4 text-3xl font-bold text-slate-900">{announcements.length}</p>
            <p className="text-xs text-slate-500 mt-1">Tin tức đã lên lịch</p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <div className="rounded-3xl bg-white p-8 shadow-xl border border-slate-100">
            <div className="flex items-center gap-3 mb-6">
              <FolderPlus className="text-slate-900" />
              <div>
                <h2 className="text-xl font-semibold">Thêm mặt hàng nhanh</h2>
                <p className="text-sm text-slate-500">Ghi nhận sản phẩm mới để đội nội dung cập nhật.</p>
              </div>
            </div>
            <form className="grid gap-4 md:grid-cols-2" onSubmit={handleAddProduct}>
              <input
                required
                value={productForm.name}
                onChange={(event) => setProductForm({ ...productForm, name: event.target.value })}
                placeholder="Tên sản phẩm"
                className="input-field"
              />
              <input
                required
                value={productForm.sku}
                onChange={(event) => setProductForm({ ...productForm, sku: event.target.value })}
                placeholder="Mã SKU"
                className="input-field"
              />
              <input
                required
                type="number"
                min={0}
                value={productForm.price}
                onChange={(event) => setProductForm({ ...productForm, price: event.target.value })}
                placeholder="Giá bán"
                className="input-field"
              />
              <input
                required
                type="number"
                min={0}
                value={productForm.stock}
                onChange={(event) => setProductForm({ ...productForm, stock: event.target.value })}
                placeholder="Tồn kho"
                className="input-field"
              />
              <input
                required
                value={productForm.category}
                onChange={(event) => setProductForm({ ...productForm, category: event.target.value })}
                placeholder="Dòng sản phẩm"
                className="input-field md:col-span-2"
              />
              <button
                type="submit"
                className="md:col-span-2 rounded-2xl bg-slate-900 py-3 text-sm font-semibold text-white shadow-lg hover:bg-slate-800"
              >
                Lưu mặt hàng mới
              </button>
            </form>
          </div>

          <div className="rounded-3xl bg-white p-8 shadow-xl border border-slate-100">
            <div className="flex items-center gap-3 mb-6">
              <BarChart3 className="text-slate-900" />
              <div>
                <h2 className="text-xl font-semibold">Tính thu nhập</h2>
                <p className="text-sm text-slate-500">Thêm các nguồn thu bổ sung ngoài đơn đã duyệt.</p>
              </div>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4 mb-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">Tổng cộng</p>
              <p className="text-3xl font-bold text-slate-900">{totalIncome.toLocaleString('vi-VN')}đ</p>
              <p className="text-xs text-slate-500">Trong đó đơn đã duyệt đóng góp {approvedOrdersIncome.toLocaleString('vi-VN')}đ</p>
            </div>
            <form className="space-y-3" onSubmit={handleIncomeRecord}>
              <input
                required
                value={manualIncome.source}
                onChange={(event) => setManualIncome({ ...manualIncome, source: event.target.value })}
                placeholder="Nguồn thu (ví dụ: hội chợ, kênh cộng tác viên)"
                className="input-field"
              />
              <input
                required
                type="number"
                min={0}
                value={manualIncome.amount}
                onChange={(event) => setManualIncome({ ...manualIncome, amount: event.target.value })}
                placeholder="Số tiền"
                className="input-field"
              />
              <button
                type="submit"
                className="w-full rounded-2xl bg-slate-900 py-3 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Ghi nhận thu nhập
              </button>
            </form>
            <ul className="mt-6 space-y-3 text-sm">
              {incomeRecords.length === 0 && (
                <li className="rounded-2xl border border-dashed border-slate-200 px-4 py-3 text-slate-400 text-center">
                  Chưa có nguồn thu bổ sung nào được ghi nhận
                </li>
              )}
              {incomeRecords.map((record) => (
                <li
                  key={`${record.source}-${record.amount}`}
                  className="flex items-center justify-between rounded-2xl border border-slate-100 px-4 py-3 text-slate-700"
                >
                  <span>{record.source}</span>
                  <span className="font-semibold">+{record.amount.toLocaleString('vi-VN')}đ</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-3xl bg-white p-8 shadow-xl border border-slate-100">
            <div className="flex items-center gap-3 mb-6">
              <PackageCheck className="text-slate-900" />
              <div>
                <h2 className="text-xl font-semibold">Duyệt đơn</h2>
                <p className="text-sm text-slate-500">Kiểm tra nguồn kênh và xác nhận thanh toán.</p>
              </div>
            </div>
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="rounded-2xl border border-slate-100 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm text-slate-500">#{order.id} • {order.channel}</p>
                      <p className="text-lg font-semibold text-slate-900">{order.customer}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500">Giá trị</p>
                      <p className="text-lg font-semibold text-slate-900">
                        {order.total.toLocaleString('vi-VN')}đ
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        order.status === 'approved'
                          ? 'bg-emerald-50 text-emerald-600'
                          : order.status === 'rejected'
                          ? 'bg-rose-50 text-rose-600'
                          : 'bg-amber-50 text-amber-600'
                      }`}
                    >
                      {order.status === 'approved'
                        ? 'Đã duyệt'
                        : order.status === 'rejected'
                        ? 'Từ chối'
                        : 'Đang chờ'}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleOrderDecision(order.id, 'approved')}
                        className="rounded-full bg-emerald-500/10 px-4 py-2 text-xs font-semibold text-emerald-600 hover:bg-emerald-500/20"
                      >
                        Chấp nhận
                      </button>
                      <button
                        onClick={() => handleOrderDecision(order.id, 'rejected')}
                        className="rounded-full bg-rose-500/10 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-500/20"
                      >
                        Từ chối
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-white p-8 shadow-xl border border-slate-100">
            <div className="flex items-center gap-3 mb-6">
              <ListChecks className="text-slate-900" />
              <div>
                <h2 className="text-xl font-semibold">Quản lý mặt hàng</h2>
                <p className="text-sm text-slate-500">Điều chỉnh tồn kho và trạng thái bán.</p>
              </div>
            </div>
            <div className="space-y-4">
              {products.map((product) => (
                <div key={product.id} className="rounded-2xl border border-slate-100 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{product.name}</p>
                      <p className="text-xs text-slate-500">{product.sku} • {product.category}</p>
                    </div>
                    <div className="text-right text-sm">
                      <p className="text-slate-500">Giá</p>
                      <p className="font-semibold text-slate-900">{product.price.toLocaleString('vi-VN')}đ</p>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-slate-500">Tồn kho:</span>
                      <span className="font-semibold text-slate-900">{product.stock}</span>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleAdjustStock(product.id, 1)}
                          className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold"
                        >
                          +1
                        </button>
                        <button
                          onClick={() => handleAdjustStock(product.id, -1)}
                          className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold"
                        >
                          -1
                        </button>
                      </div>
                    </div>
                    <select
                      value={product.status}
                      onChange={(event) => handleUpdateProductStatus(product.id, event.target.value as 'active' | 'inactive')}
                      className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold"
                    >
                      <option value="active">Đang bán</option>
                      <option value="inactive">Tạm ẩn</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-8 shadow-xl border border-slate-100">
          <div className="flex items-center gap-3 mb-6">
            <LockKeyhole className="text-slate-900" />
            <div>
              <h2 className="text-xl font-semibold">Đăng thông tin nội bộ</h2>
              <p className="text-sm text-slate-500">Biên tập thông báo cho cộng đồng hoặc nội bộ cửa hàng.</p>
            </div>
          </div>
          <form className="grid gap-4 md:grid-cols-2" onSubmit={handleAnnouncementSubmit}>
            <input
              required
              value={announcementForm.title}
              onChange={(event) => setAnnouncementForm({ ...announcementForm, title: event.target.value })}
              placeholder="Tiêu đề thông báo"
              className="input-field md:col-span-2"
            />
            <input
              required
              value={announcementForm.summary}
              onChange={(event) => setAnnouncementForm({ ...announcementForm, summary: event.target.value })}
              placeholder="Tóm tắt ngắn"
              className="input-field md:col-span-2"
            />
            <textarea
              rows={4}
              value={announcementForm.content}
              onChange={(event) => setAnnouncementForm({ ...announcementForm, content: event.target.value })}
              placeholder="Nội dung chi tiết (tùy chọn)"
              className="input-field md:col-span-2"
            />
            <button
              type="submit"
              className="md:col-span-2 rounded-2xl bg-slate-900 py-3 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Đăng thông báo
            </button>
          </form>
          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            {announcements.map((announcement) => (
              <div key={announcement.id} className="rounded-2xl border border-slate-100 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500">{announcement.createdAt}</p>
                <h3 className="mt-2 text-lg font-semibold text-slate-900">{announcement.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{announcement.summary}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
