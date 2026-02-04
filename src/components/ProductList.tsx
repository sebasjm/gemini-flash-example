import {
  Camera,
  ChevronDown,
  Edit3,
  Filter,
  Hash,
  MapPin,
  Plus,
  Search,
  Sparkles,
  Trash2,
  Upload,
  X,
} from "lucide-preact";
import React, { useRef, useState } from "preact/hooks";
import { useTranslation } from "../react-i18next";
import { generateProductDescription } from "../services/geminiService";
import { Category, Product, StorageLocation } from "../types";
import { h, TargetedEvent } from "preact";

interface Props {
  products: Product[];
  categories: Category[];
  storageLocations: StorageLocation[];
  setProducts: (products: Product[]) => void;
  setCategories: (categories: Category[]) => void;
}

const ProductList = ({
  products,
  categories,
  storageLocations,
  setProducts,
  setCategories,
}: Props) => {
  const { t } = useTranslation();
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleDelete = (id: string) => {
    if (window.confirm(t("Are you sure you want to delete this product?"))) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  const getCategoryName = (id: string) =>
    categories.find((c) => c.id === id)?.name || t("Unknown");
  const getLocationName = (id: string) =>
    storageLocations.find((l) => l.id === id)?.name || t("Unknown");

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getCategoryName(p.categoryId)
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      getLocationName(p.storageLocationId)
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 class="text-3xl font-bold text-gray-900 tracking-tight">
            {t("Inventory")}
          </h2>
          <p class="text-gray-500">
            {t("Manage your product catalog and identifiers.")}
          </p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          class="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
        >
          <Plus size={20} />
          <span>{t("Add Product")}</span>
        </button>
      </div>

      <div class="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center">
        <div class="relative flex-1 w-full">
          <Search
            class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder={t("Search products or categories...")}
            class="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-gray-900"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.currentTarget.value)}
          />
        </div>
        <button class="flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 w-full md:w-auto bg-white transition-colors">
          <Filter size={18} />
          <span>{t("Filters")}</span>
        </button>
      </div>

      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {filteredProducts.length === 0 ? (
          <div class="py-24 text-center">
            <div class="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search class="text-gray-300" size={32} />
            </div>
            <h3 class="text-xl font-bold text-gray-900">
              {t("No products found")}
            </h3>
            <p class="text-gray-500 mt-2">
              {t("Try adjusting your search or add a new product.")}
            </p>
          </div>
        ) : (
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-gray-50 border-b border-gray-100">
                  <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    {t("Product")}
                  </th>
                  <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    {t("Identifiers")}
                  </th>
                  <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    {t("Stock & Location")}
                  </th>
                  <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    {t("Price")}
                  </th>
                  <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">
                    {t("Actions")}
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                {filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    class="hover:bg-gray-50/50 transition-colors"
                  >
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center gap-4">
                        <div class="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                          <img
                            src={
                              product.imageUrls[0] ||
                              "https://via.placeholder.com/100"
                            }
                            class="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div class="font-bold text-gray-900">
                            {product.name}
                          </div>
                          <div class="text-xs text-indigo-600 font-medium">
                            {getCategoryName(product.categoryId)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-xs font-mono text-gray-500">
                        SKU: {product.sku || "N/A"}
                      </div>
                      <div class="text-xs font-mono text-gray-500">
                        UPC: {product.upc || "N/A"}
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center gap-1 text-sm font-bold text-gray-900">
                        <Hash size={14} class="text-gray-400" />
                        {product.quantity}
                      </div>
                      <div class="flex items-center gap-1 text-xs text-gray-500">
                        <MapPin size={12} />
                        {getLocationName(product.storageLocationId)}
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm font-black text-emerald-600">
                        ${product.price?.toFixed(2) || "0.00"}
                      </div>
                      {product.tag && (
                        <span
                          class={`inline-block px-2 py-0.5 rounded text-[10px] font-bold mt-1`}
                          style={{
                            backgroundColor: product.tagColor || "#eee",
                            color: "#fff",
                          }}
                        >
                          {product.tag}
                        </span>
                      )}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right">
                      <div class="flex justify-end gap-2">
                        <button
                          onClick={() => setEditingProduct(product)}
                          class="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        >
                          <Edit3 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {(isAdding || editingProduct) && (
        <ProductForm
          product={editingProduct || undefined}
          categories={categories}
          storageLocations={storageLocations}
          onClose={() => {
            setIsAdding(false);
            setEditingProduct(null);
          }}
          onSubmit={(newProduct) => {
            if (editingProduct) {
              setProducts(
                products.map((p) =>
                  p.id === editingProduct.id ? newProduct : p,
                ),
              );
            } else {
              setProducts([...products, newProduct]);
            }
            setIsAdding(false);
            setEditingProduct(null);
          }}
          onAddCategory={(cat) => setCategories([...categories, cat])}
        />
      )}
    </div>
  );
};

interface FormProps {
  product?: Product;
  categories: Category[];
  storageLocations: StorageLocation[];
  onClose: () => void;
  onSubmit: (p: Product) => void;
  onAddCategory: (c: Category) => void;
}

const ProductForm = ({
  product,
  categories,
  storageLocations,
  onClose,
  onSubmit,
  onAddCategory,
}: FormProps) => {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<Partial<Product>>(
    product || {
      name: "",
      sku: "",
      upc: "",
      description: "",
      price: 0,
      tag: "",
      tagColor: "#4f46e5",
      categoryId: categories[0]?.id || "",
      storageLocationId: storageLocations[0]?.id || "",
      quantity: 1,
      imageUrls: [],
    },
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleAISuggest = async () => {
    if (!formData.name) return alert(t("Please enter a product name first."));
    setIsGenerating(true);
    const catName =
      categories.find((c) => c.id === formData.categoryId)?.name ||
      t("General");
    const desc = await generateProductDescription(formData.name!, catName);
    setFormData((prev) => ({ ...prev, description: desc }));
    setIsGenerating(false);
  };

  const handleFileUpload = (e: TargetedEvent<HTMLInputElement, Event>) => {
    const files = e.currentTarget.files;
    if (files) {
      // Fix: Explicitly typing 'file' as File to avoid "unknown" error when passed to readAsDataURL.
      Array.from(files).forEach((file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData((prev) => ({
            ...prev,
            imageUrls: [...(prev.imageUrls || []), reader.result as string],
          }));
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const startCamera = async () => {
    setIsCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera error:", err);
      alert("Could not access camera");
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg");
        setFormData((prev) => ({
          ...prev,
          imageUrls: [...(prev.imageUrls || []), dataUrl],
        }));
        stopCamera();
      }
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      imageUrls: (prev.imageUrls || []).filter((_, i) => i !== index),
    }));
  };

  return (
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div class="bg-white rounded-3xl w-full max-w-xl my-8 shadow-2xl animate-in fade-in zoom-in duration-200 text-gray-900">
        <div class="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
          <h3 class="text-xl font-bold">
            {product ? t("Edit Product") : t("Add New Product")}
          </h3>
          <button
            onClick={onClose}
            class="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form
          class="p-8 space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            if (!formData.categoryId)
              return alert(t("Please select a category"));
            if (!formData.storageLocationId)
              return alert(t("Please select a storage location"));
            onSubmit({
              ...(formData as Product),
              id: product?.id || Date.now().toString(),
              createdAt: product?.createdAt || Date.now(),
              imageUrls: formData.imageUrls || [],
            });
          }}
        >
          <div class="space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="sm:col-span-2">
                <label class="block text-sm font-semibold text-gray-700 mb-1">
                  {t("Product Name")}
                </label>
                <input
                  required
                  type="text"
                  class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.currentTarget.value }))
                  }
                />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">
                  {t("Price ($)")}
                </label>
                <input
                  required
                  type="number"
                  step="0.01"
                  class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      price: parseFloat(e.currentTarget.value),
                    }))
                  }
                />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">
                  {t("Tag (e.g. 10% Discount)")}
                </label>
                <input
                  type="text"
                  class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.tag}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, tag: e.currentTarget.value }))
                  }
                />
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">
                  {t("SKU")}
                </label>
                <input
                  type="text"
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl"
                  value={formData.sku}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, sku: e.currentTarget.value }))
                  }
                />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">
                  {t("Quantity")}
                </label>
                <input
                  required
                  type="number"
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      quantity: parseInt(e.currentTarget.value),
                    }))
                  }
                />
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">
                  {t("Category")}
                </label>
                <CategorySelector
                  selectedId={formData.categoryId || ""}
                  categories={categories}
                  onSelect={(id) =>
                    setFormData((prev) => ({ ...prev, categoryId: id }))
                  }
                  onCreateNew={() => setShowCategoryModal(true)}
                />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">
                  {t("Location")}
                </label>
                <select
                  required
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl"
                  value={formData.storageLocationId}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      storageLocationId: e.currentTarget.value,
                    }))
                  }
                >
                  {storageLocations.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <div class="flex justify-between items-center mb-1">
                <label class="text-sm font-semibold text-gray-700">
                  {t("Description")}
                </label>
                <button
                  type="button"
                  onClick={handleAISuggest}
                  disabled={isGenerating}
                  class="flex items-center gap-1 text-xs font-bold text-indigo-600"
                >
                  <Sparkles size={14} />{" "}
                  {isGenerating ? t("Generating...") : t("Suggest with AI")}
                </button>
              </div>
              <textarea
                required
                rows={2}
                class="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.currentTarget.value,
                  }))
                }
              />
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                {t("Product Images")}
              </label>
              <div class="flex gap-4 mb-4">
                <button
                  type="button"
                  onClick={startCamera}
                  class="flex-1 flex flex-col items-center justify-center p-3 border-2 border-dashed border-gray-200 rounded-xl hover:bg-gray-50"
                >
                  <Camera size={20} />
                  <span class="text-[10px] font-bold mt-1 uppercase tracking-wider">
                    {t("Camera")}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  class="flex-1 flex flex-col items-center justify-center p-3 border-2 border-dashed border-gray-200 rounded-xl hover:bg-gray-50"
                >
                  <Upload size={20} />
                  <span class="text-[10px] font-bold mt-1 uppercase tracking-wider">
                    {t("Files")}
                  </span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  class="hidden"
                  onChange={(e) => handleFileUpload}
                />
              </div>
              <div class="flex gap-2 overflow-x-auto pb-2">
                {formData.imageUrls?.map((url, i) => (
                  <div
                    key={i}
                    class="relative w-16 h-16 rounded-lg overflow-hidden border flex-shrink-0 group"
                  >
                    <img src={url} class="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      class="absolute top-0 right-0 p-1 bg-black/50 text-white rounded-bl opacity-0 group-hover:opacity-100"
                    >
                      <X size={10} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div class="pt-6 flex gap-4">
            <button
              type="button"
              onClick={onClose}
              class="flex-1 py-4 border border-gray-200 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition-colors"
            >
              {t("Cancel")}
            </button>
            <button
              type="submit"
              class="flex-1 py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all"
            >
              {product ? t("Save") : t("Create")}
            </button>
          </div>
        </form>
      </div>

      {isCameraActive && (
        <div class="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-4">
          <div class="relative w-full max-w-lg aspect-[3/4] bg-gray-900 rounded-3xl overflow-hidden shadow-2xl">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              class="w-full h-full object-cover"
            />
            <div class="absolute bottom-10 inset-x-0 flex justify-center gap-10">
              <button
                onClick={stopCamera}
                class="p-4 bg-white/20 backdrop-blur rounded-full text-white hover:bg-white/30"
              >
                <X size={32} />
              </button>
              <button
                onClick={capturePhoto}
                class="w-20 h-20 bg-white rounded-full flex items-center justify-center border-8 border-white/20 active:scale-90 transition-transform"
              >
                <div class="w-14 h-14 rounded-full border-2 border-indigo-600" />
              </button>
            </div>
          </div>
          <canvas ref={canvasRef} class="hidden" />
        </div>
      )}

      {showCategoryModal && (
        <CategoryDialog
          categories={categories}
          onClose={() => setShowCategoryModal(false)}
          onSave={(newCat) => {
            onAddCategory(newCat);
            setFormData((prev) => ({ ...prev, categoryId: newCat.id }));
            setShowCategoryModal(false);
          }}
        />
      )}
    </div>
  );
};

const CategorySelector = ({
  selectedId,
  categories,
  onSelect,
  onCreateNew,
}: {
  selectedId: string;
  categories: Category[];
  onSelect: (id: string) => void;
  onCreateNew: () => void;
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const selectedCategory = categories.find((c) => c.id === selectedId);
  return (
    <div class="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl flex items-center justify-between"
      >
        <span class="truncate">
          {selectedCategory ? selectedCategory.name : t("Select")}
        </span>
        <ChevronDown size={18} />
      </button>
      {isOpen && (
        <div class="absolute top-full left-0 w-full mt-2 bg-white border rounded-2xl shadow-2xl z-[60] overflow-hidden p-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                onSelect(cat.id);
                setIsOpen(false);
              }}
              class={`w-full p-3 flex items-center justify-between rounded-xl hover:bg-gray-50 ${selectedId === cat.id ? "bg-indigo-50 text-indigo-700" : ""}`}
            >
              <span class="font-medium text-sm">{cat.name}</span>
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              onCreateNew();
              setIsOpen(false);
            }}
            class="w-full p-3 bg-indigo-50 text-indigo-700 font-bold text-sm border-t border-indigo-100 rounded-xl mt-1"
          >
            {t("New Category")}
          </button>
        </div>
      )}
    </div>
  );
};

const CategoryDialog = ({
  categories,
  onClose,
  onSave,
}: {
  categories: Category[];
  onClose: () => void;
  onSave: (c: Category) => void;
}) => {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  return (
    <div class="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div class="bg-white rounded-3xl w-full max-w-md shadow-2xl animate-in zoom-in duration-200 p-8">
        <h3 class="text-xl font-bold mb-4">{t("New Category")}</h3>
        <input
          required
          autoFocus
          type="text"
          class="w-full px-4 py-3 border border-gray-200 rounded-xl mb-4"
          placeholder={t("Category Name")}
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
        />
        <div class="flex gap-4">
          <button
            onClick={onClose}
            class="flex-1 py-3 border rounded-xl font-bold text-gray-500"
          >
            {t("Cancel")}
          </button>
          <button
            onClick={() =>
              onSave({
                id: Date.now().toString(),
                name,
                description: "",
                parentId: null,
                createdAt: Date.now(),
              })
            }
            class="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold"
          >
            {t("Save")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
