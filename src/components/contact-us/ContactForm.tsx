'use client';

import React, { useRef, useState } from 'react';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { InfoIcon } from 'lucide-react';
import { EnterUserIcon, MailIcon, OutUserIcon } from '../icons/Icons';

const contactSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(1, 'Message is required'),
});

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCaptchaChange = (value: string | null) => {
    setCaptchaVerified(Boolean(value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationResult = contactSchema.safeParse(formData);

    if (!validationResult.success) {
      const newErrors = validationResult.error.errors.reduce((acc, curr) => {
        acc[curr.path[0] as string] = curr.message;
        return acc;
      }, {} as Record<string, string>);
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      toast.success('Message sent successfully');
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        subject: '',
        message: '',
      });
      setCaptchaVerified(false);
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lg:max-w-2xl mx-auto bg-gray-100 p-6 rounded-lg shadow">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* First Name */}
          <div>
            <label
              htmlFor="firstName"
              className="block text-base font-medium text-black_color"
            >
              First Name
            </label>
            <div className="relative mt-1">
              <EnterUserIcon className="absolute left-3 top-2.5 h-5 w-5 text-dark_gray" />
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First Name"
                className="w-full border border-dark_gray rounded-lg py-2 pl-10 pr-3 placeholder:text-dark_gray placeholder:text-sm outline-none focus:ring-1 focus:ring-dark_gray focus:border-dark_gray"
              />
              {errors.firstName && (
                <p className="text-red-400 text-sm">{errors.firstName}</p>
              )}
            </div>
          </div>
          {/* Last Name */}
          <div>
            <label
              htmlFor="lastName"
              className="block text-base font-medium text-black_color"
            >
              Last Name
            </label>
            <div className="relative mt-1">
              <OutUserIcon className="absolute left-3 top-2.5 h-5 w-5 text-dark_gray" />
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last Name"
                className="w-full border border-dark_gray rounded-lg py-2 pl-10 pr-3 placeholder:text-dark_gray placeholder:text-sm focus:outline-none focus:ring-1 focus:ring-dark_gray focus:border-dark_gray"
              />
              {errors.lastName && (
                <p className="text-red-400 text-sm">{errors.lastName}</p>
              )}
            </div>
          </div>
        </div>

        {/* Email */}
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-base font-medium text-black_color"
          >
            Email
          </label>
          <div className="relative mt-1">
            <MailIcon className="absolute left-3 top-2.5 h-5 w-5 text-dark_gray" />
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email address"
              className="w-full border border-dark_gray rounded-lg py-2 pl-10 pr-3 placeholder:text-dark_gray placeholder:text-sm focus:outline-none focus:ring-1 focus:ring-dark_gray focus:border-dark_gray"
            />
            {errors.email && (
              <p className="text-red-400 text-sm">{errors.email}</p>
            )}
          </div>
        </div>

        {/* Subject */}
        <div className="mb-4">
          <label
            htmlFor="subject"
            className="block text-base font-medium text-black_color"
          >
            Subject
          </label>
          <div className="relative mt-1">
            <InfoIcon className="absolute left-3 top-2.5 h-5 w-5 text-dark_gray" />
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="e.g., Partnership Inquiry, General Question"
              className="w-full border border-dark_gray rounded-lg py-2 pl-10 pr-3 placeholder:text-dark_gray placeholder:text-sm focus:outline-none focus:ring-1 focus:ring-dark_gray focus:border-dark_gray"
            />
            {errors.subject && (
              <p className="text-red-400 text-sm">{errors.subject}</p>
            )}
          </div>
        </div>

        {/* Message */}
        <div className="mb-6">
          <label
            htmlFor="message"
            className="block text-base font-medium text-black_color"
          >
            Message
          </label>
          <div className="relative mt-1">
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="How can we assist you? Let us know any details."
              rows={4}
              className="w-full border border-dark_gray rounded-lg py-2 pr-3 placeholder:text-dark_gray placeholder:text-sm focus:outline-none focus:ring-1 focus:ring-dark_gray focus:border-dark_gray"
            ></textarea>
            {errors.message && (
              <p className="text-red-400 text-sm">{errors.message}</p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-50 text-white py-2 px-4 rounded-lg hover:bg-primary-100 transition focus:outline-none focus:ring-1 focus:ring-dark_gray focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;
