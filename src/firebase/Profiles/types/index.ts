import { BestScores, UserSettings } from "../../../context/profile/types";

// Profiles collection から取得したデータ型
export type ProfilesDocument = {
  bestScores: BestScores;
  userSettings: UserSettings;
};
