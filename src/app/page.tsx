'use client';

import { useState } from 'react';
import styles from './page.module.css';
import { 
  Bot, 
  Send, 
  User, 
  Calendar, 
  BedDouble, 
  MessageSquare, 
  FileText,
  Loader2,
  Hotel
} from 'lucide-react';

export default function Home() {
  const [formData, setFormData] = useState({
    guestName: '',
    dates: '',
    roomType: '',
    messageType: 'Booking Confirmation',
    customNotes: '',
  });

  const [generatedMessage, setGeneratedMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerate = async () => {
    if (!formData.guestName) {
      alert('Please enter a Guest Name.');
      return;
    }

    setIsGenerating(true);
    setGeneratedMessage('');

    try {
      const response = await fetch('/api/generate-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate message');
      }

      setGeneratedMessage(data.message);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendWhatsApp = () => {
    if (!generatedMessage) {
      alert('Generate a message first!');
      return;
    }
    // Encode the message for a WhatsApp URL
    const encodedMessage = encodeURIComponent(generatedMessage);
    // Open WhatsApp Web/App (without a specific number, it asks the user to choose a contact)
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <main className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            <Hotel className={styles.icon} size={32} color="var(--primary)" />
            AI Guest Message Generator
          </h1>
          <p className={styles.subtitle}>Draft professional WhatsApp messages for your guests instantly.</p>
        </div>

        {/* Left Side: Form */}
        <div className={styles.formSection}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>
              <User size={18} /> Guest Name
            </label>
            <input 
              type="text" 
              name="guestName"
              placeholder="e.g. John Doe" 
              className={styles.input}
              value={formData.guestName}
              onChange={handleInputChange}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>
              <Calendar size={18} /> Stay Dates
            </label>
            <input 
              type="text" 
              name="dates"
              placeholder="e.g. Oct 12 - Oct 15" 
              className={styles.input}
              value={formData.dates}
              onChange={handleInputChange}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>
              <BedDouble size={18} /> Room Type
            </label>
            <input 
              type="text" 
              name="roomType"
              placeholder="e.g. Deluxe Suite" 
              className={styles.input}
              value={formData.roomType}
              onChange={handleInputChange}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>
              <MessageSquare size={18} /> Message Type
            </label>
            <select 
              name="messageType"
              className={styles.select}
              value={formData.messageType}
              onChange={handleInputChange}
            >
              <option value="Booking Confirmation">Booking Confirmation</option>
              <option value="Payment Reminder">Payment Reminder</option>
              <option value="Check-in Instructions">Check-in Instructions</option>
              <option value="Feedback Request">Feedback Request</option>
            </select>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>
              <FileText size={18} /> Custom Notes (Optional)
            </label>
            <textarea 
              name="customNotes"
              placeholder="Any specific details to include? e.g. Early check-in requested, Anniversary trip" 
              className={styles.textarea}
              value={formData.customNotes}
              onChange={handleInputChange}
            />
          </div>

          <button 
            className={styles.button} 
            onClick={handleGenerate}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 size={20} className={styles.loadingIcon} /> Generating...
              </>
            ) : (
              <>
                <Bot size={20} /> Generate Message
              </>
            )}
          </button>
        </div>

        {/* Right Side: Preview */}
        <div className={styles.previewSection}>
          <label className={styles.label}>
            Message Preview & Editor
          </label>
          <textarea 
            className={styles.previewTextarea}
            value={generatedMessage}
            onChange={(e) => setGeneratedMessage(e.target.value)}
            placeholder="Your generated message will appear here. You can manually edit it before sending."
          />
          <button 
            className={styles.buttonSecondary}
            onClick={handleSendWhatsApp}
            disabled={!generatedMessage}
          >
            <Send size={20} /> Send via WhatsApp
          </button>
        </div>

      </div>
    </main>
  );
}
