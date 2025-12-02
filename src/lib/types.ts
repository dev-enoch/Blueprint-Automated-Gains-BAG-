export interface User {
  id: string; // This will be the Firebase Auth UID
  email: string | null;
  role: 'user' | 'admin';
  lastLogin?: string; // This might be tracked on login
  active?: boolean; // Can be managed in your user data
}

export interface UserProgress {
  [topicId: string]: boolean;
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  videoId: string;
}

export interface Module {
  id:string;
  title: string;
  topics: Topic[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  modules: Module[];
}

// Represents the user profile document stored in Firestore
export interface UserProfile {
    email: string;
    role: 'user' | 'admin';
    createdAt: any; // Firestore.FieldValue
}
