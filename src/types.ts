export interface PresetNiche {
  id: string;
  title: string;
  emoji: string;
  tagline: string;
  unrealFactor: string;
  monetization: string;
  targetEarning: string;
}

export interface DayPlan {
  day: number;
  topic: string;
}

export interface FinancialModel {
  requiredSubscribers: string;
  earningBreakdown: string;
  timeToLaunch: string;
}

export interface NicheAnalysis {
  title: string;
  tagline: string;
  unrealFactor: string;
  targetAudience: string;
  monetizationBlueprint: string[];
  financialModel: FinancialModel;
  contentStrategy: string;
  sevenDayPlanOutline: DayPlan[];
}

export interface PostDetail {
  postTitle: string;
  postText: string;
  imagePrompt: string;
  ctaText: string;
}
