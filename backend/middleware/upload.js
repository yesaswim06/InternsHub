const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload folders exist
const resumeDir = path.join(__dirname, '../uploads/resumes');
const logoDir = path.join(__dirname, '../uploads/logos');

if (!fs.existsSync(resumeDir)) {
  fs.mkdirSync(resumeDir, { recursive: true });
}
if (!fs.existsSync(logoDir)) {
  fs.mkdirSync(logoDir, { recursive: true });
}

// Storage configurations
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === 'resume') {
      cb(null, resumeDir);
    } else if (file.fieldname === 'logo') {
      cb(null, logoDir);
    } else {
      cb(new Error('Invalid field name'), null);
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

// File filter validations
const fileFilter = (req, file, cb) => {
  const fileExt = path.extname(file.originalname).toLowerCase();
  if (file.fieldname === 'resume') {
    if (file.mimetype === 'application/pdf' || fileExt === '.pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF documents are allowed for resumes!'), false);
    }
  } else if (file.fieldname === 'logo') {
    if (
      file.mimetype === 'image/jpeg' ||
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/webp' ||
      fileExt === '.jpg' ||
      fileExt === '.jpeg' ||
      fileExt === '.png' ||
      fileExt === '.webp'
    ) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, and WEBP images are allowed for logos!'), false);
    }
  } else {
    cb(new Error('Unexpected field'), false);
  }
};

// Create upload instances
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

module.exports = upload;
