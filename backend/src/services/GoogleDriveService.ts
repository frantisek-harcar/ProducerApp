import { google } from 'googleapis';
import { Readable } from 'stream';
import * as path from 'path';
import env from "../util/validateEnv";

export class GoogleDriveService {
    static getAuth = () => {
        const auth = new google.auth.GoogleAuth({
            credentials: env.SERVICE_ACCOUNT,
            // keyFile: `${path.join(__dirname, './service-account.json')}`,
            scopes: 'https://www.googleapis.com/auth/drive',
        });
        return auth;
    };

    static getDriveService = () => {
        const auth = GoogleDriveService.getAuth();
        return google.drive({ version: "v3", auth })
    }

    static authenticateGoogle = () => {
        const auth = new google.auth.GoogleAuth({
            credentials: env.SERVICE_ACCOUNT,
            scopes: 'https://www.googleapis.com/auth/drive',
        });
        google.options({ auth });
        return google;
    };


    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static uploadToGoogleDrive = async (file: any) => {
        const auth = GoogleDriveService.getAuth();
        const fileMetadata = {
            name: file.originalname,
            parents: ["179H44ACnhbThp6Vu0PsQSp4q5R5fdpTz"],
        };
        const media = {
            mimeType: file.mimetype,
            body: GoogleDriveService.bufferToStream(file.buffer)
        };
        const driveService = google.drive({ version: "v3", auth });
        const response = await driveService.files.create({
            requestBody: fileMetadata,
            media: media,
            fields: 'id, webContentLink'
        });

        return response;
    };

    static bufferToStream(buffer: Buffer) {
        const stream = new Readable();
        stream.push(buffer);
        stream.push(null);

        return stream;
    }

    static getFilesList = async () => {
        const driveService = GoogleDriveService.getDriveService();
        const response = await driveService.files.list({
            pageSize: 15,
        });
        return response;
    }

    static downloadFile = async (realFileId: string) => {
        const auth = GoogleDriveService.getAuth()
        const service = google.drive({ version: 'v3', auth });

        const fileId = realFileId;
        try {
            const file = await service.files.get({
                fileId: fileId,
                fields: 'webViewLink, webContentLink',
            });
            return file.data;
        } catch (error) {
            // TODO(developer) - Handle error
            console.log(error)
        }
    }

    static deleteFile = async (realFileId: string) => {
        const auth = GoogleDriveService.getAuth()
        const service = google.drive({ version: 'v3', auth });

        const fileId = realFileId;

        try {
            const file = await service.files.delete({
                fileId: fileId,
            });
            return file.status;
        } catch (error) {
            // TODO(developer) - Handle error
            console.log(error)
        }
    };

}