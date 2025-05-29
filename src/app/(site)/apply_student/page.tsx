'use client'
import Banner from '@/components/common/Banner';
import React, { useState } from 'react';

interface FormData {
  firstName: string;
  lastName: string;
  phone: string;
  dob: string;
  gender: string;
  email: string;
  country: string;
  nationality: string;
  educationStatus: string;
  program: string;
  englishLevel: string;
  message: string;
  referred: string;
  consent: boolean;
  signatureName: string;
  signatureDate: string;
}

interface Files {
  idPhoto: File | null;
  englishDoc: File | null;
  supportingDocs: File[];
}

export default function StudentApplication() {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    phone: '',
    dob: '',
    gender: '',
    email: '',
    country: '',
    nationality: '',
    educationStatus: '',
    program: '',
    englishLevel: '',
    message: '',
    referred: '',
    consent: false,
    signatureName: '',
    signatureDate: '',
  });
  const [files, setFiles] = useState<Files>({
    idPhoto: null,
    englishDoc: null,
    supportingDocs: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const fileList = e.target.files;
    if (!fileList) return;
    
    const file = fileList[0];
    if (field === 'supportingDocs') {
      setFiles((prev) => ({
        ...prev,
        supportingDocs: [...prev.supportingDocs, ...Array.from(fileList)],
      }));
    } else {
      setFiles((prev) => ({ ...prev, [field]: file }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value.toString());
    });
    if (files.idPhoto) data.append('idPhoto', files.idPhoto);
    if (files.englishDoc) data.append('englishDoc', files.englishDoc);
    files.supportingDocs.forEach((file) =>
      data.append('supportingDocs', file)
    );

    try {
      const response = await fetch('/api/submit-form', {
        method: 'POST',
        body: data,
      });
      if (response.ok) {
        setSubmitStatus('success');
        setSubmitMessage('Form submitted successfully');
        setFormData({
          firstName: '',
          lastName: '',
          phone: '',
          dob: '',
          gender: '',
          email: '',
          country: '',
          nationality: '',
          educationStatus: '',
          program: '',
          englishLevel: '',
          message: '',
          referred: '',
          consent: false,
          signatureName: '',
          signatureDate: '',
        });
        setFiles({ idPhoto: null, englishDoc: null, supportingDocs: [] });
      } else {
        setSubmitStatus('error');
        setSubmitMessage('Error submitting form');
      }
    } catch (error) {
      console.error(error);
      setSubmitStatus('error');
      setSubmitMessage('Error submitting form');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex mt-4 max-w-7xl mx-auto px-4">
      {/* Sidebar */}
      <aside className="w-1/4 pr-4">
        <div className="sticky top-4">
          <h2 className="text-xl font-bold mb-4">Become a Changemaker</h2>
          <p className="text-sm text-gray-600 mb-4">
            Universal Contributor Application Form
          </p>
          <p className="text-xs text-gray-500">
            Please fill this form to join our growing network of change-makers.
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="w-3/4">
        <Banner>
          <span>Student Application Portal</span>
        </Banner>
        <div className="px-8 py-6 border-2 rounded-lg mt-12">
          <h1 className="text-2xl font-bold">Universal Contributor Form</h1>
          <p className="pt-3 text-gray-600">
            You're about to join a network of life-changing programs by Change
            Makers of the World. Whether you're a student seeking education under
            restrictions, a girl banned from school, or someone in need of books
            or mental health support, this form helps us connect you with the
            right resources. Our programs are designed for Afghan students,
            especially girls, with options for online and in-person learning,
            humanitarian support, and international advocacy participation.
          </p>
        </div>
        <form className="mt-12 space-y-8">
          {/* Basic Information */}
          <section className='border-2 rounded-lg p-8 bg-[#F2F2F2]'>
            <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
            <p className="text-sm text-gray-600 mb-6">Key personal details for identification and contact:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm/6 font-medium text-gray-900">First Name</label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="firstName"
                    className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    maxLength={50}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm/6 font-medium text-gray-900">Last Name</label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="lastName"
                    className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    maxLength={50}
                  />
                </div>
              </div>
              <div className="col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm/6 font-medium text-gray-900">Phone/WhatsApp Number</label>
                    <div className="mt-2">
                      <input
                        type="tel"
                        name="phone"
                        className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm/6 font-medium text-gray-900">Date of Birth</label>
                    <div className="mt-2">
                      <input
                        type="date"
                        name="dob"
                        className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                        value={formData.dob}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm/6 font-medium text-gray-900">Gender</label>
                    <div className="mt-2">
                      <select
                        name="gender"
                        className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                        value={formData.gender}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select Gender</option>
                        <option value="Female">Female</option>
                        <option value="Male">Male</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm/6 font-medium text-gray-900">Email Address</label>
                <div className="mt-2">
                  <input
                    type="email"
                    name="email"
                    className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm/6 font-medium text-gray-900">Country of Residence</label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="country"
                    className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                    value={formData.country}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm/6 font-medium text-gray-900">Nationality</label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="nationality"
                    className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                    value={formData.nationality}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="col-span-2">
                <label className="block text-sm/6 font-medium text-gray-900">Upload Photo</label>
                <span className="text-xs text-gray-600 italic">(Professional headshot or passport-style)</span>
                <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                  <div className="text-center">
                    <svg className="mx-auto size-12 text-gray-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" data-slot="icon">
                      <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z" clipRule="evenodd" />
                    </svg>
                    <div className="mt-4 flex text-sm/6 text-gray-600">
                      <label className="relative cursor-pointer rounded-md bg-white font-semibold text-primary-100 focus-within:ring-2 focus-within:ring-primary-100 focus-within:ring-offset-2 focus-within:outline-hidden hover:text-primary-100">
                        <span>Upload a file</span>
                        <input
                          type="file"
                          accept=".jpg,.png,.pdf"
                          onChange={(e) => handleFileChange(e, 'idPhoto')}
                          className="sr-only"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs/5 text-gray-600">PNG, JPG, PDF up to 10MB</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Skills & Background */}
          <section className='border-2 rounded-lg p-8 bg-[#F2F2F2]'>
            <h2 className="text-xl font-semibold mb-4">Skills & Background</h2>
            <p className="text-sm text-gray-600 mb-6">Your current educational status and program preferences:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm/6 font-medium text-gray-900">Current Education Status</label>
                <div className="mt-2">
                  <select
                    name="educationStatus"
                    className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                    value={formData.educationStatus}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Status</option>
                    <option value="Online Education">Online Education</option>
                    <option value="In-Person Education">In-Person Education</option>
                    <option value="Not Enrolled">Not Enrolled</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm/6 font-medium text-gray-900">Program of Interest</label>
                <div className="mt-2">
                  <select
                    name="program"
                    className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                    value={formData.program}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Program</option>
                    <option value="Access to Recorded School Videos">Access to Recorded School Videos</option>
                    <option value="Books & School Supplies">Books & School Supplies</option>
                    <option value="Join the e-Library">Join the e-Library</option>
                    <option value="Mental Health Support">Mental Health Support</option>
                    <option value="International Scholarship">International Scholarship</option>
                    <option value="Afghan Girl Coders">Afghan Girl Coders</option>
                    <option value="Human Rights & Advocacy">Human Rights & Advocacy</option>
                    <option value="Mental Health Empowerment">Mental Health Empowerment</option>
                    <option value="Online Learning & Empowerment">Online Learning & Empowerment</option>
                  </select>
                </div>
              </div>
            </div>
          </section>

          {/* English Proficiency */}
          <section className='border-2 rounded-lg p-8 bg-[#F2F2F2]'>
            <h2 className="text-xl font-semibold mb-4">English Proficiency</h2>
            <p className="text-sm text-gray-600 mb-6">Assessment of your English language skills:</p>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm/6 font-medium text-gray-900">Current Level</label>
                <div className="mt-2">
                  <select
                    name="englishLevel"
                    className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                    value={formData.englishLevel}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Level</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm/6 font-medium text-gray-900">Proficiency Test Document (Optional)</label>
                <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                  <div className="text-center">
                    <svg className="mx-auto size-12 text-gray-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" data-slot="icon">
                      <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z" clipRule="evenodd" />
                    </svg>
                    <div className="mt-4 flex text-sm/6 text-gray-600">
                      <label className="relative cursor-pointer rounded-md bg-white font-semibold text-primary-100 focus-within:ring-2 focus-within:ring-primary-100 focus-within:ring-offset-2 focus-within:outline-hidden hover:text-primary-100">
                        <span>Upload a file</span>
                        <input
                          type="file"
                          accept=".pdf,.docx"
                          onChange={(e) => handleFileChange(e, 'englishDoc')}
                          className="sr-only"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs/5 text-gray-600">PDF, DOCX up to 10MB</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Supporting Documents */}
          <section className='border-2 rounded-lg p-8 bg-[#F2F2F2]'>
            <h2 className="text-xl font-semibold mb-4">Supporting Documents (Optional)</h2>
            <p className="text-sm text-gray-600 mb-6">Additional documentation that supports your application:</p>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm/6 font-medium text-gray-900">Upload Documents</label>
                <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                  <div className="text-center">
                    <svg className="mx-auto size-12 text-gray-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" data-slot="icon">
                      <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z" clipRule="evenodd" />
                    </svg>
                    <div className="mt-4 flex text-sm/6 text-gray-600">
                      <label className="relative cursor-pointer rounded-md bg-white font-semibold text-primary-100 focus-within:ring-2 focus-within:ring-primary-100 focus-within:ring-offset-2 focus-within:outline-hidden hover:text-primary-100">
                        <span>Upload a file</span>
                        <input
                          type="file"
                          multiple
                          accept=".pdf,.docx"
                          onChange={(e) => handleFileChange(e, 'supportingDocs')}
                          className="sr-only"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs/5 text-gray-600">PDF, DOCX up to 10MB</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Your Message */}
          <section className='border-2 rounded-lg p-8 bg-[#F2F2F2]'>
            <h2 className="text-xl font-semibold mb-4">Your Message (Optional)</h2>
            <p className="text-sm text-gray-600 mb-6">Tell us more about your situation and motivation:</p>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm/6 font-medium text-gray-900">Your Message</label>
                <div className="mt-2">
                  <textarea
                    name="message"
                    className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={4}
                    maxLength={1000}
                    placeholder="Describe your situation or reason for applying"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Referral */}
          <section className='border-2 rounded-lg p-8 bg-[#F2F2F2]'>
            <h2 className="text-xl font-semibold mb-4">Referral (Optional)</h2>
            <p className="text-sm text-gray-600 mb-6">Information about how you learned about our programs:</p>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm/6 font-medium text-gray-900">Referral Information</label>
                <div className="mt-2">
                  <textarea
                    name="referred"
                    className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                    value={formData.referred}
                    onChange={handleInputChange}
                    rows={2}
                    placeholder="Have you been referred to a program or invited?"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Consent */}
          <section className='border-2 rounded-lg p-8 bg-[#F2F2F2]'>
            <h2 className="text-xl font-semibold mb-4">Consent</h2>
            <p className="text-sm text-gray-600 mb-6">Legal agreement and signature for application processing:</p>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="consent"
                    checked={formData.consent}
                    onChange={handleInputChange}
                    required
                    className="mr-2"
                  />
                  <span className="text-sm/6 text-gray-900">I consent to data collection and participation purposes</span>
                </label>
              </div>
              <div>
                <label className="block text-sm/6 font-medium text-gray-900">Full Name</label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="signatureName"
                    className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                    value={formData.signatureName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm/6 font-medium text-gray-900">Date</label>
                <div className="mt-2">
                  <input
                    type="date"
                    name="signatureDate"
                    className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                    value={formData.signatureDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Submit */}
          <div className="flex justify-between mb-10">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary-100 text-white px-6 py-3 rounded-md disabled:opacity-50"
              onClick={handleSubmit}
            >
              Submit
            </button>
            <button
              type="button"
              className="border-2 border-gray-300 px-6 py-3 rounded-md"
              onClick={() => {
                setFormData({
                  firstName: '',
                  lastName: '',
                  phone: '',
                  dob: '',
                  gender: '',
                  email: '',
                  country: '',
                  nationality: '',
                  educationStatus: '',
                  program: '',
                  englishLevel: '',
                  message: '',
                  referred: '',
                  consent: false,
                  signatureName: '',
                  signatureDate: '',
                });
                setFiles({ idPhoto: null, englishDoc: null, supportingDocs: [] });
              }}
            >
              Clear Form
            </button>
          </div>
          {submitMessage && (
            <p
              className={
                submitStatus === 'success' ? 'text-green-500' : 'text-red-500'
              }
            >
              {submitMessage}
            </p>
          )}
        </form>
      </main>
    </div>
  );
}