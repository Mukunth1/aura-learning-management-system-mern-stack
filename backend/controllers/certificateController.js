import Certificate from '../models/Certificate.js';

// @desc    Get certificate by ID
// @route   GET /api/certificates/:id
// @access  Public
export const getCertificate = async (req, res, next) => {
  try {
    const { id } = req.params;

    let cert;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      cert = await Certificate.findById(id);
    } else {
      cert = await Certificate.findOne({ certificateId: id });
    }

    if (!cert) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found',
      });
    }

    await cert.populate('student', 'name email avatar');
    await cert.populate('instructor', 'name headline avatar');
    await cert.populate('course', 'title subtitle category thumbnail');

    res.status(200).json({
      success: true,
      certificate: cert,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify certificate legitimacy
// @route   GET /api/certificates/verify/:certificateId
// @access  Public
export const verifyCertificate = async (req, res, next) => {
  try {
    const { certificateId } = req.params;

    const cert = await Certificate.findOne({ certificateId })
      .populate('student', 'name email')
      .populate('instructor', 'name')
      .populate('course', 'title category');

    if (!cert) {
      return res.status(404).json({
        success: false,
        verified: false,
        message: 'No matching certificate found in the system registry',
      });
    }

    res.status(200).json({
      success: true,
      verified: true,
      message: 'Certificate is authentic and officially recognized',
      certificate: {
        certificateId: cert.certificateId,
        studentName: cert.student.name,
        courseTitle: cert.course.title,
        instructorName: cert.instructor.name,
        issueDate: cert.issueDate,
        grade: cert.grade,
      },
    });
  } catch (error) {
    next(error);
  }
};
