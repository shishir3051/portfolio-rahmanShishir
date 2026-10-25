import PolicyPage from '../components/PolicyPage';
import { PROFILE } from '../data/profile';

// Terms of service. Plain-language ground rules for using the portfolio and its content.
const SECTIONS = [
  {
    id: 'using-the-site',
    title: 'Using this site',
    blocks: [
      `This website is the personal portfolio of ${PROFILE.name}. By using it, you agree to these terms. If you do not agree, please do not use the site.`,
      'The site is provided for general information. Its content may change, or the site may be taken offline, at any time without notice.',
    ],
  },
  {
    id: 'content',
    title: 'Content and ownership',
    blocks: [
      `Unless stated otherwise, the text, images and design of this site belong to ${PROFILE.name}.`,
      'You are welcome to link to any page and to quote short excerpts with credit. Please ask before reusing anything else.',
      'Projects linked from this site, for example on GitHub, are covered by their own licenses.',
    ],
  },
  {
    id: 'acceptable-use',
    title: 'Acceptable use',
    blocks: [
      'When using the site, please do not:',
      [
        'Send spam, abusive or misleading messages through the contact form.',
        'Try to access the admin dashboard or API without permission.',
        'Disrupt the site, for example with automated traffic that places heavy load on it.',
      ],
      'The contact form is rate limited, and traffic that looks abusive may be blocked.',
    ],
  },
  {
    id: 'work-enquiries',
    title: 'Work enquiries',
    blocks: [
      'Sending a message through this site does not create a client, contractor or employment relationship. Any paid work is agreed separately, in writing.',
    ],
  },
  {
    id: 'no-warranty',
    title: 'No warranty',
    blocks: [
      'The site and its content are provided as is. I try to keep everything accurate, but cannot guarantee that it is complete or up to date.',
      'To the extent permitted by law, I am not liable for any loss arising from using this site or relying on its content.',
      'Links to other websites are provided for convenience. I am not responsible for their content.',
    ],
  },
  {
    id: 'changes',
    title: 'Changes to these terms',
    blocks: ['These terms may be updated from time to time. The date at the top of this page shows the latest version.'],
  },
];

const Terms = () => (
  <PolicyPage
    metaTitle={`Terms of Service | ${PROFILE.name}`}
    metaDescription={`Terms for using ${PROFILE.name}'s portfolio website and its content.`}
    eyebrow="Terms"
    title={
      <>
        Terms of <span className="gradient-text">service</span>
      </>
    }
    description="The ground rules for using this website and its content."
    lastUpdated="2026-10-25"
    sections={SECTIONS}
    contactNote={`Questions about these terms? Email ${PROFILE.email}.`}
  />
);

export default Terms;
