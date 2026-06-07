import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import Loader from '../../components/ui/Loader';
import { CATEGORIES } from '../../utils/constants';
import { formatCurrency, getImageUrl } from '../../utils/formatCurrency';

const emptyProduct = {
  name: '',
  description: '',
  category: CATEGORIES[0],
  price: 0,
  stock: 0,
  images: [{ url: '' }],
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyProduct);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageSourceType, setImageSourceType] = useState('upload');
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setUploading(true);
    try {
      const { data } = await api.post('/products/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setForm((prev) => ({
        ...prev,
        images: [{ url: data.url }],
      }));
      toast.success('Image uploaded successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const load = () => {
    api.get('/admin/products').then(({ data }) => {
      setProducts(data.products);
      setLoading(false);
    });
  };

  useEffect(() => {
    load();
    const params = new URLSearchParams(window.location.search);
    if (params.get('action') === 'add') {
      setForm(emptyProduct);
      setEditing(null);
      setIsModalOpen(true);
    }
  }, []);

  const closeModal = () => {
    setIsModalOpen(false);
    setForm(emptyProduct);
    setEditing(null);
    const url = new URL(window.location);
    url.searchParams.delete('action');
    window.history.pushState({}, '', url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/products/${editing}`, form);
        toast.success('Product updated');
      } else {
        await api.post('/products', form);
        toast.success('Product created');
      }
      closeModal();
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const startEdit = (p) => {
    setEditing(p._id);
    setForm({
      name: p.name,
      description: p.description,
      category: p.category,
      price: p.price,
      stock: p.stock,
      images: p.images?.length ? p.images : [{ url: '' }],
    });
    setIsModalOpen(true);
  };

  const deactivate = async (id) => {
    if (!confirm('Deactivate this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      setProducts((current) => current.filter((product) => product._id !== id));
      toast.success('Product deleted');
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="flex items-center justify-between border-b pb-5 dark:border-gray-800">
        <h1 className="text-3xl font-bold">Manage Products</h1>
        <button
          onClick={() => {
            setForm(emptyProduct);
            setEditing(null);
            setIsModalOpen(true);
          }}
          className="btn-primary flex items-center gap-1.5"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Product
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm transition-opacity">
          <div className="relative w-full max-w-2xl rounded-2xl border border-slate-100 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-4 mb-4 dark:border-slate-800">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                {editing ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg p-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">Name</label>
                <input
                  placeholder="Product Name"
                  required
                  className="input-field"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Category</label>
                <select
                  className="input-field"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Product Image</label>
                <div className="flex gap-4 mb-3">
                  <button
                    type="button"
                    onClick={() => setImageSourceType('upload')}
                    className={`flex-1 py-2 px-4 text-xs font-semibold rounded-lg border transition-all ${
                      imageSourceType === 'upload'
                        ? 'bg-brand-50 border-brand-500 text-brand-700 dark:bg-brand-950/20 dark:border-brand-500 dark:text-brand-400'
                        : 'bg-white border-slate-200 text-slate-700 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300'
                    }`}
                  >
                    Upload File
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageSourceType('url')}
                    className={`flex-1 py-2 px-4 text-xs font-semibold rounded-lg border transition-all ${
                      imageSourceType === 'url'
                        ? 'bg-brand-50 border-brand-500 text-brand-700 dark:bg-brand-950/20 dark:border-brand-500 dark:text-brand-400'
                        : 'bg-white border-slate-200 text-slate-700 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300'
                    }`}
                  >
                    Paste Image Link
                  </button>
                </div>

                {imageSourceType === 'upload' ? (
                  <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-950/50 hover:bg-slate-50 dark:hover:bg-slate-950 transition-colors">
                    {uploading ? (
                      <div className="py-4 text-center text-sm text-slate-500">
                        <svg className="animate-spin h-6 w-6 text-brand-600 mx-auto mb-2" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Uploading image...
                      </div>
                    ) : form.images[0]?.url ? (
                      <div className="w-full flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={getImageUrl(form.images[0].url)}
                            alt="Preview"
                            className="h-14 w-14 object-cover rounded-lg border dark:border-slate-800"
                          />
                          <div className="text-left">
                            <span className="text-xs font-semibold text-green-600 dark:text-green-400 block">✓ Uploaded</span>
                            <span className="text-xs text-slate-500 truncate max-w-[180px] block">{form.images[0].url}</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setForm((prev) => ({ ...prev, images: [{ url: '' }] }))}
                          className="text-xs text-red-600 hover:underline font-semibold"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <label className="cursor-pointer py-2 text-center w-full">
                        <svg className="h-8 w-8 text-slate-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm font-semibold text-brand-600 hover:text-brand-700 block">Click to upload file</span>
                        <span className="text-xs text-slate-400 block mt-1">PNG, JPG, WEBP, GIF up to 5MB</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                ) : (
                  <div>
                    <input
                      placeholder="https://images.unsplash.com/..."
                      className="input-field"
                      value={form.images[0]?.url || ''}
                      onChange={(e) => setForm({ ...form, images: [{ url: e.target.value }] })}
                    />
                    {form.images[0]?.url && (
                      <div className="mt-2 flex items-center gap-3">
                        <img
                          src={getImageUrl(form.images[0].url)}
                          alt="Preview"
                          className="h-10 w-10 object-cover rounded-lg border dark:border-slate-800"
                        />
                        <span className="text-xs text-slate-500 truncate max-w-[280px]">{form.images[0].url}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium">Description</label>
                <textarea
                  placeholder="Product Description"
                  required
                  className="input-field min-h-[100px]"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Price (₹)</label>
                <input
                  type="number"
                  placeholder="Price"
                  required
                  className="input-field"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Stock</label>
                <input
                  type="number"
                  placeholder="Stock"
                  className="input-field"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
                />
              </div>
              <div className="sm:col-span-2 flex justify-end gap-3 border-t pt-4 mt-2 dark:border-slate-800">
                <button
                  type="button"
                  onClick={closeModal}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editing ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="mt-10 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left dark:border-gray-800">
              <th className="py-2">Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="border-b dark:border-gray-800">
                <td className="py-3 font-medium text-slate-900 dark:text-white">{p.name}</td>
                <td className="text-slate-600 dark:text-slate-400">{p.category}</td>
                <td className="font-semibold">{formatCurrency(p.price)}</td>
                <td className="text-slate-600 dark:text-slate-400">{p.stock}</td>
                <td className="space-x-4">
                  <button type="button" onClick={() => startEdit(p)} className="text-brand-600 hover:text-brand-700 font-semibold transition-colors">
                    Edit
                  </button>
                  <button type="button" onClick={() => deactivate(p._id)} className="text-red-600 hover:text-red-700 font-semibold transition-colors">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
