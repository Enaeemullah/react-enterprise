import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./auth-context";

interface UserProfile {
  id: string;
  bio?: string;
  location?: string;
  phoneNumber?: string;
  department?: string;
  position?: string;
  joinDate?: string;
  preferences?: {
    notifications: boolean;
    emailUpdates: boolean;
    dashboardView: "grid" | "list";
  };
}

interface ProfileContextType {
  profile: UserProfile | null;
  isLoading: boolean;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  updatePreferences: (preferences: Partial<UserProfile["preferences"]>) => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

// Mock profile data
const MOCK_PROFILES: Record<string, UserProfile> = {
  "1": {
    id: "1",
    bio: "Enterprise admin with 5+ years of experience",
    location: "New York, NY",
    phoneNumber: "555-123-4567",
    department: "IT",
    position: "System Administrator",
    joinDate: "2022-01-15",
    preferences: {
      notifications: true,
      emailUpdates: false,
      dashboardView: "grid",
    },
  },
};

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setProfile(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      // Get profile from mock data or create a default one
      const userProfile = MOCK_PROFILES[user.id] || {
        id: user.id,
        preferences: {
          notifications: true,
          emailUpdates: true,
          dashboardView: "grid",
        },
      };
      
      setProfile(userProfile);
      setIsLoading(false);
    };

    fetchProfile();
  }, [user]);

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!profile) return;
    
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    const updatedProfile = { ...profile, ...data };
    
    // In a real app, you would make an API call to update the profile
    setProfile(updatedProfile);
    
    // Update mock data for persistence during the session
    if (user) {
      MOCK_PROFILES[user.id] = updatedProfile;
    }
    
    setIsLoading(false);
  };

  const updatePreferences = async (preferences: Partial<UserProfile["preferences"]>) => {
    if (!profile || !profile.preferences) return;
    
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const updatedProfile = {
      ...profile,
      preferences: {
        ...profile.preferences,
        ...preferences,
      },
    };
    
    // In a real app, you would make an API call to update the preferences
    setProfile(updatedProfile);
    
    // Update mock data for persistence during the session
    if (user) {
      MOCK_PROFILES[user.id] = updatedProfile;
    }
    
    setIsLoading(false);
  };

  return (
    <ProfileContext.Provider
      value={{
        profile,
        isLoading,
        updateProfile,
        updatePreferences,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
}