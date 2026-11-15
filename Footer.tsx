import { Github, Linkedin, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <div className="brand-wrap">
            <div className="brand-mark"><span>CC</span></div>
            <span>CampusConnect</span>
          </div>
          <p>Helping students discover peers, projects, internships and campus opportunities.</p>
        </div>
        <div>
          <h4>Explore</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/opportunities">Opportunity Hub</Link></li>
          </ul>
        </div>
        <div>
          <h4>Contact</h4>
          <ul>
            <li><Mail size={14} /> hello@campusconnect.ai</li>
            <li><Linkedin size={14} /> linkedin.com/campusconnect</li>
            <li><Github size={14} /> github.com/campusconnect</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">© 2026 CampusConnect. All rights reserved.</div>
    </footer>
  );
}
