import { ArrowRight, Briefcase, MapPin, Star } from 'lucide-react';
import type { Student } from './types';

type Props = {
  student: Student;
  matchPercent?: number;
};

export function StudentCard({ student, matchPercent }: Props) {
  return (
    <div className="student-card card">
      <div className="card-header-row">
        <img src={student.avatar} alt={student.name} className="student-avatar" />
        <div>
          <h4>{student.name}</h4>
          <p>{student.department} • {student.year}</p>
        </div>
        {typeof matchPercent === 'number' ? <span className="match-badge">{matchPercent}% match</span> : null}
      </div>
      <p className="muted">{student.bio}</p>
      <div className="tag-list">
        {student.skills.slice(0, 4).map((skill) => (
          <span key={skill} className="tag">{skill}</span>
        ))}
      </div>
      <div className="meta-line"><MapPin size={14} /> {student.college}</div>
      <div className="meta-line"><Briefcase size={14} /> {student.availability}</div>
      <div className="card-footer-row">
        <button className="secondary-button small"><Star size={14} /> Shortlist</button>
        <button className="primary-button small"><ArrowRight size={14} /> View Profile</button>
      </div>
    </div>
  );
}
