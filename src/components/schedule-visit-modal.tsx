import React, { useState } from "react";
import {
  Calendar as CalendarIcon,
  Clock,
  Sun,
  Car,
  CheckCircle2,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowRight,
  MapPin,
  Building
} from "lucide-react";
import { Property } from "../types/database";

interface ScheduleVisitModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property;
  onConfirmVisit: (visitData: { date: string; time: string; property: Property }) => void;
}

export function ScheduleVisitModal({
  isOpen,
  onClose,
  property,
  onConfirmVisit,
}: ScheduleVisitModalProps) {
  const [selectedDate, setSelectedDate] = useState<number>(5);
  const [selectedTime, setSelectedTime] = useState<string>("11:00 AM");
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirmVisit({
      date: `Sat, Oct ${selectedDate}`,
      time: selectedTime,
      property,
    });
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-slate-50 rounded-2xl shadow-2xl overflow-hidden my-auto border border-slate-200">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200">
          <div className="flex items-center space-x-2">
            <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg text-slate-500">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <span className="font-extrabold text-indigo-950 text-base">HomiFind</span>
          </div>
          <span className="text-xs font-medium text-slate-400">Step 2 of 3</span>
        </div>

        {isSuccess ? (
          <div className="p-12 text-center space-y-4">
            <div className="h-16 w-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Visit Scheduled!</h3>
            <p className="text-sm text-slate-600">
              Your guided visit for <span className="font-bold">{property.title}</span> on Sat, Oct {selectedDate} at {selectedTime} is confirmed.
            </p>
          </div>
        ) : (
          <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Left Col: Property Preview Card (3 cols) */}
            <div className="md:col-span-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
              <div className="relative rounded-xl overflow-hidden h-36">
                <img src={property.primary_image_url} alt={property.title} className="w-full h-full object-cover" />
                <span className="absolute top-2 left-2 bg-indigo-900/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-sm">
                  {property.match_score || 96}% AI Match
                </span>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-base">{property.title}</h4>
                <p className="text-xs text-slate-500 flex items-center space-x-1 mt-1">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                  <span>{property.address_line1}, {property.city}</span>
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-1">
                <p className="text-[10px] uppercase font-bold text-slate-400">Estimated Rent</p>
                <p className="text-xl font-black text-indigo-900">${property.rent_price.toLocaleString()}<span className="text-xs text-slate-400 font-normal">/mo</span></p>
              </div>

              <div className="p-3 bg-indigo-50/50 rounded-xl text-xs flex items-center space-x-2 text-indigo-900 font-semibold">
                <Building className="h-4 w-4 text-indigo-600 shrink-0" />
                <span>22 mins to Office</span>
              </div>
            </div>

            {/* Center Col: Calendar & Time Slots (5 cols) */}
            <div className="md:col-span-5 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">Select a Date & Time</h3>
                <p className="text-xs text-slate-500 mt-0.5">Choose a slot to view AI insights for your visit.</p>
              </div>

              {/* Month Picker Header */}
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-sm">October 2026</span>
                <div className="flex items-center space-x-1">
                  <button className="p-1 hover:bg-slate-100 rounded-lg text-slate-500"><ChevronLeft className="h-4 w-4" /></button>
                  <button className="p-1 hover:bg-slate-100 rounded-lg text-slate-500"><ChevronRight className="h-4 w-4" /></button>
                </div>
              </div>

              {/* Date Grid */}
              <div className="grid grid-cols-7 gap-1.5 text-center text-xs">
                {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((d, i) => (
                  <span key={i} className="text-[10px] font-bold text-slate-400 py-1">{d}</span>
                ))}
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((day) => {
                  const isSelected = selectedDate === day;
                  return (
                    <button
                      key={day}
                      onClick={() => setSelectedDate(day)}
                      className={`h-10 rounded-xl font-bold transition flex flex-col items-center justify-center ${
                        isSelected
                          ? "bg-indigo-900 text-white shadow-md"
                          : "hover:bg-slate-100 text-slate-700"
                      }`}
                    >
                      <span>{day}</span>
                    </button>
                  );
                })}
              </div>

              {/* Time Slots */}
              <div className="space-y-3 pt-2">
                <p className="font-bold text-slate-900 text-xs">Saturday, Oct {selectedDate}</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    "09:00 AM",
                    "10:00 AM",
                    "11:00 AM",
                    "01:30 PM",
                    "03:00 PM",
                    "04:30 PM",
                  ].map((t) => {
                    const isSelected = selectedTime === t;
                    const isRecommended = t === "11:00 AM";
                    return (
                      <button
                        key={t}
                        onClick={() => setSelectedTime(t)}
                        className={`relative py-3 px-3 rounded-xl font-bold transition text-left border ${
                          isSelected
                            ? "bg-indigo-900 text-white border-indigo-900 shadow"
                            : "bg-white hover:border-slate-300 text-slate-800 border-slate-200"
                        }`}
                      >
                        {isRecommended && (
                          <span className="absolute -top-2 right-2 bg-amber-400 text-slate-900 text-[9px] font-black px-1.5 py-0.5 rounded-md shadow-xs">
                            AI Recommended
                          </span>
                        )}
                        <span>{t}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Col: Visit Assistant Insights (4 cols) */}
            <div className="md:col-span-4 space-y-4">
              {/* Blue Assistant Card */}
              <div className="bg-gradient-to-br from-indigo-950 to-indigo-900 text-white p-6 rounded-2xl shadow-lg space-y-4">
                <h4 className="font-extrabold text-base text-white tracking-wide">Visit Assistant</h4>

                <p className="text-xs text-indigo-100 leading-relaxed bg-indigo-900/60 p-3.5 rounded-xl border border-indigo-700/50">
                  <span className="font-bold text-amber-300">{selectedTime}</span> is the optimal time to visit this property. The south-facing living room receives peak natural light, and the current owner has confirmed availability for a guided walkthrough.
                </p>

                <div className="space-y-2 text-xs text-indigo-100 pt-2 border-t border-indigo-800/80">
                  <div className="flex items-center space-x-2">
                    <Sun className="h-4 w-4 text-amber-400 shrink-0" />
                    <div>
                      <p className="text-[10px] text-indigo-300 font-semibold uppercase">Weather & Light</p>
                      <p className="font-bold">Sunny, 72°F — Optimal Sunlight</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Car className="h-4 w-4 text-emerald-400 shrink-0" />
                    <div>
                      <p className="text-[10px] text-indigo-300 font-semibold uppercase">Traffic Outlook</p>
                      <p className="font-bold">Light traffic expected</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-indigo-300 shrink-0" />
                    <div>
                      <p className="text-[10px] text-indigo-300 font-semibold uppercase">Duration</p>
                      <p className="font-bold">Approx. 30 mins</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Selected Summary Card & Action Button */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Selected Slot</p>
                  <p className="text-base font-extrabold text-slate-900 mt-0.5">
                    Sat, Oct {selectedDate} at {selectedTime}
                  </p>
                </div>

                <button
                  onClick={handleConfirm}
                  className="w-full py-3.5 bg-indigo-900 hover:bg-indigo-950 text-white font-bold rounded-xl text-xs shadow-md transition flex items-center justify-center space-x-2"
                >
                  <span>Confirm Visit</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
