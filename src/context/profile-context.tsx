"use client";

import type { UserProfile } from "@/lib/types";
import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  useMemo,
} from "react";

type ProfileContextType = {
  profile: UserProfile;
  setProfile: (profile: UserProfile) => void;
  isProfileComplete: boolean;
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>({
    name: "Alex Doe",
    skills: "React, TypeScript, Node.js",
    interests: "Artificial Intelligence, Web Development, Design",
    careerPreferences: "Software Engineer, Full-Stack Developer",
  });

  const isProfileComplete = useMemo(() => {
    return !!profile.name && !!profile.skills && !!profile.interests;
  }, [profile]);

  const value = { profile, setProfile, isProfileComplete };

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
}
