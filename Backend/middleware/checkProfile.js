const Hod = require('../schemas/Hod');
const Teacher = require('../schemas/Teacher');
const Student = require('../schemas/Student');

const checkProfile = async (req, res, next) => {
  try {
    const { role } = req.user;
    let profileComplete = false;

    if (role === 'HOD') {
      const hodProfile = await Hod.findOne({ userId: req.user.id });
      profileComplete = !!hodProfile && hodProfile.profileComplete;
    } else if (role === 'INSTRUCTOR') {
      const teacherProfile = await Teacher.findOne({ userId: req.user.id });
      profileComplete = !!teacherProfile && teacherProfile.profileComplete;
    } else if (role === 'STUDENT') {
      const studentProfile = await Student.findOne({ userId: req.user.id });
      profileComplete = !!studentProfile && studentProfile.profileComplete;
    }

    if (!profileComplete) {
      return res.status(403).json({ 
        message: 'Please complete your profile first',
        profileRequired: true
      });
    }

    next();
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = checkProfile; 