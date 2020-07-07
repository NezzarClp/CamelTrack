import express from 'express';
import fs from 'fs';

export default function createCollectionRoute(multer) {
    const route = express.Router();

    route.post('/', multer.single('file'), (req, res) => {
        console.log('?', req.file);
        const fileName = `collection.db-${Date.now()}`;
        const filePath = `/root/CamelTrack/storage/collection/${fileName}`;

        fs.writeFileSync(filePath, req.file.buffer);

        res.send({ name: fileName });
    });

    return route;
};
