import React from 'react';
import SiteContainer from '@/components/common/SiteContainer';

export default function PrivacyPolicy() {
  return (
    <div className="-mb-10">
      <SiteContainer className="py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
          Privacy Policy - Change Makers
        </h1>
        <p className="text-gray-600 text-lg mb-8 text-center">
          At Change Makers, we are committed to ensuring your privacy while helping us bring hope to those in need.
        </p>

        <div className="space-y-10">
          {/* Section: Introduction */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              1. Introduction
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Change Makers is dedicated to empowering girls and supporting vulnerable communities in Afghanistan. 
              We value your trust and are committed to transparency in how we handle your data and donations.
            </p>
          </section>

          {/* Section: Data Collection */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              2. Data We Collect
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-600 leading-relaxed">
              <li>Personal identification information (name, email address, phone number).</li>
              <li>Donation details (amount, date, payment method).</li>
              <li>Communication preferences (newsletter subscriptions).</li>
            </ul>
          </section>

          {/* Section: Usage of Donations */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              3. How We Use Your Donations
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Every dollar donated is sent directly to the girls and families in need. 
              We provide reports to ensure accountability and transparency about how your contributions are making a difference.
            </p>
          </section>

          {/* Section: How We Use Your Data */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              4. How We Use Your Data
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Your data is used to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 leading-relaxed">
              <li>Process donations securely.</li>
              <li>Send updates about our projects and their impact.</li>
              <li>Respond to your queries and provide support.</li>
            </ul>
          </section>

          {/* Section: Donor Rights */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              5. Your Rights
            </h2>
            <p className="text-gray-600 leading-relaxed">
              As a donor, you have the right to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 leading-relaxed">
              <li>Access and review the data we store about you.</li>
              <li>Request corrections to your personal information.</li>
              <li>Opt-out of communications or unsubscribe at any time.</li>
            </ul>
          </section>

     
        </div>
      </div>
      </SiteContainer>
    </div>
  );
}
