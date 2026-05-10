import React from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Calendar, ChevronRight, Plus } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { WeeklyPlanService, WEEK_DAYS } from '../services/weekly-plan.service';

const DAY_COLORS = [
  '#FF6B00',
  '#E83F6F',
  '#00C853',
  '#0091FF',
  '#FFD600',
  '#8B5CF6',
  '#F43F5E',
];

export function WeeklyPlanScreen() {
  const navigate = useNavigate();
  const { weeklyPlan, updateWeeklyPlan } = useData();

  const todayName = WeeklyPlanService.getTodayName();
  const plannedCount = WeeklyPlanService.countPlannedDays(weeklyPlan);

  return (
    <div className="min-h-full pb-24 bg-[#FFF8F0]">

      {/* HEADER */}
      <div className="p-5 flex items-center gap-4 border-b-4 bg-white">

        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 border-2 border-black flex items-center justify-center"
        >
          <ArrowLeft size={18} />
        </button>

        <div className="flex items-center gap-2">
          <Calendar size={18} />
          <h1 className="text-xl font-bold">Haftalık Plan</h1>
        </div>

        <div className="ml-auto bg-orange-500 text-white px-2 py-1 text-xs font-bold">
          {plannedCount}/7
        </div>
      </div>

      {/* PROGRESS */}
      <div className="mx-5 mt-4 h-3 border-2 border-black bg-white overflow-hidden">
        <div
          className="h-full bg-orange-500"
          style={{ width: `${(plannedCount / 7) * 100}%` }}
        />
      </div>

      <p className="text-center text-xs font-bold mt-2">
        {plannedCount === 0
          ? 'Henüz plan yok'
          : `${plannedCount} gün planlandı`}
      </p>

      {/* DAYS */}
      <div className="p-5 space-y-3">

        {WEEK_DAYS.map((day, idx) => {
          const isPlanned = !!weeklyPlan[day];
          const isToday = day === todayName;
          const color = DAY_COLORS[idx];

          return (
            <div
              key={day}
              onClick={() => !isPlanned && navigate('/')}
              className={`bg-white border-2 border-black p-3 flex justify-between items-center ${
                isToday ? 'ring-2 ring-orange-500' : ''
              }`}
            >

              <div className="flex items-center gap-3">

                <div
                  className="w-2 h-10 border border-black"
                  style={{ backgroundColor: color }}
                />

                <div>
                  <div className="text-[10px] font-bold opacity-50">
                    {day} {isToday && '(Bugün)'}
                  </div>

                  {isPlanned ? (
                    <div className="font-bold">
                      {weeklyPlan[day]?.recipeTitle}
                    </div>
                  ) : (
                    <div className="text-sm opacity-40 italic">
                      Ne pişiriyoruz?
                    </div>
                  )}
                </div>

              </div>

              {isPlanned ? (
                <div className="flex gap-2">

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/recipe/${weeklyPlan[day]?.recipeId}`);
                    }}
                    className="border-2 border-black px-2"
                  >
                    <ChevronRight size={16} />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      updateWeeklyPlan(day, null);
                    }}
                    className="border-2 border-red-500 text-red-500 px-2"
                  >
                    ×
                  </button>

                </div>
              ) : (
                <button className="border-2 border-dashed border-black px-2">
                  <Plus size={16} />
                </button>
              )}

            </div>
          );
        })}

      </div>

      {/* RESET */}
      {plannedCount > 0 && (
        <div className="px-5">
          <button
            onClick={() => {
              if (confirm('Plan silinsin mi?')) {
                WEEK_DAYS.forEach(day => updateWeeklyPlan(day, null));
              }
            }}
            className="w-full border-2 border-red-500 text-red-500 py-2 font-bold"
          >
            Planı Temizle
          </button>
        </div>
      )}

    </div>
  );
}