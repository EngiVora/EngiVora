"use client";

import React from "react";

const Counselling: React.FC = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <h1 className="text-3xl font-bold mb-4">Career Counselling</h1>
      <p className="text-lg text-muted-foreground mb-6">
        Choosing the right career path can be confusing. At 
        <span className="font-semibold"> Engivora</span>, we help students 
        explore opportunities, gain clarity, and make informed decisions for 
        a brighter future.
      </p>

      {/* Why Career Counselling */}
      <h2 className="text-2xl font-semibold mb-3">Why Career Counselling?</h2>
      <p className="mb-4">
        Career counselling provides guidance to students who are uncertain 
        about their career options. Whether it’s higher education, government 
        jobs, private sector, or entrepreneurship, counselling helps you 
        choose the right path according to your skills and interests.
      </p>

      {/* Services */}
      <h2 className="text-2xl font-semibold mb-3">Our Guidance Includes</h2>
      <ul className="list-disc pl-6 space-y-2 mb-6">
        <li>Guidance for competitive exams (GATE, SSC, CAT, UPSC, etc.)</li>
        <li>Advice on higher studies (M.Tech, MBA, and abroad education)</li>
        <li>Job preparation for IT, Core Engineering, and Government sectors</li>
        <li>Skill development: Coding, Communication, AI/ML, Web Development</li>
        <li>Internship and placement support</li>
      </ul>

      {/* Benefits */}
      <h2 className="text-2xl font-semibold mb-3">Benefits of Career Counselling</h2>
      <ul className="list-disc pl-6 space-y-2 mb-6">
        <li>Clear understanding of career goals</li>
        <li>Personalized roadmap based on your strengths</li>
        <li>Access to resources and study material</li>
        <li>Boost in confidence and motivation</li>
      </ul>

      {/* Call to Action */}
      <div className="bg-blue-50 p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-2">Need Guidance?</h3>
        <p className="mb-4">
          Our mentors are here to support you in making the right career 
          decisions. Connect with us today and start your journey towards 
          success.
        </p>
        <a
          href= "https://mail.google.com/mail/?view=cm&fs=1&to=help.engivora@gmail.com"
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Contact Us
        </a>
      </div>
    </div>
  );
};

export default Counselling;
