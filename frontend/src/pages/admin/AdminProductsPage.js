import { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Switch } from '../../components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function AdminProductsPage() {
  const { getToken } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    image: '',
    allergens: '',
    variants: [{ name: 'Single', price: 0 }],
    extras: [],
    is_halal: false,
    is_bestseller: false,
    is_featured: false,
    is_active: true
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = getToken();
      const headers = { Authorization: `Bearer ${token}` };
      
      const [productsRes, categoriesRes] = await Promise.all([
        axios.get(`${API}/admin/products`, { headers }),
        axios.get(`${API}/categories`)
      ]);
      
      setProducts(productsRes.data);
      setCategories(categoriesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Fehler beim Laden der Daten');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = getToken();
    const headers = { Authorization: `Bearer ${token}` };

    try {
      if (editingProduct) {
        await axios.put(`${API}/admin/products/${editingProduct.id}`, formData, { headers });
        toast.success('Produkt aktualisiert');
      } else {
        await axios.post(`${API}/admin/products`, formData, { headers });
        toast.success('Produkt erstellt');
      }
      setDialogOpen(false);
      resetForm();
      fetchData();
    } catch (error) {
      toast.error('Fehler beim Speichern');
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Produkt wirklich deaktivieren?')) return;
    
    try {
      const token = getToken();
      await axios.delete(`${API}/admin/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Produkt deaktiviert');
      fetchData();
    } catch (error) {
      toast.error('Fehler beim Deaktivieren');
    }
  };

  const openEditDialog = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      category: product.category,
      image: product.image,
      allergens: product.allergens || '',
      variants: product.variants,
      extras: product.extras || [],
      is_halal: product.is_halal,
      is_bestseller: product.is_bestseller,
      is_featured: product.is_featured || false,
      is_active: product.is_active
    });
    setDialogOpen(true);
  };

  const resetForm = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      category: '',
      image: '',
      allergens: '',
      variants: [{ name: 'Single', price: 0 }],
      extras: [],
      is_halal: false,
      is_featured: false,
      is_bestseller: false,
      is_active: true
    });
  };

  const addVariant = () => {
    setFormData(prev => ({
      ...prev,
      variants: [...prev.variants, { name: '', price: 0, includes: '' }]
    }));
  };

  const updateVariant = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.map((v, i) => 
        i === index ? { ...v, [field]: field === 'price' ? parseFloat(value) || 0 : value } : v
      )
    }));
  };

  const removeVariant = (index) => {
    if (formData.variants.length <= 1) return;
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }));
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Produkte</h1>
          <p className="text-slate-500 mt-1">{products.length} Produkte</p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="bg-green-500 hover:bg-green-600 text-white rounded-full" data-testid="add-product-btn">
              <Plus className="w-4 h-4 mr-2" />
              Neues Produkt
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingProduct ? 'Produkt bearbeiten' : 'Neues Produkt'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label>Name *</Label>
                  <Input 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                    data-testid="product-name-input"
                  />
                </div>
                <div>
                  <Label>Kategorie *</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(value) => setFormData({...formData, category: value})}
                  >
                    <SelectTrigger data-testid="product-category-select">
                      <SelectValue placeholder="Kategorie wählen" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Beschreibung</Label>
                <Textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  data-testid="product-description-input"
                />
              </div>

              <div>
                <Label>Bild-URL</Label>
                <Input 
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  placeholder="https://..."
                  data-testid="product-image-input"
                />
              </div>

              <div>
                <Label>Allergene</Label>
                <Input 
                  value={formData.allergens}
                  onChange={(e) => setFormData({...formData, allergens: e.target.value})}
                  placeholder="z.B. Gluten, Milch, Ei"
                  data-testid="product-allergens-input"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Varianten *</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addVariant}>
                    <Plus className="w-3 h-3 mr-1" /> Variante
                  </Button>
                </div>
                <div className="space-y-2">
                  {formData.variants.map((variant, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <Input 
                        value={variant.name}
                        onChange={(e) => updateVariant(index, 'name', e.target.value)}
                        placeholder="Name (z.B. Single)"
                        className="flex-1"
                      />
                      <Input 
                        type="number"
                        step="0.01"
                        value={variant.price}
                        onChange={(e) => updateVariant(index, 'price', e.target.value)}
                        placeholder="Preis"
                        className="w-24"
                      />
                      <Input 
                        value={variant.includes || ''}
                        onChange={(e) => updateVariant(index, 'includes', e.target.value)}
                        placeholder="inkl. (optional)"
                        className="flex-1"
                      />
                      {formData.variants.length > 1 && (
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeVariant(index)}>
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2">
                  <Switch 
                    checked={formData.is_halal}
                    onCheckedChange={(checked) => setFormData({...formData, is_halal: checked})}
                  />
                  <Label>Halal</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch 
                    checked={formData.is_bestseller}
                    onCheckedChange={(checked) => setFormData({...formData, is_bestseller: checked})}
                  />
                  <Label>Bestseller</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch 
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
                  />
                  <Label>Aktiv</Label>
                </div>
              </div>

              <Button type="submit" className="w-full bg-green-500 hover:bg-green-600" data-testid="product-save-btn">
                {editingProduct ? 'Speichern' : 'Erstellen'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <Input 
          placeholder="Produkte suchen..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
          data-testid="admin-product-search"
        />
      </div>

      {/* Products Table */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-slate-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Produkt</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Kategorie</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Preis ab</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Status</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-slate-500">Aktionen</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-t border-slate-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div>
                          <p className="font-medium text-slate-900">{product.name}</p>
                          <p className="text-xs text-slate-500 line-clamp-1">{product.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-600">{product.category}</td>
                    <td className="py-3 px-4 text-sm font-medium text-green-600">
                      €{Math.min(...product.variants.map(v => v.price)).toFixed(2)}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        product.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {product.is_active ? 'Aktiv' : 'Inaktiv'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => openEditDialog(product)}
                          data-testid={`edit-product-${product.id}`}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDelete(product.id)}
                          data-testid={`delete-product-${product.id}`}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
