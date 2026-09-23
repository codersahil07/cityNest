"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PlusSquare, Upload, Building2, MapPin, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { SafeImage } from "@/components/ui/SafeImage";

interface City {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function ListBusinessPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [newSlug, setNewSlug] = useState("");

  const [cities, setCities] = useState<City[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // Form State
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [cityId, setCityId] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      const [{ data: cityData }, { data: catData }] = await Promise.all([
        supabase.from("cities").select("id, name").order("name"),
        supabase.from("categories").select("id, name, slug").order("name"),
      ]);

      if (cityData) setCities(cityData);
      if (catData) setCategories(catData);
    }
    fetchData();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate type
      if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
        setError("Invalid image format. Please upload JPG, PNG, or WEBP.");
        return;
      }

      // Validate size (6MB = 6 * 1024 * 1024)
      if (file.size > 6 * 1024 * 1024) {
        setError("Image size must be less than 6MB.");
        return;
      }

      setError(null);
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setUploadStatus("");

    if (!imageFile) {
      setError("Main photo is required.");
      setLoading(false);
      return;
    }

    try {
      // 1. Upload Image
      setUploadStatus("Uploading image...");
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("business-images")
        .upload(filePath, imageFile, { upsert: false });

      if (uploadError) {
        throw new Error(`Image upload failed: ${uploadError.message}`);
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("business-images")
        .getPublicUrl(filePath);

      // 2. Create Listing
      setUploadStatus("Creating listing...");
      
      // Generate slug
      let baseSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      const uniqueSlug = `${baseSlug}-${Date.now().toString().slice(-6)}`;

      // Get user if logged in
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id || null;

      const { error: insertError } = await supabase.from("listings").insert({
        name,
        slug: uniqueSlug,
        city_id: cityId,
        category_id: categoryId,
        address,
        description,
        contact_phone: phone || null,
        website_url: website || null,
        image_url: publicUrl,
        status: "approved",
        is_featured: false,
        is_trending: false,
        rating: 0,
        review_count: 0,
        created_by: userId
      });

      if (insertError) {
        throw new Error(`Database error: ${insertError.message}`);
      }

      setNewSlug(uniqueSlug);
      setSuccess(true);

    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
      setUploadStatus("");
    }
  };

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] p-4">
        <div className="w-full max-w-md bg-zinc-900 border border-[#27272a] rounded-3xl p-8 shadow-2xl text-center">
          <div className="w-16 h-16 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center mx-auto mb-6">
            <PlusSquare className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Your Business Is Live!</h2>
          <p className="text-zinc-400 mb-8">Your business has been successfully added to CityNest and is now visible to visitors.</p>
          <div className="flex flex-col gap-3">
            <Link 
              href={`/listing/${newSlug}`}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-smooth"
            >
              View Listing
            </Link>
            <button 
              onClick={() => {
                setSuccess(false);
                setName("");
                setAddress("");
                setDescription("");
                setPhone("");
                setWebsite("");
                removeImage();
              }}
              className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-medium transition-smooth"
            >
              List Another Business
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto space-y-8 min-h-screen">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <div className="p-2 bg-blue-500/20 rounded-xl text-blue-500">
            <Building2 className="w-6 h-6" />
          </div>
          List Your Business
        </h1>
        <p className="text-zinc-400">Add your place to CityNest and reach thousands of locals exploring the city. No account required!</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-zinc-900 border border-[#27272a] rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-4 rounded-xl">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white border-b border-zinc-800 pb-2">Basic Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-zinc-300 ml-1">Business Name *</label>
              <input required type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 focus:border-blue-500 rounded-xl py-3 px-4 text-white outline-none transition-smooth" placeholder="E.g., Central Mall" />
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-medium text-zinc-300 ml-1">Category *</label>
              <select required value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 focus:border-blue-500 rounded-xl py-3 px-4 text-white outline-none transition-smooth appearance-none">
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-1 md:col-span-2">
              <label className="text-sm font-medium text-zinc-300 ml-1">City *</label>
              <select required value={cityId} onChange={(e) => setCityId(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 focus:border-blue-500 rounded-xl py-3 px-4 text-white outline-none transition-smooth appearance-none">
                <option value="">Select a city</option>
                {cities.map(city => (
                  <option key={city.id} value={city.id}>{city.name}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="space-y-1">
            <label className="text-sm font-medium text-zinc-300 ml-1">Description *</label>
            <textarea required value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="w-full bg-zinc-950 border border-zinc-800 focus:border-blue-500 rounded-xl py-3 px-4 text-white outline-none transition-smooth resize-none" placeholder="Tell people about this place..."></textarea>
          </div>
        </div>

        <div className="space-y-4 pt-4">
          <h2 className="text-xl font-bold text-white border-b border-zinc-800 pb-2">Location & Contact</h2>
          
          <div className="space-y-1">
            <label className="text-sm font-medium text-zinc-300 ml-1">Full Address *</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input required type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 focus:border-blue-500 rounded-xl py-3 pl-10 pr-4 text-white outline-none transition-smooth" placeholder="123 Main Street, City" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-zinc-300 ml-1">Phone Number</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 focus:border-blue-500 rounded-xl py-3 px-4 text-white outline-none transition-smooth" placeholder="+91 98765 43210" />
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-medium text-zinc-300 ml-1">Website URL</label>
              <input type="url" value={website} onChange={(e) => setWebsite(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 focus:border-blue-500 rounded-xl py-3 px-4 text-white outline-none transition-smooth" placeholder="https://" />
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4">
          <h2 className="text-xl font-bold text-white border-b border-zinc-800 pb-2">Media</h2>
          
          <div className="space-y-1">
            <label className="text-sm font-medium text-zinc-300 ml-1">Main Image *</label>
            
            {!imagePreview ? (
              <label className="border-2 border-dashed border-zinc-700 hover:border-blue-500 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-smooth bg-zinc-950 block">
                <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageChange} className="hidden" />
                <Upload className="w-8 h-8 text-zinc-500 mb-3" />
                <p className="text-zinc-300 font-medium mb-1">Click to upload image</p>
                <p className="text-zinc-500 text-sm">PNG, JPG or WEBP (Max 6MB)</p>
              </label>
            ) : (
              <div className="relative group rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950">
                <img src={imagePreview} alt="Preview" className="w-full h-64 object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-smooth flex items-center justify-center">
                  <button type="button" onClick={removeImage} className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-smooth">
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="pt-6">
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-lg transition-smooth shadow-lg shadow-blue-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (uploadStatus || 'Submitting...') : 'Submit Listing'}
          </button>
        </div>
      </form>
    </div>
  );
}
