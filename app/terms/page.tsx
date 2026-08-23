import type { Metadata } from 'next';
import {
  LegalPage,
  LegalSection,
  LegalList,
  LegalListItem,
} from '@/components/legal/legal';

export const metadata: Metadata = {
  title: 'Terms and Conditions — UniLens',
  description:
    'Terms and Conditions of Use for UniLens, Pakistan’s student-driven university platform.',
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms and Conditions of Use" updated="2026-08-23">
      <LegalSection title="1. Acceptance of These Terms">
        <p>
          By accessing or using UniLens (&ldquo;the Platform,&rdquo; &ldquo;we,&rdquo;
          &ldquo;us,&rdquo; or &ldquo;our&rdquo;), including browsing universities, creating an
          account, posting reviews or experiences, connecting with other users, or using any
          features, you agree to these Terms and Conditions. If you do not agree, do not use the
          Platform.
        </p>
        <p>
          These Terms form a binding agreement between you and the operators of UniLens. We may
          update them from time to time. Continued use after changes means you accept the revised
          Terms. Material changes will be indicated by an updated date or notice on the Platform.
        </p>
      </LegalSection>

      <LegalSection title="2. Eligibility and Accounts">
        <p>
          You must be at least 16 years old to use UniLens. If you are under 18, you confirm that a
          parent or guardian has reviewed and agreed to these Terms on your behalf where required.
        </p>
        <p>
          To access certain features (posting reviews, sharing experiences, connecting with others,
          earning badges, or personalized matching), you must create an account. You agree to:
        </p>
        <LegalList>
          <LegalListItem>Provide accurate, complete, and current information.</LegalListItem>
          <LegalListItem>
            Keep your login credentials confidential and notify us immediately of any unauthorized
            use.
          </LegalListItem>
          <LegalListItem>Be responsible for all activity under your account.</LegalListItem>
          <LegalListItem>
            Not create multiple accounts to evade restrictions or manipulate content.
          </LegalListItem>
        </LegalList>
        <p>
          We may suspend or terminate accounts that violate these Terms, provide false information,
          or engage in harmful activity.
        </p>
      </LegalSection>

      <LegalSection title="3. Description of the Service">
        <p>
          UniLens is a platform that helps students explore HEC-recognized Pakistani universities,
          match options based on grades, budget, location, program, and preferences, view student
          satisfaction and experience data, and share or read real experiences from pre-university,
          undergraduate, and graduate users. Features include university listings and rankings,
          filters, anonymous or attributed ratings and reviews, experience posts (including photos),
          career outcome information, recommendation indicators, credibility badges, and
          connections between users.
        </p>
        <p>
          University information is compiled from publicly available sources, user contributions,
          and other data. Rankings, satisfaction scores, and outcomes are indicative only and not
          official HEC rankings or guarantees of any result.
        </p>
      </LegalSection>

      <LegalSection title="4. User Content and Conduct">
        <p>
          You retain ownership of content you post (reviews, ratings, experience posts, photos,
          comments, career details, etc.). By posting, you grant UniLens a worldwide, non-exclusive,
          royalty-free, transferable license to use, host, store, reproduce, modify (for formatting
          or clarity), display, distribute, and create derivative works from that content solely to
          operate, improve, and promote the Platform.
        </p>
        <p>You are solely responsible for your content. You agree that your content:</p>
        <LegalList>
          <LegalListItem>
            Is truthful to the best of your knowledge and based on your genuine experience.
          </LegalListItem>
          <LegalListItem>
            Does not contain false, misleading, defamatory, harassing, discriminatory, or illegal
            material.
          </LegalListItem>
          <LegalListItem>
            Does not infringe any third-party intellectual property, privacy, or other rights.
          </LegalListItem>
          <LegalListItem>
            Does not include personal information of others without their consent (or anonymizes it
            appropriately).
          </LegalListItem>
          <LegalListItem>
            Does not promote violence, hate, spam, commercial solicitation (unless authorized), or
            any illegal activity.
          </LegalListItem>
          <LegalListItem>Complies with all applicable laws, including those of Pakistan.</LegalListItem>
        </LegalList>
        <p>
          We may remove, edit, or restrict content or accounts that violate these rules, receive
          valid complaints, or harm the Platform&rsquo;s integrity. We may use automated and human
          review, trust scores, and community signals to assess content reliability. Anonymous
          ratings are permitted where the feature allows, but we may still link content to accounts
          internally for moderation and abuse prevention.
        </p>
        <p>You may not:</p>
        <LegalList>
          <LegalListItem>
            Scrape, copy, or systematically extract data from the Platform without permission.
          </LegalListItem>
          <LegalListItem>Attempt to reverse-engineer, disrupt, or overload the service.</LegalListItem>
          <LegalListItem>
            Impersonate others or misrepresent your affiliation with any university.
          </LegalListItem>
          <LegalListItem>
            Use the Platform to collect personal data of other users for unauthorized purposes.
          </LegalListItem>
          <LegalListItem>
            Post content that could reasonably be expected to cause serious harm to individuals or
            institutions based on false statements.
          </LegalListItem>
        </LegalList>
      </LegalSection>

      <LegalSection title="5. University Information, Matching, and Outcomes">
        <p>
          University listings, rankings, program details, HEC status, satisfaction scores, and
          career/salary information are provided for informational purposes only. They are not
          advice, endorsements, or guarantees of admission, academic quality, employment, salary, or
          any specific outcome. Actual results vary widely based on individual circumstances, market
          conditions, and other factors outside our control.
        </p>
        <p>
          Matching tools are based on the data and preferences you provide and available Platform
          data. They do not constitute counseling or official guidance. Always verify information
          directly with universities, HEC, or relevant authorities.
        </p>
      </LegalSection>

      <LegalSection title="6. Intellectual Property">
        <p>
          The Platform, its design, logos, software, text (other than user content), graphics, and
          compilation of data are owned by UniLens or its licensors and protected by applicable
          intellectual property laws. You may not copy, modify, distribute, or create derivative
          works from our materials except as expressly permitted for personal, non-commercial use of
          the Platform.
        </p>
        <p>
          University names, logos, and trademarks belong to their respective owners. Their
          appearance on UniLens does not imply endorsement or affiliation.
        </p>
      </LegalSection>

      <LegalSection title="7. Disclaimers">
        <p>
          The Platform is provided &ldquo;as is&rdquo; and &ldquo;as available.&rdquo; We make no
          warranties, express or implied, regarding accuracy, completeness, reliability,
          availability, or fitness for a particular purpose of any content, rankings, reviews, or
          matching results.
        </p>
        <p>
          We do not guarantee that the Platform will be uninterrupted, error-free, or free of
          harmful components. User-generated content reflects the views of individual users, not
          UniLens.
        </p>
        <p>
          To the fullest extent permitted by law, UniLens disclaims liability for any decisions you
          make based on Platform information, any interactions with other users, or any outcomes
          related to university applications, studies, or careers.
        </p>
      </LegalSection>

      <LegalSection title="8. Limitation of Liability">
        <p>
          To the maximum extent permitted by applicable law, UniLens and its operators, affiliates,
          and service providers shall not be liable for any indirect, incidental, special,
          consequential, or punitive damages, or any loss of profits, data, or goodwill, arising
          from your use of the Platform or inability to use it, even if advised of the possibility
          of such damages.
        </p>
        <p>
          Our total liability for any claim arising out of or relating to these Terms or the
          Platform shall not exceed the amount you paid us (if any) in the twelve months preceding
          the claim, or PKR 5,000, whichever is greater.
        </p>
        <p>
          Some jurisdictions do not allow certain limitations; in those cases, the limitations apply
          to the fullest extent permitted.
        </p>
      </LegalSection>

      <LegalSection title="9. Indemnification">
        <p>
          You agree to indemnify and hold harmless UniLens and its operators from any claims,
          damages, losses, or expenses (including reasonable legal fees) arising from your content,
          your use of the Platform, your violation of these Terms, or your infringement of any
          third-party rights.
        </p>
      </LegalSection>

      <LegalSection title="10. Termination">
        <p>
          We may suspend or terminate your access at any time for violation of these Terms, legal
          requirements, or to protect the Platform or other users. You may stop using the Platform
          and request account deletion at any time through available account settings or by
          contacting us. Provisions that by their nature should survive (including intellectual
          property, disclaimers, limitation of liability, and indemnification) will survive
          termination.
        </p>
      </LegalSection>

      <LegalSection title="11. Governing Law and Disputes">
        <p>
          These Terms are governed by the laws of Pakistan. Any dispute arising out of or relating
          to these Terms or the Platform shall first be attempted to be resolved amicably. If
          unresolved, disputes shall be subject to the exclusive jurisdiction of the competent
          courts in Pakistan.
        </p>
      </LegalSection>

      <LegalSection title="12. General">
        <p>
          If any provision of these Terms is found unenforceable, the remaining provisions remain in
          effect. Our failure to enforce any right does not constitute a waiver. These Terms
          constitute the entire agreement between you and UniLens regarding the Platform,
          superseding prior agreements on the subject.
        </p>
        <p>
          For questions about these Terms, contact us through the support options available on the
          UniLens website.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
