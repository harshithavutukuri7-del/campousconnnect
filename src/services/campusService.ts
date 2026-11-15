import { getSupabase } from './supabase';
import type {
  ApplicationRow,
  ApplicationStatus,
  ApplicationWithOpportunity,
  ApplicationWithStudentAndOpportunity,
  OpportunityInput,
  OpportunityRow,
  ProfileRow
} from '../types/supabase';

export type ProfileUpdate = Pick<
  ProfileRow,
  'full_name' | 'college' | 'department' | 'year_of_study' | 'bio' | 'skills'
>;

export async function getProfile(id: string) {
  const { data, error } = await getSupabase().from('profiles').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
}

export async function updateProfile(id: string, updates: ProfileUpdate) {
  const { data, error } = await getSupabase()
    .from('profiles')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getStudentProfiles(excludeId: string) {
  const { data, error } = await getSupabase()
    .from('profiles')
    .select('id, full_name, college, department, year_of_study, skills, avatar, availability')
    .neq('id', excludeId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function getOpportunities() {
  const { data, error } = await getSupabase()
    .from('opportunities')
    .select('*')
    .eq('is_published', true)
    .order('deadline', { ascending: true, nullsFirst: false });
  if (error) throw error;
  return data;
}

export async function getAdminOpportunities() {
  const { data, error } = await getSupabase()
    .from('opportunities')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function getStudentApplications(studentId: string): Promise<ApplicationWithOpportunity[]> {
  const { data: applications, error } = await getSupabase()
    .from('applications')
    .select('*')
    .eq('student_id', studentId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  if (!applications.length) return [];

  const opportunityIds = [...new Set(applications.map((application) => application.opportunity_id))];
  const { data: opportunities, error: opportunityError } = await getSupabase()
    .from('opportunities')
    .select('id, title, organization')
    .in('id', opportunityIds);
  if (opportunityError) throw opportunityError;

  const byId = new Map(opportunities.map((opportunity) => [opportunity.id, opportunity]));
  return applications.map((application) => ({
    ...application,
    opportunity: byId.get(application.opportunity_id) ?? null
  }));
}

export async function applyToOpportunity(opportunityId: string, studentId: string, coverLetter = '') {
  const { data, error } = await getSupabase()
    .from('applications')
    .insert({
      opportunity_id: opportunityId,
      student_id: studentId,
      cover_letter: coverLetter,
      status: 'submitted'
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function saveOpportunity(input: OpportunityInput, createdBy: string, id?: string) {
  const query = id
    ? getSupabase().from('opportunities').update(input).eq('id', id)
    : getSupabase().from('opportunities').insert({ ...input, created_by: createdBy });
  const { data, error } = await query.select().single();
  if (error) throw error;
  return data;
}

export async function deleteOpportunity(id: string) {
  const { error } = await getSupabase().from('opportunities').delete().eq('id', id);
  if (error) throw error;
}

export async function getAdminApplications(): Promise<ApplicationWithStudentAndOpportunity[]> {
  const client = getSupabase();
  const { data: applications, error } = await client
    .from('applications')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);
  if (error) throw error;
  if (!applications.length) return [];

  const studentIds = [...new Set(applications.map((application) => application.student_id))];
  const opportunityIds = [...new Set(applications.map((application) => application.opportunity_id))];
  const [studentsResult, opportunitiesResult] = await Promise.all([
    client.from('profiles').select('id, full_name, college').in('id', studentIds),
    client.from('opportunities').select('id, title, organization').in('id', opportunityIds)
  ]);
  if (studentsResult.error) throw studentsResult.error;
  if (opportunitiesResult.error) throw opportunitiesResult.error;

  const studentsById = new Map(studentsResult.data.map((student) => [student.id, student]));
  const opportunitiesById = new Map(opportunitiesResult.data.map((opportunity) => [opportunity.id, opportunity]));
  return applications.map((application) => ({
    ...application,
    student: studentsById.get(application.student_id) ?? null,
    opportunity: opportunitiesById.get(application.opportunity_id) ?? null
  }));
}

export async function updateApplicationStatus(id: string, status: ApplicationStatus) {
  const { data, error } = await getSupabase()
    .from('applications')
    .update({ status })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as ApplicationRow;
}

export async function getAdminCounts() {
  const client = getSupabase();
  const [profiles, opportunities, applications] = await Promise.all([
    client.from('profiles').select('id', { count: 'exact', head: true }),
    client.from('opportunities').select('id', { count: 'exact', head: true }),
    client.from('applications').select('id', { count: 'exact', head: true })
  ]);
  if (profiles.error) throw profiles.error;
  if (opportunities.error) throw opportunities.error;
  if (applications.error) throw applications.error;
  return {
    students: profiles.count ?? 0,
    opportunities: opportunities.count ?? 0,
    applications: applications.count ?? 0
  };
}
