import SiteContainer from "@/components/common/SiteContainer";
import ContactForm from "./ContactForm";

export default function ContactUs() {
  return (
    <SiteContainer as="main" className="py-6 sm:py-12 lg:py-16">
      <ContactForm />
    </SiteContainer>
  );
}
