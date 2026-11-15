import { FolderKanban, PlusCircle } from 'lucide-react';
import { defaultState } from './data';
import { ProjectCard } from './ProjectCard';
import { Sidebar } from './Sidebar';

export function Projects() {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-panel">
        <div className="page-header">
          <div>
            <p className="eyebrow">Projects</p>
            <h1>Project collaboration hub</h1>
          </div>
          <button className="primary-button small"><PlusCircle size={14} /> Create Project</button>
        </div>

        <div className="results-grid">
          {defaultState.projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </main>
    </div>
  );
}
