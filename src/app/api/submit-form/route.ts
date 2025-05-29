import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import validator from 'validator';

export async function POST(request) {
  try {
    const formData = await request.formData();

    // Extract and validate fields
    const fields = {};
    for (const [key, value] of formData.entries()) {
      if (key !== 'idPhoto' && key !== 'englishDoc' && key !== 'supportingDocs') {
        fields[key] = value;
      }
    }

    const requiredFields = [
      'firstName',
      'lastName',
      'phone',
      'dob',
      'gender',
      'email',
      'country',
      'nationality',
      'educationStatus',
      'program',
      'englishLevel',
      'consent',
      'signatureName',
      'signatureDate',
    ];
    for (const field of requiredFields) {
      if (!fields[field] || (field === 'consent' && fields[field] !== 'true')) {
        return NextResponse.json(
          { message: `Missing or invalid ${field}` },
          { status: 400 }
        );
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(fields.email)) {
      return NextResponse.json(
        { message: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Sanitize text fields
    const sanitizedFields = {};
    for (const [key, value] of Object.entries(fields)) {
      sanitizedFields[key] = typeof value === 'string' ? validator.escape(value) : value;
    }

    // Prepare email content
    const emailBody = `
      <h2>New Student Application</h2>
      <p><strong>First Name:</strong> ${sanitizedFields.firstName}</p>
      <p><strong>Last Name:</strong> ${sanitizedFields.lastName}</p>
      <p><strong>Phone:</strong> ${sanitizedFields.phone}</p>
      <p><strong>Date of Birth:</strong> ${sanitizedFields.dob}</p>
      <p><strong>Gender:</strong> ${sanitizedFields.gender}</p>
      <p><strong>Email:</strong> ${sanitizedFields.email}</p>
      <p><strong>Country:</strong> ${sanitizedFields.country}</p>
      <p><strong>Nationality:</strong> ${sanitizedFields.nationality}</p>
      <p><strong>Education Status:</strong> ${sanitizedFields.educationStatus}</p>
      <p><strong>Program:</strong> ${sanitizedFields.program}</p>
      <p><strong>English Level:</strong> ${sanitizedFields.englishLevel}</p>
      <p><strong>Message:</strong> ${sanitizedFields.message || 'N/A'}</p>
      <p><strong>Referred:</strong> ${sanitizedFields.referred || 'N/A'}</p>
      <p><strong>Consent:</strong> ${sanitizedFields.consent}</p>
      <p><strong>Signature Name:</strong> ${sanitizedFields.signatureName}</p>
      <p><strong>Signature Date:</strong> ${sanitizedFields.signatureDate}</p>
    `;

    // Set up Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'admins@example.com', // Replace with actual admin email
      subject: 'New Student Application',
      html: emailBody,
      attachments: [],
    };

    // Handle file attachments
    const idPhoto = formData.get('idPhoto');
    if (idPhoto) {
      mailOptions.attachments.push({
        filename: idPhoto.name,
        content: Buffer.from(await idPhoto.arrayBuffer()),
      });
    }
    const englishDoc = formData.get('englishDoc');
    if (englishDoc) {
      mailOptions.attachments.push({
        filename: englishDoc.name,
        content: Buffer.from(await englishDoc.arrayBuffer()),
      });
    }
    const supportingDocs = formData.getAll('supportingDocs');
    for (const doc of supportingDocs) {
      mailOptions.attachments.push({
        filename: doc.name,
        content: Buffer.from(await doc.arrayBuffer()),
      });
    }

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: 'Form submitted successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Error submitting form' },
      { status: 500 }
    );
  }
}