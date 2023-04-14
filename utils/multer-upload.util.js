// External Inputs
const multer = require('multer');
const path = require('path');

// renaming the uploaded file and defind it's storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/Uploads');
    },
    filename: (req, file, cb) => {
        const fileExt = path.extname(file.originalname);
        const fileName = `${file.originalname.replace(fileExt, '').toLowerCase().split(' ').join('-')}-${Date.now()}`;
        cb(null, fileName + fileExt);
    },
});

// prepare the multer upload object
const upload = multer({
    storage,
    limits: {
        fileSize: 1000000, // 1MB
    },
    fileFilter: (req, file, cb) => {
        if (file.fieldname === 'storyimage') {
            const fileExt = path.extname(file.originalname);

            if (fileExt === '.png' || fileExt === '.jpg') {
                cb(null, true);
            } else {
                cb(null, false);
            }
        }
    },
});

module.exports = upload;