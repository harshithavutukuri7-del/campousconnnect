import type { Project, Student } from './types';

export const calculateSkillMatch = (requiredSkills: string[], studentSkills: string[]) => {
  if (!requiredSkills.length) return 100;
  const matches = requiredSkills.filter((skill) => studentSkills.some((studentSkill) => studentSkill.toLowerCase() === skill.toLowerCase()));
  return Math.round((matches.length / requiredSkills.length) * 100);
};

export const recommendStudents = (project: Project, students: Student[]) => {
  return students
    .filter((student) => student.id !== project.ownerId)
    .map((student) => {
      const skillMatch = calculateSkillMatch(project.requiredSkills, student.skills);
      const interestBonus = student.interests.some((interest) => project.category.toLowerCase().includes(interest.toLowerCase())) ? 8 : 0;
      const deptBoost = student.department.toLowerCase().includes(project.preferredDepartment.toLowerCase()) ? 10 : 0;
      const availabilityBoost = student.availability === 'Available' ? 12 : student.availability === 'Open to discuss' ? 5 : 0;
      const score = Math.min(100, skillMatch + interestBonus + deptBoost + availabilityBoost);
      return {
        student,
        score,
        skillMatch,
        reason: `${student.department} • ${student.availability}`
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
};
