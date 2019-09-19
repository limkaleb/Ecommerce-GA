const multer = require('multer');
const path = require('path');
const Datauri = require('datauri');

const storage = multer.memoryStorage();
const dUri = new Datauri();

const upload = multer({
    storage: storage,
    limits: { fileSize: 100000 },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
});

function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb({ message: 'Only images allowed', status: 422 });
    }
}

const multerUploads = upload.single('image');

const dataUri = req => dUri.format(path.extname(req.file.originalname).toString(), req.file.buffer);

module.exports = { multerUploads, dataUri };