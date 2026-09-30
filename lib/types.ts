export type TaskStatus = "Pending" | "In Progress" | "Completed";

export type Staff = {
  id: string;
  name: string;
  role: string | null;
};

export type Location = {
  id: string;
  name: string;
  notes: string | null;
};

export type Duty = {
  id: string;
  name: string;
  description: string | null;
};

export type Assignment = {
  id: string;
  date: string;
  staff_id: string;
  location_id: string;
  duty_id: string;
  shift_start: string;
  shift_end: string;
  task_status: TaskStatus;
  remarks: string | null;
  published: boolean;
  staff: Pick<Staff, "name" | "role"> | null;
  locations: Pick<Location, "name"> | null;
  duties: Pick<Duty, "name"> | null;
};

export type AssignmentOptions = {
  staff: Staff[];
  locations: Location[];
  duties: Duty[];
};
