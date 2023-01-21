import multer, { StorageEngine } from 'multer';
import fs from "fs";

const maxSize = 0.5 * 1024 * 1024;

function diskstorage(): StorageEngine {
    return multer.diskStorage({
        destination: function (req, file, cb) {
            if (!fs.existsSync('./uploads')) {
                fs.mkdirSync('./uploads')
            }
            cb(null, './uploads');
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname);
        }
    });
}
const uploadStrategy = multer({
    storage: diskstorage()
}).array("images");

export { uploadStrategy };