import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export const HeroSection = () => {
  return (
    <div className="bg-gradient-to-r from-blue-700 to-purple-800 text-white py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                University Learning Management System
              </h1>
              <p className="text-xl mb-8">
                Empowering education through technology. Connect, learn, and succeed
                with our comprehensive learning platform.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/login"
                  className="bg-white text-blue-700 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition duration-300"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="bg-transparent border-2 border-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-blue-700 transition duration-300"
                >
                  Sign Up
                </Link>
              </div>
            </motion.div>
          </div>
          <div className="md:w-1/2">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="bg-white/10 backdrop-blur-sm p-6 rounded-xl shadow-2xl"
            >
              <img
                src="https://img.freepik.com/free-vector/online-learning-isometric-concept_1284-17947.jpg"
                alt="LMS Dashboard"
                className="rounded-lg w-full"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const FeaturesSection = () => {
  const features = [
    {
      title: "Course Management",
      description: "Easily manage courses, assignments, and educational resources in one place.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
    {
      title: "Student Tracking",
      description: "Monitor student progress, attendance, and performance with comprehensive analytics.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      title: "Communication Tools",
      description: "Foster collaboration with integrated messaging, forums, and announcement features.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
        </svg>
      ),
    },
    {
      title: "Assessment Tools",
      description: "Create diverse assessments with automatic grading and detailed feedback systems.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
    },
    {
      title: "Mobile Access",
      description: "Access the platform anytime, anywhere with our responsive design and mobile application.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      title: "Role-Based Access",
      description: "Customize access for students, faculty, and administrators with role-specific interfaces.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Features Designed for Modern Education
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our platform provides powerful tools to enhance teaching and learning experiences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition duration-300"
            >
              <div className="text-blue-600 mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const TestimonialSection = () => {
  const testimonials = [
    {
      quote: "The LMS has revolutionized how I manage my courses and interact with students. The interface is intuitive and the features are comprehensive.",
      name: "Dr. Sarah Johnson",
      role: "Professor of Computer Science",
      avatar: "https://randomuser.me/api/portraits/women/1.jpg",
    },
    {
      quote: "As a student, I appreciate how organized all my course materials are. The mobile access makes it easy to keep up with my studies even when I'm on the go.",
      name: "Michael Chen",
      role: "Computer Science Student",
      avatar: "https://randomuser.me/api/portraits/men/2.jpg",
    },
    {
      quote: "The analytics and reporting features have been invaluable for tracking department performance and making data-driven decisions.",
      name: "Dr. Emily Davis",
      role: "Head of Engineering Department",
      avatar: "https://randomuser.me/api/portraits/women/3.jpg",
    },
  ];

  return (
    <div className="py-20 bg-blue-700 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Hear from the educators and students who use our platform every day.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="bg-white/10 backdrop-blur-sm p-8 rounded-xl"
            >
              <div className="mb-6">
                <svg className="h-10 w-10 text-blue-300" fill="currentColor" viewBox="0 0 32 32">
                  <path d="M10 8c-2.2 0-4 1.8-4 4v12h12V12c0-2.2-1.8-4-4-4h-4zm16 0c-2.2 0-4 1.8-4 4v12h12V12c0-2.2-1.8-4-4-4h-4z"></path>
                </svg>
              </div>
              <p className="text-lg mb-6">{testimonial.quote}</p>
              <div className="flex items-center">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <p className="text-blue-200">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const FAQSection = () => {
  const faqs = [
    {
      question: "How do I get started with the LMS?",
      answer: "Simply sign up using your university email address and verification code provided by your institution. After registering, you can access all features based on your role (student, teacher, or administrator)."
    },
    {
      question: "Is training available for new users?",
      answer: "Yes, we provide comprehensive training resources including video tutorials, documentation, and live webinars for all user roles."
    },
    {
      question: "Can I access the LMS on mobile devices?",
      answer: "Absolutely! Our platform is fully responsive and works on all devices. We also offer dedicated mobile apps for iOS and Android."
    },
    {
      question: "How secure is the platform?",
      answer: "We implement industry-standard security protocols including encrypted data transmission, regular security audits, and strict access controls to protect all user data."
    }
  ];

  return (
    <div className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get answers to common questions about our platform.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="mb-6 bg-white rounded-lg shadow-md overflow-hidden"
            >
              <details className="group">
                <summary className="flex justify-between items-center font-medium cursor-pointer p-6">
                  <span>{faq.question}</span>
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" width="24" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </summary>
                <div className="p-6 pt-0 text-gray-600">
                  <p>{faq.answer}</p>
                </div>
              </details>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/about"
            className="text-blue-600 font-medium hover:text-blue-800 inline-flex items-center"
          >
            View all FAQs
            <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export const CTASection = () => {
  return (
    <div className="py-16 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Learning Experience?</h2>
        <p className="text-xl mb-8 max-w-3xl mx-auto">
          Join thousands of students and educators who are enhancing their teaching and learning through our platform.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/signup"
            className="bg-white text-blue-700 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition duration-300"
          >
            Get Started Today
          </Link>
          <Link
            to="/about"
            className="bg-transparent border-2 border-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-blue-700 transition duration-300"
          >
            Learn More
          </Link>
        </div>
      </div>
    </div>
  );
};

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">University LMS</h3>
            <p className="text-gray-400">
              Empowering education through innovative technology solutions.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition">Help Center</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Documentation</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Tutorials</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Webinars</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-400 hover:text-white transition">About</Link></li>
              <li><Link to="/login" className="text-gray-400 hover:text-white transition">Login</Link></li>
              <li><Link to="/signup" className="text-gray-400 hover:text-white transition">Sign Up</Link></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Contact Us</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Connect With Us</h4>
            <div className="flex space-x-4 mb-4">
              <a href="#" className="text-gray-400 hover:text-white transition">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-6h2v6zm-1-6.75c-.69 0-1.25-.56-1.25-1.25s.56-1.25 1.25-1.25 1.25.56 1.25 1.25-.56 1.25-1.25 1.25zM17 15h-2v-2.5c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5V15h-2v-6h2v1.1c.52-.7 1.37-1.1 2.25-1.1 1.65 0 3 1.35 3 3v3z" />
                </svg>
              </a>
            </div>
            <p className="text-gray-400">
              © {new Date().getFullYear()} University LMS. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}; 