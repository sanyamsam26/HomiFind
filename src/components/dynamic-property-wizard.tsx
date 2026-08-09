import React, { useMemo, useRef, useState } from "react";
import type { Property, PropertyType } from "../types/database";
import { ArrowLeft, ArrowRight, CheckCircle2, ImagePlus, Loader2, MapPin, Sparkles, X } from "lucide-react";
import { uploadPropertyImage } from "../services/property-media-service";

interface Props {
  onClose: () => void;
  onSubmit: (property: Partial<Property>) => Promise<Property>;
}

const TYPES: { id: PropertyType; label: string }[] = [
  { id: "apartment", label: "Apartment" }, { id: "house", label: "House" },
  { id: "private_room", label: "Private Room" }, { id: "pg", label: "PG" },
  { id: "hostel", label: "Hostel" }, { id: "studio", label: "Studio" },
  { id: "villa", label: "Villa" }, { id: "commercial", label: "Commercial" },
];

type Photo = { file: File; preview: string };

export function DynamicPropertyWizard({ onClose, onSubmit }: Props) {
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    property_type: "apartment" as PropertyType, title: "", description: "", rent_price: "", deposit_amount: "",
    bedrooms: "1", bathrooms: "1", square_feet: "", address_line1: "", city: "", state: "", zip_code: "", country: "India",
    is_pet_friendly: false, is_furnished: false, utilities_included: false,
  });
  const update = (key: keyof typeof form, value: string | boolean) => setForm((c) => ({ ...c, [key]: value }));
  const canContinue = useMemo(() => {
    if (step === 1) return form.title.trim().length >= 5 && Boolean(form.property_type);
    if (step === 2) return Number(form.rent_price) > 0 && Number(form.bathrooms) > 0;
    if (step === 3) return Boolean(form.address_line1.trim() && form.city.trim() && form.state.trim());
    return photos.length > 0;
  }, [step, form, photos.length]);

  const addPhotos = (files: FileList | null) => {
    if (!files) return;
    const valid = Array.from(files).filter((file) => file.type.startsWith("image/") && file.size <= 10 * 1024 * 1024);
    setPhotos((current) => [...current, ...valid].slice(0, 12).map((file) => ({ file, preview: URL.createObjectURL(file) })));
  };
  const removePhoto = (index: number) => setPhotos((current) => current.filter((_, i) => i !== index));

  const submit = async () => {
    setSaving(true); setError(null);
    try {
      const property = await onSubmit({
        property_type: form.property_type, title: form.title.trim(), description: form.description.trim(),
        rent_price: Number(form.rent_price), deposit_amount: Number(form.deposit_amount || 0), bedrooms: Number(form.bedrooms),
        bathrooms: Number(form.bathrooms), square_feet: form.square_feet ? Number(form.square_feet) : undefined,
        address_line1: form.address_line1.trim(), city: form.city.trim(), state: form.state.trim(), zip_code: form.zip_code.trim(),
        country: form.country.trim() || "India", is_pet_friendly: form.is_pet_friendly, is_furnished: form.is_furnished,
        utilities_included: form.utilities_included, amenities: [],
      });
      for (let i = 0; i < photos.length; i++) await uploadPropertyImage(property.id, photos[i].file, { primary: i === 0, displayOrder: i });
      setStep(5);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to create listing. Please try again.");
    } finally { setSaving(false); }
  };

  const input = "mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";
  return <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm p-4 overflow-y-auto"><div className="min-h-full flex items-center justify-center"><div className="w-full max-w-3xl rounded-3xl bg-white shadow-2xl overflow-hidden">
    <header className="px-6 py-5 border-b flex items-center justify-between"><div><p className="text-xs font-semibold text-indigo-600">HOMIFIND • LIST PROPERTY</p><h2 className="text-xl font-bold text-slate-900 mt-1">Create a listing</h2></div><button onClick={onClose} className="text-sm text-slate-500">Save & exit</button></header>
    {step < 5 && <div className="h-1 bg-slate-100"><div className="h-1 bg-indigo-600 transition-all" style={{ width: `${step * 25}%` }} /></div>}
    <main className="p-6 sm:p-10">
      {step === 1 && <section className="space-y-6"><div><h3 className="text-2xl font-bold">Tell us about the property</h3><p className="text-sm text-slate-500 mt-1">Start with the basics.</p></div><div className="grid grid-cols-2 md:grid-cols-4 gap-3">{TYPES.map((t) => <button key={t.id} onClick={() => update("property_type", t.id)} className={`rounded-2xl border p-4 text-left ${form.property_type === t.id ? "border-indigo-600 bg-indigo-50" : "border-slate-200"}`}><span className="font-semibold text-sm">{t.label}</span></button>)}</div><label className="block text-sm font-medium">Listing title<input className={input} value={form.title} onChange={(e) => update("title", e.target.value)} placeholder="e.g. Furnished 2BHK near IT Park" /></label><label className="block text-sm font-medium">Description<textarea className={input} rows={4} value={form.description} onChange={(e) => update("description", e.target.value)} placeholder="Describe the property..." /></label></section>}
      {step === 2 && <section className="space-y-6"><div><h3 className="text-2xl font-bold">Pricing & details</h3><p className="text-sm text-slate-500 mt-1">These values power search and matching.</p></div><div className="grid md:grid-cols-2 gap-4">{[["rent_price","Monthly rent","25000"],["deposit_amount","Security deposit","50000"],["bedrooms","Bedrooms","2"],["bathrooms","Bathrooms","2"],["square_feet","Area (sq ft)","1200"]].map(([key,label,placeholder]) => <label key={key} className="text-sm font-medium">{label}<input type="number" min="0" className={input} value={String(form[key as keyof typeof form])} onChange={(e) => update(key as keyof typeof form, e.target.value)} placeholder={placeholder} /></label>)}</div><div className="grid md:grid-cols-3 gap-3">{[["is_furnished","Furnished"],["is_pet_friendly","Pet friendly"],["utilities_included","Utilities included"]].map(([key,label]) => <label key={key} className="flex items-center gap-3 rounded-xl border p-4"><input type="checkbox" checked={Boolean(form[key as keyof typeof form])} onChange={(e) => update(key as keyof typeof form, e.target.checked)} /><span className="text-sm font-medium">{label}</span></label>)}</div></section>}
      {step === 3 && <section className="space-y-6"><div><h3 className="text-2xl font-bold flex items-center gap-2"><MapPin className="h-6 w-6 text-indigo-600" /> Where is it?</h3><p className="text-sm text-slate-500 mt-1">Location improves matching.</p></div><div className="grid md:grid-cols-2 gap-4">{[["address_line1","Address","House / building / street"],["city","City","Amritsar"],["state","State","Punjab"],["zip_code","PIN code","143001"],["country","Country","India"]].map(([key,label,placeholder], i) => <label key={key} className={i === 0 ? "md:col-span-2 text-sm font-medium" : "text-sm font-medium"}>{label}<input className={input} value={String(form[key as keyof typeof form])} onChange={(e) => update(key as keyof typeof form, e.target.value)} placeholder={placeholder} /></label>)}</div></section>}
      {step === 4 && <section className="space-y-6"><div><h3 className="text-2xl font-bold flex items-center gap-2"><ImagePlus className="h-6 w-6 text-indigo-600" /> Property photos</h3><p className="text-sm text-slate-500 mt-1">Upload up to 12 images. The first image becomes the cover.</p></div><input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => addPhotos(e.target.files)} /><button onClick={() => inputRef.current?.click()} className="w-full rounded-2xl border-2 border-dashed border-slate-300 p-10 text-center hover:border-indigo-400 hover:bg-indigo-50/30"><ImagePlus className="mx-auto h-9 w-9 text-slate-400" /><span className="block mt-3 font-semibold">Choose photos</span><span className="block text-xs text-slate-500 mt-1">JPG, PNG or WEBP • max 10 MB each</span></button>{photos.length > 0 && <div className="grid grid-cols-2 md:grid-cols-4 gap-3">{photos.map((p,i) => <div key={`${p.file.name}-${i}`} className="relative aspect-square rounded-xl overflow-hidden bg-slate-100"><img src={p.preview} alt={`Property ${i+1}`} className="h-full w-full object-cover" /><button onClick={() => removePhoto(i)} className="absolute top-2 right-2 rounded-full bg-white/90 p-1"><X className="h-4 w-4" /></button>{i === 0 && <span className="absolute bottom-2 left-2 rounded-full bg-slate-900/80 text-white px-2 py-1 text-[10px]">Cover</span>}</div>)}</div>}<div className="rounded-2xl bg-indigo-50 p-4 text-sm text-indigo-900"><strong>Verification:</strong> The listing is created as <b>Under review</b> and will not appear in renter search until approved.</div></section>}
      {step === 5 && <section className="py-12 text-center space-y-4"><CheckCircle2 className="mx-auto h-14 w-14 text-emerald-600" /><h3 className="text-2xl font-bold">Listing submitted</h3><p className="text-sm text-slate-500 max-w-md mx-auto">Your property and photos are saved. Verification can now review the listing.</p><button onClick={onClose} className="rounded-xl bg-indigo-600 px-5 py-3 text-white font-semibold">Back to properties</button></section>}
    </main>
    {step < 5 && <footer className="px-6 py-4 border-t flex justify-between"><button disabled={step === 1 || saving} onClick={() => setStep((s) => s - 1)} className="rounded-xl border px-4 py-2.5 text-sm"><ArrowLeft className="inline h-4 w-4 mr-1" />Back</button>{step < 4 ? <button disabled={!canContinue} onClick={() => setStep((s) => s + 1)} className="rounded-xl bg-indigo-600 px-5 py-2.5 text-white text-sm font-semibold disabled:opacity-40">Continue<ArrowRight className="inline h-4 w-4 ml-1" /></button> : <button disabled={!canContinue || saving} onClick={submit} className="rounded-xl bg-indigo-600 px-5 py-2.5 text-white text-sm font-semibold disabled:opacity-50">{saving ? <><Loader2 className="inline h-4 w-4 mr-1 animate-spin" />Uploading…</> : <><Sparkles className="inline h-4 w-4 mr-1" />Create & submit</>}</button>}</footer>}
    {error && <p className="px-6 pb-5 text-sm text-red-600">{error}</p>}
  </div></div></div>;
}
