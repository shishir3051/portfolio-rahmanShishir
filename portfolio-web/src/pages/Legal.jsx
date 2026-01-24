import React from 'react';

const Legal = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 border-b border-stroke">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter mb-6">
              Privacy Policy
            </h1>
            <p className="text-muted">
              Last updated: <span className="text-text font-semibold">January 24, 2026</span>
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto prose prose-invert">
            <div className="space-y-12">
              {/* Introduction */}
              <div>
                <h2 className="text-3xl font-bold mb-4">Introduction</h2>
                <p className="text-muted leading-relaxed">
                  Rahman Shishir ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our portfolio website.
                </p>
                <p className="text-muted leading-relaxed mt-4">
                  Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
                </p>
              </div>

              {/* Information Collection */}
              <div>
                <h2 className="text-3xl font-bold mb-4">Information We Collect</h2>
                <h3 className="text-xl font-bold mb-3 text-accent">Personal Data</h3>
                <p className="text-muted leading-relaxed">
                  We may collect personally identifiable information that you voluntarily provide when you:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted mt-3">
                  <li>Submit a contact form</li>
                  <li>Subscribe to our newsletter</li>
                  <li>Request information about our services</li>
                  <li>Engage with interactive features on our site</li>
                </ul>
                <p className="text-muted leading-relaxed mt-4">
                  This information may include your name, email address, company name, and message content.
                </p>

                <h3 className="text-xl font-bold mb-3 text-accent mt-6">Automatically Collected Information</h3>
                <p className="text-muted leading-relaxed">
                  When you visit our website, we may automatically collect certain information about your device and browsing actions, including:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted mt-3">
                  <li>IP address</li>
                  <li>Browser type and version</li>
                  <li>Operating system</li>
                  <li>Referral URLs</li>
                  <li>Pages visited and time spent on pages</li>
                  <li>Device identifiers</li>
                </ul>
              </div>

              {/* Use of Information */}
              <div>
                <h2 className="text-3xl font-bold mb-4">Use of Your Information</h2>
                <p className="text-muted leading-relaxed">
                  We use the information we collect to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted mt-3">
                  <li>Respond to your inquiries and requests</li>
                  <li>Send you technical notices and support messages</li>
                  <li>Provide, maintain, and improve our website</li>
                  <li>Monitor and analyze usage patterns and trends</li>
                  <li>Detect, prevent, and address technical issues</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </div>

              {/* Data Protection */}
              <div>
                <h2 className="text-3xl font-bold mb-4">Data Security</h2>
                <p className="text-muted leading-relaxed">
                  We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no electronic transmission over the internet or information storage technology can be guaranteed to be 100% secure.
                </p>
                <p className="text-muted leading-relaxed mt-4">
                  While we strive to use commercially acceptable means to protect your personal data, we cannot guarantee its absolute security.
                </p>
              </div>

              {/* Cookies */}
              <div>
                <h2 className="text-3xl font-bold mb-4">Cookies and Tracking Technologies</h2>
                <p className="text-muted leading-relaxed">
                  We may use cookies and similar tracking technologies to track activity on our website and store certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier.
                </p>
                <p className="text-muted leading-relaxed mt-4">
                  You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our website.
                </p>
              </div>

              {/* Third Party Services */}
              <div>
                <h2 className="text-3xl font-bold mb-4">Third-Party Services</h2>
                <p className="text-muted leading-relaxed">
                  We may employ third-party companies and individuals to facilitate our service, provide service on our behalf, or assist us in analyzing how our service is used. These third parties may have access to your personal data only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.
                </p>
              </div>

              {/* User Rights */}
              <div>
                <h2 className="text-3xl font-bold mb-4">Your Data Protection Rights (GDPR)</h2>
                <p className="text-muted leading-relaxed">
                  If you are a resident of the European Economic Area (EEA), you have certain data protection rights:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted mt-3">
                  <li><strong className="text-text">Right to access</strong> – You have the right to request copies of your personal data.</li>
                  <li><strong className="text-text">Right to rectification</strong> – You have the right to request correction of inaccurate or incomplete information.</li>
                  <li><strong className="text-text">Right to erasure</strong> – You have the right to request deletion of your personal data.</li>
                  <li><strong className="text-text">Right to restrict processing</strong> – You have the right to request restriction of processing your personal data.</li>
                  <li><strong className="text-text">Right to data portability</strong> – You have the right to request transfer of your data to another organization.</li>
                  <li><strong className="text-text">Right to object</strong> – You have the right to object to our processing of your personal data.</li>
                </ul>
              </div>

              {/* Children's Privacy */}
              <div>
                <h2 className="text-3xl font-bold mb-4">Children's Privacy</h2>
                <p className="text-muted leading-relaxed">
                  Our website does not address anyone under the age of 13. We do not knowingly collect personally identifiable information from children under 13. If you are a parent or guardian and you are aware that your child has provided us with personal data, please contact us.
                </p>
              </div>

              {/* Changes to Policy */}
              <div>
                <h2 className="text-3xl font-bold mb-4">Changes to This Privacy Policy</h2>
                <p className="text-muted leading-relaxed">
                  We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
                </p>
                <p className="text-muted leading-relaxed mt-4">
                  You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
                </p>
              </div>

              {/* Contact */}
              <div className="glass p-8">
                <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
                <p className="text-muted leading-relaxed mb-4">
                  If you have any questions about this Privacy Policy, please contact us:
                </p>
                <div className="space-y-2 text-muted">
                  <p><strong className="text-text">Email:</strong> privacy@rahmanshishir.com</p>
                  <p><strong className="text-text">Website:</strong> <a href="#contact" className="text-accent hover:underline">Contact Form</a></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Legal;
