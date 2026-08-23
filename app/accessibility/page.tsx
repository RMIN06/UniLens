import type { Metadata } from 'next';
import {
  LegalPage,
  LegalSection,
  LegalList,
  LegalListItem,
} from '@/components/legal/legal';

export const metadata: Metadata = {
  title: 'Accessibility Statement — UniLens',
  description:
    'Accessibility Statement for UniLens, Pakistan’s student-driven university platform. Our commitment to WCAG 2.1 Level AA.',
};

export default function AccessibilityPage() {
  return (
    <LegalPage title="Accessibility Statement" updated="2026-08-23">
      <LegalSection title="Our Commitment">
        <p>
          UniLens is committed to making our platform accessible to as many people as possible,
          including students and visitors with disabilities. We believe every student in Pakistan
          should be able to explore universities, read real experiences, share reviews, and use
          matching tools without unnecessary barriers.
        </p>
        <p>
          We aim to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA. These
          internationally recognised standards help ensure content is perceivable, operable,
          understandable, and robust for users of assistive technologies such as screen readers,
          keyboard navigation, and magnification tools.
        </p>
      </LegalSection>

      <LegalSection title="How Accessible UniLens Is">
        <p>
          We are actively working to improve accessibility across the platform. At present, UniLens
          is partially conformant with WCAG 2.1 Level AA. This means most core features meet the
          standard, while some areas still need improvement.
        </p>
        <p>You should be able to:</p>
        <LegalList>
          <LegalListItem>Navigate the majority of the site using only a keyboard</LegalListItem>
          <LegalListItem>Zoom in up to 200–400% without text overflowing or becoming unusable</LegalListItem>
          <LegalListItem>
            Use a screen reader (such as NVDA, JAWS, or VoiceOver) on main pages and university
            listings
          </LegalListItem>
          <LegalListItem>
            Adjust text size, contrast, and colours through your browser or operating system settings
          </LegalListItem>
          <LegalListItem>
            Access key information about universities, rankings, and student experiences
          </LegalListItem>
        </LegalList>
        <p>Known limitations (as of August 2026):</p>
        <LegalList>
          <LegalListItem>
            Some interactive filters, dynamic matching results, and photo-based experience posts may
            not yet provide full keyboard support or complete alternative text.
          </LegalListItem>
          <LegalListItem>
            Certain user-generated content (reviews, photos, and experience posts) may lack
            consistent alt text or structured headings because it is uploaded by individual users.
          </LegalListItem>
          <LegalListItem>
            Complex data visualisations or trust-score indicators may not fully convey meaning to
            screen reader users in all cases.
          </LegalListItem>
          <LegalListItem>
            Mobile navigation and some form fields (sign-up, review submission) are still being
            refined for consistent assistive technology support.
          </LegalListItem>
        </LegalList>
        <p>
          We are prioritising these areas and plan to address the most significant issues in
          upcoming updates.
        </p>
      </LegalSection>

      <LegalSection title="Measures We Take">
        <p>To improve accessibility we:</p>
        <LegalList>
          <LegalListItem>
            Design with semantic HTML, proper heading structure, and ARIA attributes where needed
          </LegalListItem>
          <LegalListItem>Test key flows with keyboard-only navigation and common screen readers</LegalListItem>
          <LegalListItem>
            Provide text alternatives for meaningful images and icons wherever possible
          </LegalListItem>
          <LegalListItem>Maintain sufficient colour contrast on primary interface elements</LegalListItem>
          <LegalListItem>Continuously review and fix reported issues</LegalListItem>
        </LegalList>
      </LegalSection>

      <LegalSection title="Feedback and Reporting Barriers">
        <p>
          If you encounter any accessibility barrier on UniLens — whether related to navigation,
          content, forms, or assistive technology compatibility — please let us know. Your feedback
          helps us improve.
        </p>
        <p>How to contact us:</p>
        <LegalList>
          <LegalListItem>Use the contact or support form available on the UniLens website</LegalListItem>
          <LegalListItem>Email the address listed for support or accessibility inquiries on the site</LegalListItem>
        </LegalList>
        <p>
          We aim to acknowledge accessibility reports within 5 working days and provide an update or
          resolution timeline as soon as practicable.
        </p>
        <p>When reporting an issue, it helps if you include:</p>
        <LegalList>
          <LegalListItem>The page or feature where the problem occurred</LegalListItem>
          <LegalListItem>A brief description of the barrier</LegalListItem>
          <LegalListItem>The assistive technology or browser you were using (if known)</LegalListItem>
          <LegalListItem>Your preferred contact method for follow-up</LegalListItem>
        </LegalList>
      </LegalSection>

      <LegalSection title="Compatibility">
        <p>
          UniLens is designed to work with current versions of major browsers (Chrome, Firefox,
          Safari, Edge) and common assistive technologies. We recommend keeping your browser and
          assistive tools up to date for the best experience.
        </p>
      </LegalSection>

      <LegalSection title="Ongoing Improvements">
        <p>
          Accessibility is an ongoing process. We review this statement and the platform&rsquo;s
          accessibility status periodically and after major feature releases. As UniLens grows, we
          will continue testing, fixing known issues, and incorporating accessibility into new
          development.
        </p>
      </LegalSection>

      <LegalSection title="Formal Complaints">
        <p>
          If you are not satisfied with our response to an accessibility concern, you may escalate
          the matter through the available support channels on the Platform or pursue any remedies
          available under applicable Pakistani law.
        </p>
        <p>This Accessibility Statement applies to the UniLens platform at unilens-ten.vercel.app.</p>
      </LegalSection>
    </LegalPage>
  );
}
