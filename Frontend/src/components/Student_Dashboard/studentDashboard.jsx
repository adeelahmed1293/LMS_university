import React, { useState, useEffect } from "react";

const StudentSidebar = ({ onSelectMenu, onLogout }) => {
  const menuItems = [
    { label: "Enrolled Courses", key: "enrolledCourses" },
    { label: "Submit Assignments", key: "submitAssignments" },
    { label: "Grade Feedback", key: "gradeFeedback" },
    { label: "Take Quizzes", key: "takeQuizzes" },
    { label: "Request Extension", key: "requestExtension" },
    { label: "Performance Metrics", key: "performanceMetrics" },
    { label: "Logout", key: "logout" },
  ];

  return (
    <div className="fixed top-0 left-0 h-screen w-64 bg-white p-6 shadow-lg flex flex-col">
      <h2 className="text-lg font-semibold mb-6 text-blue-700">Student Panel</h2>
      <ul className="flex-grow space-y-4 overflow-auto">
        {menuItems.map(({ label, key }) => (
          <li key={key}>
            <button
              onClick={() => {
                if (key === "logout") {
                  onLogout();
                } else {
                  onSelectMenu(key);
                }
              }}
              className="w-full text-left px-4 py-3 rounded-md bg-blue-100 text-blue-800 font-medium hover:bg-blue-300 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};


const EnrolledCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
  fetch("http://localhost:3000/courses/student")  // change port to 3000
    .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    })
    .then((data) => {
      setCourses(data);
      setLoading(false);
    })
    .catch((err) => {
      setError(err.message);
      setLoading(false);
    });
}, []);

  if (loading) return <p>Loading courses...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Enrolled Courses</h3>
      <ul className="space-y-3">
        {courses.map((course) => (
          <li
            key={course._id}
            className="p-4 bg-blue-50 rounded-md shadow-sm hover:bg-blue-100 transition"
          >
            {course.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

const assignments = [
  {
    id: 1,
    title: "Assignment 1 - Linear Algebra",
    dueDate: "2025-05-20",
    submitted: false,
  },
  {
    id: 2,
    title: "Assignment 2 - Operating Systems",
    dueDate: "2025-05-22",
    submitted: true,
  },
];

const SubmitAssignments = () => {
  const handleFileUpload = (assignmentId) => {
    alert(`Uploading file for assignment ID: ${assignmentId}`);
    // Implement file upload logic here
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Submit Assignments</h3>
      <ul className="space-y-5">
        {assignments.map((assignment) => (
          <li
            key={assignment.id}
            className="p-5 bg-white rounded-md shadow-md flex flex-col gap-2"
          >
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-lg font-bold text-blue-700">
                  {assignment.title}
                </h4>
                <p className="text-sm text-gray-600">
                  Due: {assignment.dueDate}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  assignment.submitted
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {assignment.submitted ? "Submitted" : "Pending"}
              </span>
            </div>
            {!assignment.submitted && (
              <div>
                <input
                  type="file"
                  className="mb-2 block w-full text-sm text-gray-500"
                />
                <button
                  onClick={() => handleFileUpload(assignment.id)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Submit
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

const ViewAssignments = () => {
  const submittedAssignments = assignments.filter((a) => a.submitted);

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Submitted Assignments</h3>
      {submittedAssignments.length === 0 ? (
        <p className="text-gray-600">No assignments submitted yet.</p>
      ) : (
        <ul className="space-y-3">
          {submittedAssignments.map((a) => (
            <li
              key={a.id}
              className="p-4 bg-green-50 rounded-md shadow-sm border-l-4 border-green-400"
            >
              <div className="flex justify-between">
                <span>{a.title}</span>
                <span className="text-green-700 font-semibold">Submitted</span>
              </div>
              <p className="text-sm text-gray-500">Due: {a.dueDate}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const GradeFeedback = () => {
  const gradedAssignments = [
    {
      id: 1,
      course: "Linear Algebra",
      assignment: "Assignment 1",
      grade: "85%",
    },
    {
      id: 2,
      course: "Operating Systems",
      assignment: "Assignment 2",
      grade: "90%",
    },
  ];

  const [feedbacks, setFeedbacks] = useState({});

  const handleFeedbackChange = (id, value) => {
    setFeedbacks({ ...feedbacks, [id]: value });
  };

  const submitFeedback = (id) => {
    const message = feedbacks[id];
    if (!message) return alert("Please enter feedback before submitting.");
    alert(`Feedback for Assignment ID ${id}: ${message}`);
    // Implement actual submission logic here (e.g. API call)
    setFeedbacks({ ...feedbacks, [id]: "" });
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Grade Feedback</h3>
      <ul className="space-y-5">
        {gradedAssignments.map((item) => (
          <li
            key={item.id}
            className="p-5 bg-white rounded-md shadow-md flex flex-col gap-3"
          >
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-lg font-bold">{item.assignment}</h4>
                <p className="text-sm text-gray-500">
                  Course: {item.course}
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm">
                Grade: {item.grade}
              </span>
            </div>
            <textarea
              rows={3}
              value={feedbacks[item.id] || ""}
              onChange={(e) => handleFeedbackChange(item.id, e.target.value)}
              placeholder="Write your feedback here..."
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
            />
            <button
              onClick={() => submitFeedback(item.id)}
              className="self-end px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Submit Feedback
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

const TakeQuizzes = () => {
  const sampleQuizzes = [
    {
      id: 1,
      title: "Intro to Programming Quiz",
      questions: [
        {
          q: "What does HTML stand for?",
          options: ["HyperText Markup Language", "HighText Machine Language", "Hyperlink Markup Language", "None of the above"],
          answer: 0,
        },
        {
          q: "Which language is used for styling web pages?",
          options: ["HTML", "JQuery", "CSS", "XML"],
          answer: 2,
        },
      ],
    },
    {
      id: 2,
      title: "Database Basics",
      questions: [
        {
          q: "What does SQL stand for?",
          options: ["Stylish Question Language", "Structured Query Language", "Statement Question Language", "None"],
          answer: 1,
        },
      ],
    },
  ];

  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);

  const handleAnswerChange = (qIndex, optionIndex) => {
    setUserAnswers({ ...userAnswers, [qIndex]: optionIndex });
  };

  const submitQuiz = () => {
    setShowResult(true);
  };

  const calculateScore = () => {
    if (!selectedQuiz) return 0;
    return selectedQuiz.questions.reduce((score, q, idx) => {
      return score + (q.answer === userAnswers[idx] ? 1 : 0);
    }, 0);
  };

  if (!selectedQuiz) {
    return (
      <div>
        <h3 className="text-xl font-semibold mb-4">Available Quizzes</h3>
        <ul className="space-y-4">
          {sampleQuizzes.map((quiz) => (
            <li key={quiz.id} className="p-4 bg-white rounded shadow flex justify-between items-center">
              <div>
                <h4 className="text-lg font-bold">{quiz.title}</h4>
              </div>
              <button
                onClick={() => {
                  setSelectedQuiz(quiz);
                  setUserAnswers({});
                  setShowResult(false);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Take Quiz
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">{selectedQuiz.title}</h3>
      {selectedQuiz.questions.map((q, index) => (
        <div key={index} className="mb-6">
          <p className="font-medium">{index + 1}. {q.q}</p>
          <div className="mt-2 space-y-2">
            {q.options.map((opt, optIndex) => (
              <label key={optIndex} className="block">
                <input
                  type="radio"
                  name={`question-${index}`}
                  checked={userAnswers[index] === optIndex}
                  onChange={() => handleAnswerChange(index, optIndex)}
                  className="mr-2"
                />
                {opt}
              </label>
            ))}
          </div>
        </div>
      ))}

      {!showResult ? (
        <button
          onClick={submitQuiz}
          className="px-5 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Submit Quiz
        </button>
      ) : (
        <div className="mt-6 p-4 bg-green-50 rounded">
          <p className="text-lg font-semibold">
            You scored {calculateScore()} out of {selectedQuiz.questions.length}
          </p>
          <button
            className="mt-4 text-blue-600 underline"
            onClick={() => setSelectedQuiz(null)}
          >
            Back to Quiz List
          </button>
        </div>
      )}
    </div>
  );
};

const RequestExtension = () => {
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [proposedDate, setProposedDate] = useState("");
  const [reason, setReason] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const assignments = [
    { id: 1, title: "Math Assignment 1", dueDate: "2025-05-20" },
    { id: 2, title: "History Paper", dueDate: "2025-05-18" },
    { id: 3, title: "Computer Science Project", dueDate: "2025-05-25" },
  ];

  const handleSubmit = () => {
    if (!selectedAssignment || !proposedDate || !reason) {
      alert("Please fill in all fields.");
      return;
    }

    // Simulate successful submission
    setSuccessMsg(
      `Extension request for "${selectedAssignment.title}" submitted successfully!`
    );
    setSelectedAssignment(null);
    setProposedDate("");
    setReason("");
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Request Assignment Extension</h3>

      {successMsg && (
        <div className="p-4 bg-green-100 text-green-800 rounded">
          {successMsg}
        </div>
      )}

      <div>
        <label className="block font-medium mb-1">Select Assignment</label>
        <select
          value={selectedAssignment ? selectedAssignment.id : ""}
          onChange={(e) =>
            setSelectedAssignment(
              assignments.find((a) => a.id === parseInt(e.target.value))
            )
          }
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">-- Choose an assignment --</option>
          {assignments.map((a) => (
            <option key={a.id} value={a.id}>
              {a.title} (Due: {a.dueDate})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block font-medium mb-1">Proposed New Due Date</label>
        <input
          type="date"
          value={proposedDate}
          onChange={(e) => setProposedDate(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div>
        <label className="block font-medium mb-1">Reason for Extension</label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={4}
          className="w-full border px-3 py-2 rounded"
          placeholder="Explain why you need an extension..."
        />
      </div>

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
      >
        Submit Request
      </button>
    </div>
  );
};

const PerformanceMetrics = () => {
  const performanceData = [
    {
      course: "Mathematics",
      grade: 88,
      progress: 85,
    },
    {
      course: "History",
      grade: 76,
      progress: 72,
    },
    {
      course: "Computer Science",
      grade: 91,
      progress: 95,
    },
  ];

  const overallGrade = (
    performanceData.reduce((acc, cur) => acc + cur.grade, 0) /
    performanceData.length
  ).toFixed(1);

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Performance Metrics</h3>

      <div className="bg-gray-100 p-4 rounded shadow">
        <p className="text-lg font-medium">
          Overall Grade Average:{" "}
          <span className="text-blue-600 font-bold">{overallGrade}%</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {performanceData.map((item, index) => (
          <div
            key={index}
            className="border rounded p-4 shadow bg-white space-y-2"
          >
            <h4 className="text-lg font-semibold">{item.course}</h4>
            <div className="text-sm">
              Grade:{" "}
              <span className="font-medium text-green-700">{item.grade}%</span>
            </div>
            <div className="text-sm">
              Progress:{" "}
              <span className="font-medium text-purple-700">
                {item.progress}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded h-3">
              <div
                className="bg-blue-500 h-3 rounded"
                style={{ width: `${item.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};



// Placeholder components for other menu items
const Placeholder = ({ title }) => (
  <div>
    <h3 className="text-xl font-semibold mb-4">{title}</h3>
    <p>Content for {title} will go here.</p>
  </div>
);

const StudentDashboard = () => {
  const [selectedMenu, setSelectedMenu] = useState("enrolledCourses");

  const handleLogout = () => {
    alert("Logging out...");
    // Add logout logic here, e.g., clearing auth tokens, redirecting, etc.
  };

  const renderContent = () => {
    switch (selectedMenu) {
  case "enrolledCourses":
    return <EnrolledCourses />;
  case "submitAssignments":
    return <SubmitAssignments />;
  case "gradeFeedback":
    return <GradeFeedback />;
  case "takeQuizzes":
    return <TakeQuizzes />;
  case "requestExtension":
    return <RequestExtension />;
  case "performanceMetrics":
    return <PerformanceMetrics />;
  default:
    return null;
}

  };

  return (
    <div className="flex">
      <StudentSidebar onSelectMenu={setSelectedMenu} onLogout={handleLogout} />
      <main className="ml-64 flex-grow p-8 min-h-screen bg-gray-50">
        {renderContent()}
      </main>
    </div>
  );
};

export default StudentDashboard;
