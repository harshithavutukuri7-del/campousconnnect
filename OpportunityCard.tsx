import { ArrowUpRight, Calendar, MapPin } from 'lucide-react';
import type { Opportunity } from './types';

type Props = {
  opportunity: Opportunity;
};

export function OpportunityCard({ opportunity }: Props) {
  return (
    <div className="opportunity-card card">
      <div className="card-header-row">
        <div>
          <h4>{opportunity.title}</h4>
          <p>{opportunity.organization}</p>
        </div>
        <span className="tag">{opportunity.category}</span>
      </div>
      <p className="muted">{opportunity.description}</p>
      <div className="meta-line"><Calendar size={14} /> Deadline: {opportunity.deadline}</div>
      <div className="meta-line"><MapPin size={14} /> {opportunity.location}</div>
      <div className="card-footer-row">
        <button className="secondary-button small">Save</button>
        <a href={opportunity.applicationLink} className="primary-button small" target="_blank" rel="noreferrer">Apply Now <ArrowUpRight size={14} /></a>
      </div>
    </div>
  );
}
