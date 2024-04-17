const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// Storage for Excel files
const excelStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});


// const pdfStorage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: "task-management-app",
//     format: async (req, file) => 'pdf', 
//   },
// });

const pdfStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./pdfuploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// Multer upload instances
const excelUpload = multer({ storage: excelStorage });
const pdfUpload = multer({ storage: pdfStorage });

module.exports = { excelUpload, pdfUpload };
