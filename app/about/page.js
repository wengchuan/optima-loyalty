"use client";

import Head from 'next/head';
import Header from "../../components/Header"; // Adjusted path for app router
import './About.css';

export default function About() {
  return (
    <div className="about-container ">
      <Head>
        <title>About - Optima Loyalty</title>
        <meta name="description" content="Learn more about Optima Loyalty and our mission" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="main">
        <h1 className="title">About Us – Optima Loyalty</h1>
        <p className="description">
          Optima Loyalty is a customer-centric rewards platform based in Malaysia, dedicated to empowering users through point-based redemptions across a variety of technology and lifestyle products.
        </p>
        <p className="description">
          Inspired by regional leaders in financial innovation, Optima Loyalty blends technology, user experience, and data-driven insights to deliver a seamless loyalty experience.
        </p>
        <p className="description">
          With a strong foundation in digital engagement and a vision to support growing customer needs, Optima Loyalty aims to become a trusted rewards ecosystem in Malaysia and beyond.
        </p>
        <p className="description">
          Headquartered in Selangor, we are committed to enhancing value for every user through secure, intuitive, and rewarding interactions.
        </p>
      </main>
    </div>
  );
}