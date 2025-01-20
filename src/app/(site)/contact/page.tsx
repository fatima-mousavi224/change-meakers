import ContactUs from "@/components/contact-us/ContactUs";
import "@/lib/env";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with us for any inquiries, feedback, or support. We're here to help you with any questions or concerns you may have.",
};

export default function ContactUsPage() {
  return <ContactUs />;
}
