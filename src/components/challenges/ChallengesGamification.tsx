"use client";

import React, { useState } from "react";
import { Challenge, Badge, UserProfile } from "@/types";
import {
  Trophy,
  Flame,
  Award,
  Sparkles,
  CheckCircle2,
  Lock,
  ChevronRight,
  Shield,
  Zap,
} from "lucide-react";
import confetti from "canvas-confetti";

interface ChallengesGamificationProps {
  user: UserProfile;
  challenges: Challenge[];
  badges: Badge[];
}

export const ChallengesGamification: React.FC<ChallengesGamificationProps> = ({
  user,
  challenges: initialChallenges,
  badges,
}) => {
  const [challenges, setChallenges] = useState<Challenge[]>(initialChallenges);
  const [points, setPoints] = useState(user.points);

  const handleClaimReward = (id: string, rewardPts: number) => {
    try {
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#FFD700", "#00E073", "#00C7BE"],
      });
    } catch {}

    setPoints((prev) => prev + rewardPts);
    setChallenges((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isCompleted: true } : c))
    );
  };

  return (
    <div className="space-y-6">
      {/* Gamification Level & Streak Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 relative overflow-hidden bg-gradient-to-r from-slate-900 via-emerald-950/20 to-slate-900">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 p-0.5 shadow-xl shadow-amber-500/20">
              <div className="w-full h-full rounded-2xl bg-slate-950 flex flex-col items-center justify-center text-center">
                <Trophy className="w-7 h-7 text-amber-400" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white">Level 4: Metabolic Athlete</h2>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 font-bold">
                  Tier III
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                You have earned <strong className="text-amber-400 font-mono">{points} FitPoints</strong>. Next level at 500 pts.
              </p>
            </div>
          </div>

          {/* Streak Counter */}
          <div className="flex items-center gap-3 bg-slate-900/80 border border-slate-800 px-5 py-3 rounded-2xl">
            <div className="p-2.5 rounded-xl bg-orange-500/20 text-orange-400">
              <Flame className="w-6 h-6 fill-orange-400 animate-pulse" />
            </div>
            <div>
              <div className="text-2xl font-black text-white font-mono leading-none">
                {user.currentStreak} Days
              </div>
              <span className="text-[10px] text-orange-400 font-semibold uppercase tracking-wider">
                Active Habit Streak
              </span>
            </div>
          </div>
        </div>

        {/* Level Progress Bar */}
        <div className="mt-5 relative z-10">
          <div className="flex justify-between text-[11px] text-slate-400 mb-1.5 font-mono">
            <span>Level 4 (400 pts)</span>
            <span>{points} / 500 pts</span>
          </div>
          <div className="w-full bg-slate-800/80 h-2.5 rounded-full overflow-hidden p-0.5">
            <div
              className="bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300 h-full rounded-full transition-all duration-700 shadow-md shadow-amber-500/30"
              style={{ width: `${Math.min(100, ((points - 400) / 100) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Challenges Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-fitness-green/10 text-fitness-green">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Active Fitness & Nutrition Challenges</h3>
              <p className="text-xs text-muted-foreground">Complete milestones to unlock badges and multiplier points</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {challenges.map((challenge) => {
            const isDone = challenge.completedDays >= challenge.targetDays;
            const progressPct = Math.min(
              100,
              Math.round((challenge.completedDays / challenge.targetDays) * 100)
            );

            return (
              <div
                key={challenge.id}
                className="glass-panel p-5 rounded-3xl border border-slate-800 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all"
              >
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-bold border border-slate-700 uppercase">
                      {challenge.category}
                    </span>
                    <span className="text-xs font-bold text-amber-400 font-mono">
                      +{challenge.rewardPoints} pts
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white">{challenge.title}</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {challenge.description}
                  </p>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-slate-400">
                      Day {challenge.completedDays} of {challenge.targetDays}
                    </span>
                    <span className="text-fitness-green font-bold">{progressPct}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-fitness-green to-emerald-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>

                  <div className="pt-2 flex justify-end">
                    {challenge.isCompleted ? (
                      <span className="flex items-center gap-1.5 text-xs text-fitness-green font-bold">
                        <CheckCircle2 className="w-4 h-4" />
                        Completed & Claimed
                      </span>
                    ) : isDone ? (
                      <button
                        onClick={() => handleClaimReward(challenge.id, challenge.rewardPoints)}
                        className="px-4 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition-all active:scale-95 shadow-md shadow-amber-400/30"
                      >
                        Claim +{challenge.rewardPoints} Points!
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-500">In Progress</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Badges Showcase */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Earned Badges & Medals</h3>
              <p className="text-xs text-muted-foreground">{badges.length} badges unlocked</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {badges.map((b) => (
            <div
              key={b.id}
              className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-center flex flex-col items-center space-y-2 hover:border-slate-700 transition-all group"
            >
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                <Award className="w-6 h-6" />
              </div>
              <h5 className="text-xs font-bold text-white">{b.name}</h5>
              <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">
                {b.description}
              </p>
              {b.unlockedAt && (
                <span className="text-[9px] text-emerald-400 font-mono">
                  Unlocked: {b.unlockedAt}
                </span>
              )}
            </div>
          ))}

          {/* Locked Badge Teaser */}
          <div className="p-4 rounded-2xl bg-slate-900/30 border border-dashed border-slate-800 text-center flex flex-col items-center space-y-2 opacity-50">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-500">
              <Lock className="w-5 h-5" />
            </div>
            <h5 className="text-xs font-bold text-slate-400">Century Club</h5>
            <p className="text-[10px] text-slate-500">Log 100 consecutive meals</p>
          </div>
        </div>
      </div>
    </div>
  );
};
