'use client';

import { useState } from 'react';
import './contact.css';
import Link from 'next/link'; // For breadcrumb navigation
import { FaMapMarkerAlt, FaPhoneAlt, FaClock } from "react-icons/fa";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, subject, message } = formData;

    if (!name || !email || !subject || !message) {
      alert('Please fill in all fields.');
      return;
    }

    alert('Form submitted successfully!');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="shop-container">
      {/* Combined Header with Title + Breadcrumb */}
      <div className="category-header">
        <h1 className="category-title">Contact</h1>
        <nav className="breadcrumb">
          <Link href="/home">Home</Link> &gt; <span>Contact</span>
        </nav>
      </div>

      {/* Get in Touch Section */}
      <section className="category-section">
        <h2 className="section-title">Get In Touch With Us</h2>
        <p className="section-subtitle">
          For More Information About Our Product & Services. Please Feel Free To Drop Us An Email.<br />
          Our Staff Always Be There To Help You Out. Do Not Hesitate!
        </p>
      </section>

      {/* Contact Info and Form Section */}
      <div className="contact-section">
        {/* Contact Info FIRST */}
        <div className="contact-info-box">
          <div className="info-item">
            <FaMapMarkerAlt className="info-icon" />
            <div>
              <h4>Our Address</h4>
              <p>No. 14, USJ 10/1E, Subang UEP, 47620, Subang Jaya, Selangor</p>
            </div>
          </div>

          <div className="info-item">
            <FaPhoneAlt className="info-icon" />
            <div>
              <h4>Hotline</h4>
              <p>+(60) 12-3442 678</p>
            </div>
          </div>

          <div className="info-item">
            <FaClock className="info-icon" />
            <div>
              <h4>Working Hours</h4>
              <p>Mon - Fri: 9:00 AM - 22:00 PM</p>
              <p>Sat - Sun: 10:00 AM - 21:00 PM</p>
            </div>
          </div>
        </div>

        {/* Contact Form SECOND */}
        <form onSubmit={handleSubmit} className="contact-form">
          <label>Your name</label>
          <input
            type="text"
            name="name"
            placeholder="Abc"
            value={formData.name}
            onChange={handleChange}
          />

          <label>Email address</label>
          <input
            type="email"
            name="email"
            placeholder="Abc@def.com"
            value={formData.email}
            onChange={handleChange}
          />

          <label>Subject</label>
          <input
            type="text"
            name="subject"
            placeholder="This is an optional"
            value={formData.subject}
            onChange={handleChange}
          />

          <label>Message</label>
          <textarea
            name="message"
            placeholder="Hi! I'd like to ask about"
            value={formData.message}
            onChange={handleChange}
          ></textarea>

          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}