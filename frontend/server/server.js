const express = require('express');
const userRoutes = require('./src/users/routes');
const formRoutes = require('./src/form/formroutes');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const debug = require('debug')('app');
const app = express();
const port = 3000;

app.use(cors());
app.use(cookieParser());
app.use(express.json());


// Memastikan folder assets ada
const fs = require('fs');

debug('Starting Express application');
const assetsDir = 'src/assets/';
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// Penyimpanan file dengan multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, assetsDir); // Folder tempat gambar disimpan
  },
  filename: (req, file, cb) => {
    // Menentukan nama file berdasarkan timestamp
    cb(null, Date.now() + path.extname(file.originalname)); 
  }
});

// Validasi file yang di-upload (hanya gambar .jpg, .jpeg, .png)
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png/;
  const mimetype = filetypes.test(file.mimetype);
  
  if (mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG and PNG files are allowed.'));
  }
};

// Middleware untuk menerima file dengan Multer
const upload = multer({ storage: storage, fileFilter: fileFilter });

app.post('/presisi/upload', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }

    res.send({
      message: 'File uploaded successfully',
      file: req.file
    });
  } catch (error) {
    console.error('Error during file upload:', error);
    res.status(500).send('Internal server error');
  }
});

// Rute lainnya
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use('/presisi/user', userRoutes);
app.use('/presisi/form', formRoutes);

// Menyajikan file statis (gambar yang di-upload)
app.use('/assets', express.static(path.join(__dirname, 'src/assets')));

app.listen(port, () => console.log(`App listening on port ${port}`));