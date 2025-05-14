import React, { useState } from "react";
import { motion } from "framer-motion";

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 py-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full text-left font-medium text-gray-900 focus:outline-none"
      >
        <span>{question}</span>
        <span className="ml-6">
          {isOpen ? (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          )}
        </span>
      </button>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.3 }}
          className="mt-2 text-gray-600"
        >
          <p>{answer}</p>
        </motion.div>
      )}
    </div>
  );
};

const AboutPage = () => {
  const faqs = [
    {
      question: "How do I access my course materials?",
      answer: "After logging in, navigate to the Dashboard and select your course from the list. All course materials will be displayed in the Course Content section."
    },
    {
      question: "How do I submit assignments?",
      answer: "Navigate to the Assignments section of your course, select the assignment you want to submit, and use the upload function to attach your files. Then click the Submit button."
    },
    {
      question: "How can I communicate with my instructor?",
      answer: "You can send messages to your instructor through the Messaging feature or participate in course discussions in the Discussion Forum."
    },
    {
      question: "Can I access the LMS from my mobile device?",
      answer: "Yes, our LMS is fully responsive and can be accessed from any device with an internet connection including smartphones and tablets."
    },
    {
      question: "How do I check my grades?",
      answer: "Go to the Grades section in your dashboard to view all your grades across courses. For specific assignment grades, check within each course's grade section."
    },
    {
      question: "What do I do if I forget my password?",
      answer: "On the login page, click the 'Forgot Password' link and follow the instructions to reset your password via email."
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-center mb-8">About Our University LMS</h1>
        
        <div className="max-w-3xl mx-auto mb-12">
          <p className="text-lg mb-4">
            Our Learning Management System is designed to enhance the educational experience for students, 
            teachers, and administrators at our university. It provides a comprehensive platform for course 
            delivery, assignment submission, communication, and academic progress tracking.
          </p>
          <p className="text-lg mb-4">
            The system is built with modern technologies to ensure a seamless and efficient learning experience 
            across all devices. Our goal is to facilitate better communication between students and faculty,
            streamline administrative processes, and create an engaging learning environment.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
          <div className="bg-white rounded-lg shadow-md p-6">
            {faqs.map((faq, index) => (
              <FAQItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AboutPage; 