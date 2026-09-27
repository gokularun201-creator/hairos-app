import React, { useState } from 'react';
import { GUIDE_TOPICS, GuideTopic } from '../data/defaultData';
import { 
  Search, 
  ShieldAlert, 
  ChevronDown, 
  ChevronUp, 
  Stethoscope, 
  Info,
  Calendar,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

export const EducationalGuideScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedTopicId, setExpandedTopicId] = useState<string | null>(GUIDE_TOPICS[0].id);

  const categories = ['All', 'Understanding Hair', 'Scalp Health', 'Ingredients & Care', 'Hair Fiber Care', 'Medical Safety'];

  const filteredTopics = GUIDE_TOPICS.filter((t) => {
    const matchesCat = selectedCategory === 'All' || t.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.details.some((d) => d.toLowerCase().includes(searchQuery.toLowerCase())) ||
      t.keyAdvice.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.sources.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 px-4 app-screen-container max-w-md mx-auto space-y-5 pb-24">
      {/* Top Header */}
      <div className="pt-2">
        <h2 className="text-xl font-black tracking-tight text-white flex items-center space-x-2">
          <span>Care Guide & Education</span>
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Curated, offline evidence-based references for hair and scalp habits.
        </p>
      </div>

      {/* Clear Medical Safety Disclaimer Banner */}
      <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs space-y-1.5">
        <div className="flex items-center space-x-1.5 font-bold text-amber-300">
          <Stethoscope className="w-4 h-4 flex-shrink-0" />
          <span>Educational Reference Only — Not Medical Advice</span>
        </div>
        <p className="text-[11px] leading-relaxed text-amber-200/90">
          This guide runs 100% offline on your device to explain standard scalp biology and gentle care practices. It does not provide clinical diagnoses, medical staging, prescription treatments, or guarantees of hair regrowth. For persistent pain, sudden patchy shedding, or inflammatory conditions, consult a board-certified dermatologist.
        </p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search ingredients, shedding, washing, scalp..."
          className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-teal-400"
        />
      </div>

      {/* Category Filter Chips */}
      <div className="flex space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`py-2 px-3 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? 'bg-teal-500/15 border border-teal-500/40 text-teal-300'
                : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Topic List */}
      <div className="space-y-3">
        {filteredTopics.length === 0 ? (
          <div className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800 text-center space-y-2">
            <Info className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="text-sm font-bold text-slate-300">No matching articles found</p>
            <p className="text-xs text-slate-500">Try searching for keywords like "shedding", "oil", or "wash".</p>
          </div>
        ) : (
          filteredTopics.map((topic) => {
            const isExpanded = expandedTopicId === topic.id;

            return (
              <div
                key={topic.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden transition-colors"
              >
                <div
                  onClick={() => setExpandedTopicId(isExpanded ? null : topic.id)}
                  role="button"
                  tabIndex={0}
                  className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-800/40 transition-colors"
                >
                  <div className="space-y-1.5 pr-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-800 text-teal-400 uppercase tracking-wider">
                        {topic.category}
                      </span>
                      <span className="text-[10px] text-slate-500 flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{topic.reviewedDate}</span>
                      </span>
                    </div>
                    <h3 className="text-sm font-extrabold text-white">{topic.title}</h3>
                    <p className="text-xs text-slate-400 line-clamp-1">{topic.summary}</p>
                  </div>

                  <div className="text-slate-400 flex-shrink-0">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-4 pb-4 pt-1 border-t border-slate-800/80 space-y-3.5 text-xs">
                    <p className="text-slate-300 leading-relaxed">{topic.summary}</p>

                    <div className="space-y-2 bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                      <h4 className="font-bold text-slate-200">Key Evidence & Observations:</h4>
                      <ul className="space-y-1.5 text-slate-400 list-disc list-inside text-[11px] leading-relaxed">
                        {topic.details.map((detail, idx) => (
                          <li key={idx}>{detail}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Practical Takeaway */}
                    <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-300 space-y-0.5">
                      <div className="font-bold text-teal-200 flex items-center space-x-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Practical Guidance:</span>
                      </div>
                      <p className="text-[11px] leading-relaxed">{topic.keyAdvice}</p>
                    </div>

                    {/* Caution */}
                    {topic.caution && (
                      <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 space-y-0.5">
                        <div className="font-bold text-rose-200 flex items-center space-x-1">
                          <ShieldAlert className="w-3.5 h-3.5" />
                          <span>Important Safety Precaution:</span>
                        </div>
                        <p className="text-[11px] leading-relaxed">{topic.caution}</p>
                      </div>
                    )}

                    {/* Credible Sources & Review Stamp */}
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1.5 text-[11px]">
                      <div className="font-bold text-slate-300 flex items-center space-x-1">
                        <ExternalLink className="w-3.5 h-3.5 text-teal-400" />
                        <span>Evidence Sources & Clinical References:</span>
                      </div>
                      <ul className="text-slate-400 space-y-1 list-disc list-inside">
                        {topic.sources.map((src, idx) => (
                          <li key={idx}>{src}</li>
                        ))}
                      </ul>
                      <p className="text-[10px] text-slate-500 pt-1 border-t border-slate-900">
                        Reviewed: {topic.reviewedDate} · {topic.reviewerTitle}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
