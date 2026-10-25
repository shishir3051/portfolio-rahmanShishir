import PolicyPage from '../components/PolicyPage';
import { PROFILE } from '../data/profile';

// Privacy policy. Keep it accurate: describe only what the site really does.
// Sources of truth: POST /api/contact in portfolio-backend/server.js (what is stored and emailed)
// and the localStorage keys used in src/ (theme, bookmarked-posts, adminToken / isAdmin).
const SECTIONS = [
  {
    id: 'overview',
    title: 'Overview',
    blocks: [
      `This is the personal portfolio of ${PROFILE.name}. Visitors do not need an account, and the site has no advertising, analytics or tracking.`,
      'This page explains the small amount of data the site does handle.',
    ],
  },
  {
    id: 'contact-form',
    title: 'Contact form',
    blocks: [
      'When you send a message through the contact form, the following is saved in the site’s database (MongoDB):',
      [
        'Your name, email address and message.',
        'Your IP address and browser user agent, recorded automatically to help spot spam and abuse.',
      ],
      'Your name, email address and message are also sent to me as an email notification through Resend, an email delivery service.',
      'I use this information only to read and reply to your message. It is never sold or shared for marketing.',
    ],
  },
  {
    id: 'browser-storage',
    title: 'Data stored in your browser',
    blocks: [
      'The site uses your browser’s local storage to remember a few things on your device:',
      [
        'Your theme preference (light or dark).',
        'Blog posts you bookmark.',
        'For the site owner only: an admin session token used to sign in to the dashboard.',
      ],
      'Your theme and bookmarks stay on your device and are never sent to the server. You can remove them at any time by clearing this site’s data in your browser.',
    ],
  },
  {
    id: 'cookies',
    title: 'Cookies and third parties',
    blocks: [
      'The site does not set cookies and does not use analytics, advertising or tracking scripts.',
      'The site is hosted on Vercel and loads its font from Google Fonts. As with any website, these providers receive basic connection details, such as your IP address, when your browser requests files from them.',
      'Links to other sites, such as GitHub and LinkedIn, are covered by those sites’ own privacy policies.',
    ],
  },
  {
    id: 'your-data',
    title: 'Keeping and deleting your data',
    blocks: [
      'Contact messages are kept until I remove them manually from the database.',
      `You can ask to see or delete any message you have sent at any time by emailing ${PROFILE.email}; I will remove it by hand and confirm by email.`,
    ],
  },
  {
    id: 'changes',
    title: 'Changes to this policy',
    blocks: ['If the site starts handling data differently, this page will be updated and the date at the top will change.'],
  },
];

const Legal = () => (
  <PolicyPage
    metaTitle={`Privacy Policy | ${PROFILE.name}`}
    metaDescription={`How ${PROFILE.name}'s portfolio handles contact form messages and the settings stored in your browser.`}
    eyebrow="Privacy"
    title={
      <>
        Privacy <span className="gradient-text">policy</span>
      </>
    }
    description="What this site collects, why, and how to have it removed. In short: only what you send through the contact form."
    lastUpdated="2026-10-25"
    sections={SECTIONS}
    contactNote={`Questions about this policy, or want a message deleted? Email ${PROFILE.email}.`}
  />
);

export default Legal;
