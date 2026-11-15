export type ApplicationStatus = 'submitted' | 'reviewing' | 'accepted' | 'rejected';

export type ProfileRow = {
  id: string;
  full_name: string;
  college: string;
  department: string;
  year_of_study: string;
  bio: string;
  skills: string[];
  soft_skills: string[];
  interests: string[];
  languages: string[];
  github: string;
  linkedin: string;
  portfolio: string;
  availability: 'Available' | 'Busy' | 'Open to discuss';
  avatar: string;
  role: 'student' | 'admin';
  created_at: string;
  updated_at: string;
};

export type OpportunityRow = {
  id: string;
  title: string;
  organization: string;
  description: string;
  category: string;
  eligibility: string;
  deadline: string | null;
  location: string;
  application_link: string;
  is_published: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type ApplicationRow = {
  id: string;
  opportunity_id: string;
  student_id: string;
  cover_letter: string;
  status: ApplicationStatus;
  created_at: string;
  updated_at: string;
};

type Table<Row, Insert, Update> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      profiles: Table<
        ProfileRow,
        Omit<ProfileRow, 'created_at' | 'updated_at'> & Partial<Pick<ProfileRow, 'created_at' | 'updated_at'>>,
        Partial<Omit<ProfileRow, 'id' | 'created_at' | 'updated_at'>>
      >;
      opportunities: Table<
        OpportunityRow,
        Omit<OpportunityRow, 'id' | 'created_at' | 'updated_at'> & Partial<Pick<OpportunityRow, 'id' | 'created_at' | 'updated_at'>>,
        Partial<Omit<OpportunityRow, 'id' | 'created_at' | 'updated_at'>>
      >;
      applications: Table<
        ApplicationRow,
        Omit<ApplicationRow, 'id' | 'created_at' | 'updated_at'> & Partial<Pick<ApplicationRow, 'id' | 'created_at' | 'updated_at'>>,
        Partial<Omit<ApplicationRow, 'id' | 'created_at' | 'updated_at'>>
      >;
    };
    Views: { [_ in never]: never };
    Functions: {
      is_admin: { Args: Record<PropertyKey, never>; Returns: boolean };
    };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};

export type Profile = Omit<ProfileRow, 'full_name' | 'year_of_study' | 'soft_skills'> & {
  full_name: string;
  year_of_study: string;
  soft_skills: string[];
};

export type OpportunityInput = Omit<OpportunityRow, 'id' | 'created_at' | 'updated_at' | 'created_by'>;

export type ApplicationWithOpportunity = ApplicationRow & {
  opportunity: Pick<OpportunityRow, 'id' | 'title' | 'organization'> | null;
};

export type ApplicationWithStudentAndOpportunity = ApplicationRow & {
  student: Pick<ProfileRow, 'id' | 'full_name' | 'college'> | null;
  opportunity: Pick<OpportunityRow, 'id' | 'title' | 'organization'> | null;
};
