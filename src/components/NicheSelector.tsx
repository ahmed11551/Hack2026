import React, { useState } from "react";
import { PresetNiche } from "../types";
import { Sparkles, ArrowRight, TrendingUp } from "lucide-react";

interface NicheSelectorProps {
  presets: PresetNiche[];
  onSelectPreset: (preset: PresetNiche) => void;
  onAnalyzeCustom: (customIdea: string, targetEarning: string) => void;
  loading: boolean;
  selectedId?: string;
}

export default function NicheSelector({
  presets,
  onSelectPreset,
  onAnalyzeCustom,
  loading,
  selectedId
}: NicheSelectorProps) {
  const [customIdea, setCustomIdea] = useState("");
  const [targetEarning, setTargetEarning] = useState("500,000 руб — Бизнес-проект");

  const EARNING_OPTIONS = [
    { value: "100,000 руб — Легкий старт", label: "100K ₽/МЕС", desc: "Быстрый легкий старт" },
    { value: "500,000 руб — Бизнес-проект", label: "500K ₽/МЕС", desc: "Серьезный медиа-проект" },
    { value: "1,000,000 руб — Масштаб", label: "1M ₽/МЕС", desc: "Сверхвысокий уровень" }
  ];

  return (
    <div className="space-y-8">
      {/* Quick Curated Presets Panel */}
      <div className="border-t border-white/20 pt-4">
        <h3 className="text-[#C1FF00] text-xs font-bold uppercase mb-4 tracking-widest underline decoration-2 underline-offset-4 italic flex items-center gap-2">
          <TrendingUp className="w-3.5 h-3.5 text-[#C1FF00]" />
          I. Выберите вирусный концепт
        </h3>
        <p className="text-xs text-white/60 mb-4 leading-relaxed font-sans font-light">
          Эти концепции обладают непревзойденным фактором притяжения внимания в СНГ и готовы к мгновенной монетизации.
        </p>
        
        <div className="grid grid-cols-1 gap-3">
          {presets.map((preset) => {
            const isSelected = selectedId === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => onSelectPreset(preset)}
                id={`preset-${preset.id}`}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-300 relative group ${
                  isSelected 
                    ? "bg-[#161616] border-[#C1FF00] shadow-md shadow-[#C1FF00]/10" 
                    : "bg-[#111] border-white/10 hover:border-white/30 hover:bg-[#151515]"
                }`}
              >
                {/* Visual indicator corner */}
                {isSelected && (
                  <div className="absolute top-0 right-0 bg-[#C1FF00] text-black text-[9px] font-black px-2 py-0.5 rounded-tr-xl rounded-bl-lg uppercase tracking-wide">
                    АКТИВЕН
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <span className="text-2xl p-2 rounded-lg bg-black border border-white/10 font-sans select-none">
                    {preset.emoji}
                  </span>
                  <div className="space-y-1 pr-10">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <h4 className="font-extrabold text-white text-sm tracking-tight uppercase group-hover:text-[#C1FF00] transition-colors">
                        {preset.title}
                      </h4>
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/10 text-[#C1FF00]">
                        {preset.targetEarning}
                      </span>
                    </div>
                    <p className="text-[11px] text-white/50 line-clamp-2 leading-relaxed font-sans">
                      {preset.tagline}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Idea Creator AI Workspace */}
      <div className="border-t border-white/20 pt-4 space-y-4">
        <h3 className="text-[#C1FF00] text-xs font-bold uppercase tracking-widest underline decoration-2 underline-offset-4 italic flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5" />
          II. Или сгенерируйте свой через AI
        </h3>

        <p className="text-xs text-white/60 leading-relaxed font-light">
          Вбейте свою задумку, и искусственный интеллект рассчитает бизнес-модель, найдет вирусный триггер и распишет посты:
        </p>

        <div className="space-y-4 bg-[#111] p-4 border border-white/10 rounded-xl">
          <div>
            <label className="block text-[10px] font-bold text-white/40 mb-1.5 uppercase tracking-wider font-mono">
              Суть вашей задумки
            </label>
            <textarea
              id="custom-idea-input"
              value={customIdea}
              onChange={(e) => setCustomIdea(e.target.value)}
              placeholder="Пример: Секретные места моего города с историческими байками, или Как уйти на удаленку..."
              className="w-full text-xs text-white placeholder-white/20 bg-black border border-white/10 rounded-lg p-3 focus:outline-none focus:border-[#C1FF00] focus:ring-1 focus:ring-[#C1FF00]/30 transition duration-200 resize-none h-20 font-sans"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-white/40 mb-1.5 uppercase tracking-wider font-mono">
              Ориентир прибыли
            </label>
            <div className="grid grid-cols-1 gap-2">
              {EARNING_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setTargetEarning(opt.value)}
                  className={`p-2.5 rounded-lg text-left border transition-all flex justify-between items-center ${
                    targetEarning === opt.value
                      ? "border-[#C1FF00] bg-[#C1FF00]/5"
                      : "border-white/5 bg-black opacity-70 hover:opacity-100 hover:border-white/20"
                  }`}
                >
                  <div className="text-left">
                    <span className="block font-bold text-white text-xs tracking-wide">
                      {opt.label}
                    </span>
                    <span className="block text-[9px] text-white/40 leading-none mt-0.5 font-sans">
                      {opt.desc}
                    </span>
                  </div>
                  {targetEarning === opt.value && (
                    <div className="w-2 h-2 rounded-full bg-[#C1FF00]" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <button
            id="analyze-btn"
            onClick={() => onAnalyzeCustom(customIdea, targetEarning)}
            disabled={loading || !customIdea.trim()}
            className="w-full py-3 px-4 rounded-lg bg-[#C1FF00] hover:bg-[#b5ee00] text-black font-black uppercase text-xs transition-all duration-300 disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center gap-2 shadow-lg"
          >
            {loading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                <span>АНАЛИЗ РЫНКА...</span>
              </>
            ) : (
              <>
                <span>ЗАПУСТИТЬ АНАЛИЗАТОР ИИ</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
