import type { Metadata } from 'next';
import { LegalPage } from '@/components/legal/legal';
import { FaqAccordion, type FaqItem } from '@/components/faq/faq-accordion';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions — UniLens',
  description:
    'Answers to common questions about UniLens — Pakistan’s student-driven university platform.',
};

const faqs: FaqItem[] = [
  {
    question: 'What is UniLens?',
    answer:
      'UniLens is Pakistan’s student-driven university platform. It helps you explore HEC-recognized universities, compare them through real student satisfaction data, and read honest experiences shared by pre-university, undergraduate, and graduate students — so you can make informed decisions based on real experience, not just rankings.',
  },
  {
    question: 'Is UniLens free to use?',
    answer:
      'Yes. Browsing universities, reading reviews and experiences, and using the matching tools are free. Creating an account unlocks additional features like posting your own experiences, rating universities, earning credibility badges, and connecting with other students.',
  },
  {
    question: 'How are the university rankings and satisfaction scores calculated?',
    answer:
      'Rankings and satisfaction scores are built from student reviews, ratings, and experience data on the platform, combined with publicly available university information. They are indicative only and are not official HEC rankings. Always verify important details directly with universities or HEC.',
  },
  {
    question: 'Can I post reviews or experiences anonymously?',
    answer:
      'Yes. Where the feature allows, you can rate and review anonymously. Internationally accepted moderation practices still apply — anonymous content is linked to your account internally for moderation and abuse prevention, but it is not shown publicly with your identity.',
  },
  {
    question: 'How do you make sure reviews are genuine?',
    answer:
      'We use a combination of automated checks, human review, trust scores, and community signals to assess content reliability. Reviews must be based on your genuine experience, and content that is false, misleading, or harmful can be removed. Credibility badges highlight verified, high-trust contributors.',
  },
  {
    question: 'Who can join UniLens?',
    answer:
      'Anyone aged 16 or over can join — pre-university students exploring options, current undergraduates, graduates, and alumni who want to guide the next generation. If you are under 18, a parent or guardian should review and agree to our Terms on your behalf where required.',
  },
  {
    question: 'How does the university matching work?',
    answer:
      'Matching is based on the grades, budget, location, program interests, and preferences you provide, combined with platform data. It is a decision-support tool, not official counseling — treat suggestions as a starting point and verify details with the universities themselves.',
  },
  {
    question: 'How do I delete my account or my data?',
    answer:
      'You can stop using the platform and request account deletion at any time through account settings or by contacting us. For details on what is retained and your data rights, see our Privacy Policy.',
  },
  {
    question: 'How do I report inappropriate content or a problem?',
    answer:
      'Use the support or contact options available on the website. Reports about abusive, false, or harmful content are reviewed by our moderation team. Accessibility barriers can also be reported — see our Accessibility Statement for what to include.',
  },
  {
    question: 'How do I contact UniLens?',
    answer:
      'You can reach us through the support options on the UniLens website or email us at hello@unilens.app. We aim to respond within a reasonable time.',
  },
];

export default function FaqPage() {
  return (
    <LegalPage title="Frequently Asked Questions" updated="2026-08-23">
      <p className="font-body text-body-lg text-muted-foreground leading-relaxed">
        Everything you need to know about using UniLens. Can&apos;t find what you&apos;re looking
        for? Reach out to us at{' '}
        <a
          href="mailto:hello@unilens.app"
          className="text-accent hover:underline underline-offset-4"
        >
          hello@unilens.app
        </a>
        .
      </p>
      <FaqAccordion items={faqs} />
    </LegalPage>
  );
}
