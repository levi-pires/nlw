export type Proffy = {
  name: string;
  avatar: string;
  whats: string;
  bio: string;
  subject: string;
  cost: string;
  weekday: string[];
  time_from: string[];
  time_to: string[];
};

export type ProffyQuery = {
  id: number;
  name: string;
  avatar: string;
  whats: string;
  bio: string;
};

export type ClassQuery = {
  id: number;
  subject: string;
  cost: string;
  proffy_id: string;
};

export type ScheduleQuery = {
  id: number;
  class_id: number;
  weekday: string;
  time_from: number;
  time_to: number;
};
