import { ArrowRight, Briefcase, CheckCircle2, ChevronDown, Compass, GraduationCap, MessageSquareText, Rocket, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
  { icon: Users, title: 'Smart Team Matcher', desc: 'Find teammates whose skills and interests match your project needs.' },
  { icon: Compass, title: 'Skill Exchange', desc: 'Teach what you know and learn what you need from peers.' },
  { icon: Rocket, title: 'Project Collaboration', desc: 'Build projects with organized teams, tasks, and deadlines.' },
  { icon: Briefcase, title: 'Opportunity Hub', desc: 'Discover internships, hackathons and campus opportunities.' },
  { icon: GraduationCap, title: 'Student Profiles', desc: 'Showcase your strengths and stand out to future collaborators.' },
  { icon: MessageSquareText, title: 'Campus Community', desc: 'Connect with students, mentors and clubs across your campus.' }
];

const steps = ['Create your profile', 'Discover students', 'Build your team', 'Collaborate and succeed'];

const faqs = [
  { q: 'How does CampusConnect match students?', a: 'The platform compares skills, interests, department fit, availability and project fit to suggest ideal teammates.' },
  { q: 'Where is my account and application data stored?', a: 'Student accounts, profiles, opportunities and applications are stored in Supabase. The site owner must configure the Supabase project before sign-in and database features are available.' },
  { q: 'Is the platform mobile friendly?', a: 'Yes. CampusConnect is designed responsive for mobile, tablet and desktop devices.' }
];

export function LandingPage() {
  return (
    <div>
      <section className="hero-section container">
        <div className="hero-copy">
          <span className="eyebrow">Smart student collaboration</span>
          <h1>Connect. Collaborate. Create.</h1>
          <p>Find your perfect teammates, exchange skills and turn your ideas into reality.</p>
          <div className="hero-actions">
            <Link to="/register" className="primary-button">Get Started <ArrowRight size={16} /></Link>
            <Link to="/dashboard" className="secondary-button">Explore Opportunities</Link>
          </div>
          <div className="hero-trust">
            <span><CheckCircle2 size={16} /> Verified student profiles</span>
            <span><CheckCircle2 size={16} /> Real project matching</span>
          </div>
        </div>
        <div className="hero-visual">
          <div className="visual-card main">
            <div className="mini-card card-one">
              <strong>12 mentors</strong>
              <small>available this week</small>
            </div>
            <div className="mini-card card-two">
              <strong>84% match</strong>
              <small>team compatibility</small>
            </div>
            <div className="students-stack">
              <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=400&q=80" alt="students" />
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="container section-block">
        <div className="section-heading">
          <span className="eyebrow">Features</span>
          <h2>Everything students need to build, learn and grow</h2>
        </div>
        <div className="feature-grid">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="feature-card card">
              <div className="feature-icon"><Icon size={20} /></div>
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="section-surface">
        <div className="container section-block">
          <div className="section-heading">
            <span className="eyebrow">How It Works</span>
            <h2>Start in four simple steps</h2>
          </div>
          <div className="steps-grid">
            {steps.map((step, index) => (
              <div key={step} className="step-card card">
                <span className="step-number">0{index + 1}</span>
                <h3>{step}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container section-block stats-block">
        <div className="stat-box">
          <strong>15K+</strong>
          <span>Students connected</span>
        </div>
        <div className="stat-box">
          <strong>2.4K</strong>
          <span>Projects launched</span>
        </div>
        <div className="stat-box">
          <strong>730</strong>
          <span>Hackathon wins</span>
        </div>
        <div className="stat-box">
          <strong>96%</strong>
          <span>Team satisfaction</span>
        </div>
        <small className="demo-note">Demo figures shown for preview only.</small>
      </section>

      <section id="about" className="container section-block about-block">
        <div>
          <span className="eyebrow">About CampusConnect</span>
          <h2>Built for ambitious student communities</h2>
          <p>CampusConnect helps students discover the right people, build meaningful projects, learn new skills and find the best campus opportunities. From peer learning to hackathon teams, the platform brings your campus community together.</p>
        </div>
      </section>

      <section className="container section-block faq-block">
        <div className="section-heading">
          <span className="eyebrow">FAQ</span>
          <h2>Frequently asked questions</h2>
        </div>
        <div className="faq-list">
          {faqs.map((faq) => (
            <details key={faq.q} className="faq-item card">
              <summary>{faq.q} <ChevronDown size={16} /></summary>
              <p>{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="container section-block contact-block">
        <div className="section-heading">
          <span className="eyebrow">Contact</span>
          <h2>Let’s build something amazing together</h2>
        </div>
        <form className="contact-form card">
          <input type="text" placeholder="Your name" />
          <input type="email" placeholder="Email address" />
          <textarea rows={4} placeholder="Tell us about your idea or collaboration request" />
          <button type="submit" className="primary-button">Send Message</button>
        </form>
      </section>
    </div>
  );
}
