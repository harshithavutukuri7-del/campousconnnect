import { CalendarRange, Users } from 'lucide-react';
import type { Project } from './types';

type Props = {
  project: Project;
};

export function ProjectCard({ project }: Props) {
  return (
    <div className="project-card card">
      <div className="card-header-row">
        <div>
          <h4>{project.title}</h4>
          <p>{project.category}</p>
        </div>
        <span className="status-pill">{project.status}</span>
      </div>
      <p className="muted">{project.description}</p>
      <div className="tag-list">
        {project.requiredSkills.map((skill) => (<span className="tag" key={skill}>{skill}</span>))}
      </div>
      <div className="meta-line"><Users size={14} /> {project.teamSize} members needed</div>
      <div className="meta-line"><CalendarRange size={14} /> Deadline: {project.deadline}</div>
      <div className="card-footer-row">
        <button className="secondary-button small">View Details</button>
        <button className="primary-button small">Join Project</button>
      </div>
    </div>
  );
}
