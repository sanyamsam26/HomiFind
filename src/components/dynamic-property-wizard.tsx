import React, { useMemo, useState } from "react";
import type { Property, PropertyType } from "../types/database";
import { ArrowLeft, ArrowRight, CheckCircle2, ImagePlus, Loader2, MapPin, Sparkles } from "lucide-react";

interface Props {
  onClose: () => void;
  onSubmit: (property: Partial<Property>) => Promise<void>;
}

const TYPES: { id: PropertyType; label: string }[] = [
  { id: "apartment", label: "Apartment" },
  { id: "house", label: "House" },
  { id: "private_room", label: "Private Room" },
  { id: "pg", label: "PG" },
  { id: "hostel", label: "Hostel" },
  { id: "studio", label: "Studio" },
  { id: "villa", label: "Villa" },
  { id: "commercial", label: "Commercial" },
];

export function DynamicPropertyWizard({ onClose, onSubmit }: Props) {
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    property_type: "apartment" as PropertyType,
    title: "",
    description: "",
    rent_price: "",
    deposit_amount: "",
    bedrooms: "1",
    bathrooms: "1",
    square_feet: "",
    address_line1: "",
    city: "",
    state: "",
    zip_code: "",
    country: "India",
    is_pet_friendly: false,
    is_furnished: false,
    utilities_included: false,
    primary_image_url: "",
  });

  const update = (key: string, value: string | boolean) => setForm((current) => ({ ...current, [key]: value }));
  const canContinue = useMemo(() => {
    if (step === 1) return Boolean(form.property_type && form.title.trim().length >= 5);
    if (step === 2) return Boolean(Number(form.rent_price) > 0 && Number(form.bedrooms) >= 0 && Number(form.bathrooms) > 0);
    if (step === 3) return Boolean(form.address_line1.trim() && form.city.trim() && form.state.trim());
    return true;
  }, [step, form]);

  const submit = async () => {
    setSaving(true);
    setError(null);
    try {
      await onSubmit({
        property_type: form.property_type,
        title: form.title.trim(),
        description: form.description.trim(),
        rent_price: Number(form.rent_price),
        deposit_amount: Number(form.deposit_amount || 0),
        bedrooms: Number(form.bedrooms),
        bathrooms: Number(form.bathrooms),
        square_feet: form.square_feet ? Number(form.square_feet) : undefined,
        address_line1: form.address_line1.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
        zip_code: form.zip_code.trim(),
        country: form.country.trim() || "India",
        is_pet_friendly: form.is_pet_friendly,
        is_furnished: form.is_furnished,
        utilities_included: form.utilities_included,
        amenities: [],
        primary_image_url: form.primary_image_url.trim() || undefined,
      });
      setStep(5);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to create listing. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="min-h-full flex items-center justify-center">
        <div className="w-full max-w-3xl rounded-3xl bg-white shadow-2xl overflow-hidden">
          <div className="px-6 py-5 border-b flex items-center justify-between">
            <div><p className="text-xs font-semibold text-indigo-600">HOMIFIND • LIST PROPERTY</p><h2 className="text-xl font-bold text-slate-900 mt-1">Create a listing</h2></div>
            <button onClick={onClose} className="text-sm text-slate-500 hover:text-slate-900">Save & exit</button>
          </div>
          {step < 5 && <div className="h-1 bg-slate-100"><div className="h-1 bg-indigo-600 transition-all" style={{ width: `${step * 25}%` }} /></div>}
          <div className="p-6 sm:p-10">
            {step === 1 && <section className="space-y-6">
              <div><h3 className="text-2xl font-bold">Tell us about the property</h3><p className="text-sm text-slate-500 mt-1">Start with the basics. You can refine the listing later.</p></div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">{TYPES.map((type) => <button key={type.id} onClick={() => update("property_type", type.id)} className={`rounded-2xl border p-4 text-left ${form.property_type === type.id ? "border-indigo-600 bg-indigo-50" : "border-slate-200 hover:border-slate-300"}`}><span className="font-semibold text-sm">{type.label}</span></button>)}</div>
              <label className="block text-sm font-medium">Listing title<input value={form.title} onChange={(e) => update("title", e.target.value)} placeholder="e.g. Furnished 2BHK near IT Park" className="mt-2 w-full rounded-xl border px-4 py-3" /></label>
              <label className="block text-sm font-medium">Description<textarea value={form.description} onChange={(e) => update("description", e.target.value)} placeholder="Describe what makes this property attractive..." rows={4} className="mt-2 w-full rounded-xl border px-4 py-3" /></label>
            </section>}
            {step === 2 && <section className="space-y-6">
              <div><h3 className="text-2xl font-bold">Pricing & property details</h3><p className="text-sm text-slate-500 mt-1">These values power search and matching.</p></div>
              <div className="grid md:grid-cols-2 gap-4"><label className="text-sm font-medium">Monthly rent<input type="number" min="1" value={form.rent_price} onChange={(e) => update("rent_price", e.target.value)} placeholder="25000" className="mt-2 w-full rounded-xl border px-4 py-3" /></label><label className="text-sm font-medium">Security deposit<input type="number" min="0" value={form.deposit_amount} onChange={(e) => update("deposit_amount", e.target.value)} placeholder="50000" className="mt-2 w-full rounded-xl border px-4 py-3" /></label><label className="text-sm font-medium">Bedrooms<input type="number" min="0" value={form.bedrooms} onChange={(e) => update("bedrooms", e.target.value)} className="mt-2 w-full rounded-xl border px-4 py-3" /></label><label className="text-sm font-medium">Bathrooms<input type="number" min="0.5" step="0.5" value={form.bathrooms} onChange={(e) => update("bathrooms", e.target.value)} className="mt-2 w-full rounded-xl border px-4 py-3" /></label><label className="text-sm font-medium">Area (sq ft)<input type="number" min="1" value={form.square_feet} onChange={(e) => update("square_feet", e.target.value)} placeholder="1200" className="mt-2 w-full rounded-xl border px-4 py-3" /></label></div>
              <div className="grid md:grid-cols-3 gap-3">{[["is_furnished","Furnished"],["is_pet_friendly","Pet friendly"],["utilities_included","Utilities included"]].map(([key,label]) => <label key={key} className="flex items-center gap-3 rounded-xl border p-4"><input type="checkbox" checked={Boolean(form[key as keyof typeof form])} onChange={(e) => update(key, e.target.checked)} /><span className="text-sm font-medium">{label}</span></label>)}</div>
            </section>}
            {step === 3 && <section className="space-y-6">
              <div><h3 className="text-2xl font-bold flex items-center gap-2"><MapPin className="h-6 w-6 text-indigo-600" /> Where is it?</h3><p className="text-sm text-slate-500 mt-1">A precise location helps HomiFind match nearby renters.</p></div>
              <div className="grid md:grid-cols-2 gap-4"><label className="md:col-span-2 text-sm font-medium">Address<input value={form.address_line1} onChange={(e) => update("address_line1", e.target.value)} placeholder="House / building / street" className="mt-2 w-full rounded-xl border px-4 py-3" /></label><label className="text-sm font-medium">City<input value={form.city} onChange={(e) => update("city", e.target.value)} placeholder="Amritsar" className="mt-2 w-full rounded-xl border px-4 py-3" /></label><label className="text-sm font-medium">State<input value={form.state} onChange={(e) => update("state", e.target.value)} placeholder="Punjab" className="mt-2 w-full rounded-xl border px-4 py-3" /></label><label className="text-sm font-medium">PIN code<input value={form.zip_code} onChange={(e) => update("zip_code", e.target.value)} placeholder="143001" className="mt-2 w-full rounded-xl border px-4 py-3" /></label><label className="text-sm font-medium">Country<input value={form.country} onChange={(e) => update("country", e.target.value)} className="mt-2 w-full rounded-xl border px-4 py-3" /></label></div>
            </section>}
            {step === 4 && <section className="space-y-6">
              <div><h3 className="text-2xl font-bold flex items-center gap-2"><Sparkles className="h-6 w-6 text-indigo-600" /> Add a primary photo</h3><p className="text-sm text-slate-500 mt-1">Paste an image URL for now. Storage upload will be connected next.</p></div>
              <label className="block rounded-2xl border-2 border-dashed p-10 text-center"><ImagePlus className="mx-auto h-8 w-8 text-slate-400" /><span className="block text-sm font-medium mt-3">Primary image URL</span><input value={form.primary_image_url} onChange={(e) => update("primary_image_url", e.target.value)} placeholder="https://..." className="mt-3 w-full rounded-xl border px-4 py-3" /></label>
              <div className="rounded-2xl bg-indigo-50 p-4 text-sm text-indigo-900"><strong>Verification:</strong> Your listing will enter <b>Under review</b> after submission. It won't appear in renter search until approved.</div>
            </section>}
            {step === 5 && <section className="py-12 text-center space-y-4"><CheckCircle2 className="mx-auto h-14 w-14 text-emerald-600" /><h3 className="text-2xl font-bold">Listing submitted for verification</h3><p className="text-sm text-slate-500 max-w-md mx-auto">Your property is saved. Once verification is complete, it can become visible to renters and the matching engine.</p><button onClick={onClose} className="rounded-xl bg-indigo-600 px-5 py-3 text-white font-semibold">Back to properties</button></section>}
          </div>
          {step < 5 && <div className="px-6 py-4 border-t flex items-center justify-between"><button disabled={step === 1 || saving} onClick={() => setStep((s) => s - 1)} className="rounded-xl border px-4 py-2.5 text-sm disabled:opacity-40"><ArrowLeft className="inline h-4 w-4 mr-1" />Back</button>{step < 4 ? <button disabled={!canContinue} onClick={() => setStep((s) => s + 1)} className="rounded-xl bg-indigo-600 px-5 py-2.5 text-white text-sm font-semibold disabled:opacity-40">Continue<ArrowRight className="inline h-4 w-4 ml-1" /></button> : <button disabled={saving} onClick={submit} className="rounded-xl bg-indigo-600 px-5 py-2.5 text-white text-sm font-semibold disabled:opacity-50">{saving ? <><Loader2 className="inline h-4 w-4 mr-1 animate-spin" />Submitting…</> : <><CheckCircle2 className="inline h-4 w-4 mr-1" />Submit for verification</>}</button>}</div>}
          {error && <p className="px-6 pb-5 text-sm text-red-600">{error}</p>}
        </div>
      </div>
    </div>
  );
}
