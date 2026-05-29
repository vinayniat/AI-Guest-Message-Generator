import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GOOGLE_GEMINI_API_KEY;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { guestName, dates, roomType, messageType, customNotes } = body;

    if (!guestName || !messageType) {
      return NextResponse.json(
        { error: 'Guest Name and Message Type are required.' },
        { status: 400 }
      );
    }

    const systemPrompt = `You are an expert hospitality assistant for a premium hotel.
Your task is to draft a professional, warm, and concise WhatsApp message for a guest.
Use a welcoming and polite tone. Do not use generic placeholders like [Hotel Name] if not provided, just keep it natural or use "our hotel".
Keep it relatively short, as it is a WhatsApp message. Use formatting like *bold* for emphasis if needed, and a couple of relevant emojis.

Guest Details:
- Name: ${guestName}
- Stay Dates: ${dates || 'Not specified'}
- Room Type: ${roomType || 'Standard'}
- Message Type: ${messageType}
- Additional Notes/Context: ${customNotes || 'None'}

Draft the exact message text below:`;

    if (!apiKey) {
      // Fallback/Mock Mode if API key is not set
      console.warn('No GOOGLE_GEMINI_API_KEY found. Using mock response.');
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate delay
      
      let mockMessage = '';
      if (messageType === 'Booking Confirmation') {
        mockMessage = `Hello ${guestName}! 👋\n\nWe are thrilled to confirm your upcoming stay with us for the dates: *${dates || 'TBD'}*. We have reserved our beautiful *${roomType || 'Standard'}* room for you.\n\nWe can't wait to welcome you! Let us know if you need any special arrangements prior to your arrival. ✨`;
      } else if (messageType === 'Payment Reminder') {
        mockMessage = `Hi ${guestName}, this is a gentle reminder regarding the pending payment for your upcoming stay (*${dates || 'TBD'}*). Please complete it at your earliest convenience to secure your *${roomType || 'Standard'}* room. Let us know if you need assistance! 💳`;
      } else if (messageType === 'Check-in Instructions') {
        mockMessage = `Welcome ${guestName}! 🏨\n\nFor your stay starting *${dates || 'soon'}*, our check-in time is at 3:00 PM. Please have your ID ready. We've prepared your *${roomType || 'Standard'}* room and it will be waiting for you.\n\nSafe travels and see you soon! 🚗`;
      } else {
        mockMessage = `Hi ${guestName}! We hope you had a wonderful stay with us in the *${roomType || 'Standard'}* room. We'd love to hear your feedback to help us improve. Have a safe journey home! 🌟`;
      }
      
      if (customNotes) {
        mockMessage += `\n\n(Note: ${customNotes})`;
      }

      return NextResponse.json({ message: mockMessage });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const result = await model.generateContent(systemPrompt);
    const responseText = result.response.text();

    return NextResponse.json({ message: responseText });
  } catch (error: any) {
    console.error('Error generating message:', error);
    return NextResponse.json(
      { error: 'Failed to generate message. ' + error.message },
      { status: 500 }
    );
  }
}
