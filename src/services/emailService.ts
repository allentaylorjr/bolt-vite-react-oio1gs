import emailjs from '@emailjs/browser';

interface EmailTemplateParams {
  to_email: string;
  church_name: string;
  sermon_title: string;
  date: string;
  speaker: string;
  series: string;
  notes: string;
}

const EMAIL_SERVICE_ID = 'service_aiqnroh';
const EMAIL_TEMPLATE_ID = 'template_qhwk4h3';
const EMAIL_PUBLIC_KEY = 'bxgnDvVZQYl7_xhXy';

export const sendSermonNotes = async (params: EmailTemplateParams): Promise<void> => {
  try {
    await emailjs.send(
      EMAIL_SERVICE_ID,
      EMAIL_TEMPLATE_ID,
      {
        to_email: params.to_email,
        church_name: params.church_name,
        sermon_title: params.sermon_title,
        date: params.date,
        speaker: params.speaker,
        series: params.series,
        notes: params.notes
      },
      EMAIL_PUBLIC_KEY
    );
  } catch (error) {
    console.error('Email service error:', error);
    throw new Error('Failed to send email');
  }
};