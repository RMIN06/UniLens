import type { Metadata } from 'next';
import {
  LegalPage,
  LegalSection,
  LegalList,
  LegalListItem,
} from '@/components/legal/legal';

export const metadata: Metadata = {
  title: 'Privacy Policy — UniLens',
  description:
    'Privacy Policy for UniLens, Pakistan’s student-driven university platform. Learn how we collect, use, share, and protect your personal information.',
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="2026-08-23">
      <LegalSection title="1. Introduction">
        <p>
          UniLens (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) respects your
          privacy. This Privacy Policy explains how we collect, use, store, share, and protect
          personal information when you use our website and services at unilens-ten.vercel.app and
          related features.
        </p>
        <p>
          By using UniLens, you acknowledge the practices described here. If you do not agree,
          please do not use the Platform.
        </p>
      </LegalSection>

      <LegalSection title="2. Information We Collect">
        <p>We collect information in the following categories:</p>
        <h3 className="font-display text-heading-sm text-foreground pt-2">
          Information you provide directly
        </h3>
        <LegalList>
          <LegalListItem>
            Account registration details (name or display name, email address, password, and any
            profile information you choose to add).
          </LegalListItem>
          <LegalListItem>
            University preferences, grades/academic background, budget range, location interests,
            and program interests for matching features.
          </LegalListItem>
          <LegalListItem>
            Reviews, ratings, experience posts, photos, career outcomes, salary information (if
            shared), recommendation statements, and other user-generated content.
          </LegalListItem>
          <LegalListItem>Communications with us or other users through Platform features.</LegalListItem>
          <LegalListItem>
            Verification or credibility information if you choose to provide it for badges or
            higher-trust reviews.
          </LegalListItem>
        </LegalList>
        <h3 className="font-display text-heading-sm text-foreground pt-2">
          Information collected automatically
        </h3>
        <LegalList>
          <LegalListItem>
            Device and technical data (IP address, browser type, operating system, device
            identifiers).
          </LegalListItem>
          <LegalListItem>
            Usage data (pages viewed, features used, search queries, interaction with universities
            or reviews, approximate location derived from IP).
          </LegalListItem>
          <LegalListItem>
            Cookies and similar technologies for functionality, preferences, analytics, and
            security.
          </LegalListItem>
        </LegalList>
        <h3 className="font-display text-heading-sm text-foreground pt-2">
          Information from other sources
        </h3>
        <LegalList>
          <LegalListItem>Publicly available university and HEC-related data.</LegalListItem>
          <LegalListItem>
            Information from authentication providers if you sign in via third-party options
            (subject to those providers&rsquo; policies).
          </LegalListItem>
        </LegalList>
        <p>
          We do not intentionally collect sensitive personal data beyond what users voluntarily
          share in reviews or profiles (for example, career or academic details). Do not post highly
          sensitive information (health details, precise financial data of others, etc.) unless you
          are comfortable with it being associated with your content.
        </p>
      </LegalSection>

      <LegalSection title="3. How We Use Information">
        <p>We use collected information to:</p>
        <LegalList>
          <LegalListItem>
            Provide, operate, and improve the Platform (matching, university listings, review
            display, trust scoring, connections).
          </LegalListItem>
          <LegalListItem>
            Create and manage accounts, authenticate users, and personalize experiences.
          </LegalListItem>
          <LegalListItem>
            Display and moderate user content, calculate satisfaction scores and trust indicators.
          </LegalListItem>
          <LegalListItem>Communicate with you about your account, updates, or support requests.</LegalListItem>
          <LegalListItem>
            Detect, prevent, and address fraud, abuse, security issues, and violations of our Terms.
          </LegalListItem>
          <LegalListItem>Analyze usage to improve features and content relevance.</LegalListItem>
          <LegalListItem>Comply with legal obligations and respond to lawful requests.</LegalListItem>
          <LegalListItem>
            With your consent or as otherwise permitted, send relevant updates or promotional
            information (you can opt out).
          </LegalListItem>
        </LegalList>
        <p>
          We process personal data on the basis of your consent (for optional features and
          marketing), performance of our agreement with you (providing the service), legitimate
          interests (security, improvement, moderation), and legal obligations.
        </p>
      </LegalSection>

      <LegalSection title="4. How We Share Information">
        <p>We do not sell your personal information.</p>
        <p>We may share information in these circumstances:</p>
        <LegalList>
          <LegalListItem>
            <strong className="text-foreground">Public content:</strong> Reviews, ratings,
            experience posts, and certain profile elements you choose to make public are visible to
            other users and visitors as part of the Platform&rsquo;s purpose.
          </LegalListItem>
          <LegalListItem>
            <strong className="text-foreground">Service providers:</strong> Trusted third parties
            who help us host, analyze, moderate, or operate the Platform (under contractual
            obligations to protect data).
          </LegalListItem>
          <LegalListItem>
            <strong className="text-foreground">Legal requirements:</strong> When required by law,
            court order, or to protect rights, safety, or property of UniLens, users, or the public.
          </LegalListItem>
          <LegalListItem>
            <strong className="text-foreground">Business transfers:</strong> In connection with a
            merger, acquisition, or sale of assets, with appropriate protections.
          </LegalListItem>
          <LegalListItem>
            <strong className="text-foreground">With your direction:</strong> When you use features
            that connect you with other users or share content externally.
          </LegalListItem>
        </LegalList>
        <p>
          Anonymous or aggregated data that cannot reasonably identify you may be shared or
          published for research, statistics, or Platform insights.
        </p>
      </LegalSection>

      <LegalSection title="5. Data Retention">
        <p>
          We retain personal information for as long as needed to provide the service, fulfill the
          purposes described, comply with legal obligations, resolve disputes, and enforce
          agreements. Account data is generally kept while your account is active. You may request
          deletion of your account and associated personal data (subject to legal retention
          requirements and content that has been made public or is needed for Platform integrity).
          Public reviews may remain in anonymized or attributed form after account deletion if
          removal would undermine the historical record of experiences, unless you request specific
          content removal and it is feasible.
        </p>
      </LegalSection>

      <LegalSection title="6. Your Rights and Choices">
        <p>Depending on applicable law, you may have rights to:</p>
        <LegalList>
          <LegalListItem>Access the personal data we hold about you.</LegalListItem>
          <LegalListItem>Correct inaccurate data.</LegalListItem>
          <LegalListItem>Request deletion of your data (subject to exceptions).</LegalListItem>
          <LegalListItem>Withdraw consent where processing is based on consent.</LegalListItem>
          <LegalListItem>Object to or restrict certain processing.</LegalListItem>
          <LegalListItem>Receive a portable copy of your data in certain cases.</LegalListItem>
        </LegalList>
        <p>
          To exercise these rights, use account settings where available or contact us through the
          Platform. We will respond within a reasonable time and in accordance with applicable law.
          You may also manage cookies through your browser settings (note that disabling certain
          cookies may affect functionality).
        </p>
      </LegalSection>

      <LegalSection title="7. Security">
        <p>
          We implement reasonable technical and organizational measures to protect personal
          information against unauthorized access, loss, misuse, or alteration. No method of
          transmission or storage is completely secure. You are responsible for keeping your account
          credentials confidential.
        </p>
      </LegalSection>

      <LegalSection title="8. International Transfers and Storage">
        <p>
          Data may be processed and stored on servers located in Pakistan or other jurisdictions
          where our service providers operate. Where data is transferred outside Pakistan, we take
          steps consistent with applicable requirements to protect it.
        </p>
      </LegalSection>

      <LegalSection title="9. Children’s Privacy">
        <p>
          UniLens is not directed at children under 16. We do not knowingly collect personal
          information from children under 16. If we become aware that we have collected such
          information, we will take steps to delete it. Parents or guardians who believe a child has
          provided information should contact us.
        </p>
      </LegalSection>

      <LegalSection title="10. Changes to This Privacy Policy">
        <p>
          We may update this Privacy Policy from time to time. The updated version will be posted on
          the Platform with a revised &ldquo;Last updated&rdquo; date. Material changes will be
          highlighted. Continued use after changes constitutes acceptance.
        </p>
      </LegalSection>

      <LegalSection title="11. Contact Us">
        <p>
          For questions about this Privacy Policy or your personal data, contact us through the
          support or contact options on the UniLens website, or at the email address designated for
          privacy and legal inquiries.
        </p>
        <p>This Privacy Policy applies to the UniLens platform at unilens-ten.vercel.app.</p>
      </LegalSection>
    </LegalPage>
  );
}
