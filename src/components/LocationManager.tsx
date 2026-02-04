import React, { useState } from "preact/hooks";
import { useTranslation } from "react-i18next";
import {
  MapPin,
  Plus,
  Trash2,
  Edit3,
  X,
  Search,
  ChevronRight,
} from "lucide-react";
import { StorageLocation } from "../types";
import { h } from "preact";

interface Props {
  locations: StorageLocation[];
  onUpdate: (locations: StorageLocation[]) => void;
  onSelectLocation: (id: string) => void;
}

const LocationManager = ({ locations, onUpdate, onSelectLocation }: Props) => {
  const { t } = useTranslation();
  const [isAdding, setIsAdding] = useState(false);
  const [editingLoc, setEditingLoc] = useState<StorageLocation | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleDelete = (id: string) => {
    if (
      window.confirm(
        t("Are you sure you want to delete this storage location?"),
      )
    ) {
      onUpdate(locations.filter((l) => l.id !== id));
    }
  };

  const filtered = locations.filter(
    (l) =>
      l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div class="space-y-8 animate-in fade-in duration-500">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 class="text-3xl font-bold text-gray-900 tracking-tight">
            {t("Storage Locations")}
          </h2>
          <p class="text-gray-500">
            {t("Manage your warehouse and storage areas.")}
          </p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          class="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
        >
          <Plus size={20} />
          <span>{t("Add Location")}</span>
        </button>
      </div>

      <div class="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div class="relative w-full">
          <Search
            class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder={t("Search locations...")}
            class="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-gray-900"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.currentTarget.value)}
          />
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((loc) => (
          <div
            key={loc.id}
            onClick={() => onSelectLocation(loc.id)}
            class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all group cursor-pointer"
          >
            <div class="flex justify-between items-start mb-4">
              <div class="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                <MapPin size={24} />
              </div>
              <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingLoc(loc);
                  }}
                  class="p-2 text-gray-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50"
                >
                  <Edit3 size={18} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(loc.id);
                  }}
                  class="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-1">{loc.name}</h3>
            <p class="text-gray-500 text-sm line-clamp-2 mb-4">
              {loc.description}
            </p>
            <div class="flex items-center text-indigo-600 font-bold text-sm">
              <span>{t("View Products")}</span>
              <ChevronRight
                size={16}
                class="ml-1 group-hover:translate-x-1 transition-transform"
              />
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div class="md:col-span-2 lg:col-span-3 py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100 text-center text-gray-400">
            <MapPin class="mx-auto mb-4 opacity-20" size={48} />
            <p class="font-bold">{t("No locations found")}</p>
          </div>
        )}
      </div>

      {(isAdding || editingLoc) && (
        <LocationForm
          location={editingLoc || undefined}
          onClose={() => {
            setIsAdding(false);
            setEditingLoc(null);
          }}
          onSave={(newLoc) => {
            if (editingLoc) {
              onUpdate(
                locations.map((l) => (l.id === editingLoc.id ? newLoc : l)),
              );
            } else {
              onUpdate([...locations, newLoc]);
            }
            setIsAdding(false);
            setEditingLoc(null);
          }}
        />
      )}
    </div>
  );
};

const LocationForm = ({ location, onClose, onSave }: {
  location?: StorageLocation;
  onClose: () => void;
  onSave: (loc: StorageLocation) => void;
}) => {
  const { t } = useTranslation();
  const [name, setName] = useState(location?.name || "");
  const [description, setDescription] = useState(location?.description || "");

  return (
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div class="bg-white rounded-3xl w-full max-w-md shadow-2xl animate-in zoom-in duration-200">
        <div class="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 class="text-xl font-bold">
            {location ? t("Edit Location") : t("Add Location")}
          </h3>
          <button
            onClick={onClose}
            class="p-2 hover:bg-gray-100 rounded-full text-gray-400"
          >
            <X size={24} />
          </button>
        </div>
        <form
          class="p-8 space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            onSave({
              id: location?.id || Date.now().toString(),
              name,
              description,
              createdAt: location?.createdAt || Date.now(),
            });
          }}
        >
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">
                {t("Location Name")}
              </label>
              <input
                required
                autoFocus
                type="text"
                class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                value={name}
                onChange={(e) => setName(e.currentTarget.value)}
              />
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">
                {t("Description")}
              </label>
              <textarea
                rows={3}
                class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                value={description}
                onChange={(e) => setDescription(e.currentTarget.value)}
              />
            </div>
          </div>
          <div class="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              class="flex-1 py-4 border border-gray-200 rounded-xl font-bold text-gray-500"
            >
              {t("Cancel")}
            </button>
            <button
              type="submit"
              class="flex-1 py-4 bg-indigo-600 text-white rounded-xl font-bold"
            >
              {t("Save")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LocationManager;
