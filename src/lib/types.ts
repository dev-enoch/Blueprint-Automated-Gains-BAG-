export interface User {
  id: string;
  email: string;
  password?: string;
  role: 'user' | 'admin';
  lastLogin: string;
  active: boolean;
}

export interface UserProgress {
  [topicId: string]: boolean;
}

export interface Topic {
  id: string;
  title: string;
  content: string;
}

export interface Module {
  id: string;
  title: string;
  topics: Topic[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  modules: Module[];
}
