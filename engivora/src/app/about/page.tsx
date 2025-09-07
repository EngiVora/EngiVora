"use client";

import React from "react";

const About: React.FC = () => {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">About Us</h1>
      <p className="mb-4">
        Welcome to <span className="font-semibold">Engivora</span>! We are a
        platform built to connect students, clubs, and communities by
        showcasing activities, upcoming events, and opportunities.
      </p>
      <p className="mb-4">
        Engivora is designed to help students with the latest{" "}
        <span className="font-semibold">internships, job opportunities, and
        college study notes</span>. Our mission is to support students in
        academics, career growth, and community involvement.
      </p>
      <p>
        Together, we aim to create a collaborative space where students can
        learn, share, and grow.
      </p>
    </div>
  );
};

export default About;
