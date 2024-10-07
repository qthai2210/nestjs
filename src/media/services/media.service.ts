import { Injectable } from '@nestjs/common';
import { MediaRepository } from '../repositories/media.repository';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { Types } from 'mongoose'; // Import from Mongoose
import { DeleteObjectCommand, GetObjectCommand, PutObjectAclCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

import { getSignedUrl } from '@aws-sdk/s3-request-presigner';



@Injectable()
export class MediaService {
    private readonly region;
    private readonly accessKeyId;
    private readonly secretAccessKey;
    private readonly publicBucketName;

    constructor(
        private readonly mediaRepository: MediaRepository,
        private readonly configService: ConfigService,
    ) {
        this.region = this.configService.get('AWS_REGION');
        this.accessKeyId = this.configService.get('AWS_ACCESS_KEY_ID');
        this.secretAccessKey = this.configService.get('AWS_SECRET_ACCESS_KEY');
        this.publicBucketName = this.configService.get('AWS_PUBLIC_BUCKET_NAME');
    }

    // getLinkMediaKey(media_key) {
    //     const s3 = this.getS3();
    //     return s3.getSignedUrl('getObject', {
    //         Key: media_key,
    //         Bucket: this.publicBucketName,
    //         Expires: 60 * 60 * 12,
    //     });


    // }
    async getLinkMediaKey(media_key: string): Promise<string> {
        const s3Client = this.getS3();
        const command = new GetObjectCommand({
            Bucket: this.publicBucketName,
            Key: media_key,
        });
        const url = await getSignedUrl(s3Client, command, { expiresIn: 60 * 60 * 12 });
        console.log(url);
        return url;
    }

    // async updateACL(media_id) {
    //     const media = await this.mediaRepository.findById(media_id);
    //     const s3 = this.getS3();

    //     s3.putObjectAcl(
    //         {
    //             Bucket: this.publicBucketName,
    //             Key: media.key,
    //             ACL: 'public-read',
    //         },
    //         // eslint-disable-next-line @typescript-eslint/no-empty-function
    //         (err, data) => { },
    //     );
    //     return (
    //         s3.endpoint.protocol +
    //         '//' +
    //         this.publicBucketName +
    //         '.' +
    //         s3.endpoint.hostname +
    //         '/' +
    //         media.key
    //     );
    // }
    async updateACL(media_id: string): Promise<string> {
        const media = await this.mediaRepository.findById(media_id);
        const s3Client = this.getS3();
        const command = new PutObjectAclCommand({
            Bucket: this.publicBucketName,
            Key: media.key,
            ACL: 'public-read',
        });

        try {
            await s3Client.send(command);
            return `https://${this.publicBucketName}.s3.${this.region}.amazonaws.com/${media.key}`;
        } catch (err) {
            // Handle error 
            console.error(err);
            throw err; // Or handle the error appropriately
        }
    }

    async upload(file) {
        const objectId = new Types.ObjectId();
        console.log(objectId._id);
        const arr_name = file.originalname.split('.');
        const extension = arr_name.pop();
        const name = arr_name.join('.');
        const key = objectId + '/' + this.slug(name) + '.' + extension;
        const data = {
            _id: objectId,
            name: name,
            file_name: String(file.originalname),
            mime_type: file.mimetype,
            size: file.size,
            key: key,
        };
        await this.uploadS3(file.buffer, key, file.mimetype);
        return await this.mediaRepository.create(data);
    }

    // async deleteFileS3(media_id) {
    //     const media = await this.mediaRepository.findById(media_id);
    //     const s3 = this.getS3();
    //     const params = {
    //         Bucket: this.publicBucketName,
    //         Key: media.key,
    //     };
    //     // eslint-disable-next-line @typescript-eslint/no-empty-function
    //     s3.deleteObject(params, (err, data) => { });
    //     //??
    //     await this.mediaRepository.deleteOne(media_id);

    //     return true;
    // }
    async deleteFileS3(media_id: string): Promise<boolean> {
        const media = await this.mediaRepository.findById(media_id);
        const s3Client = this.getS3();
        const command = new DeleteObjectCommand({
            Bucket: this.publicBucketName,
            Key: media.key,
        });

        try {
            await s3Client.send(command);
            await this.mediaRepository.deleteOne(media_id); // Assuming your deleteOne method takes the ID
            return true;
        } catch (err) {
            // Handle error
            console.error(err);
            return false; // Or throw an error
        }
    }

    // private async uploadS3(file_buffer, key, content_type) {
    //     const s3 = this.getS3();
    //     const params = {
    //         Bucket: this.publicBucketName,
    //         Key: key,
    //         Body: file_buffer,
    //         ContentType: content_type,
    //         ACL: 'public-read', // comment if private file
    //     };
    //     return new Promise((resolve, reject) => {
    //         s3.upload(params, (err, data) => {
    //             if (err) {
    //                 reject(err.message);
    //             }
    //             resolve(data);
    //         });
    //     });
    // }

    private async uploadS3(file_buffer: Buffer, key: string, content_type: string): Promise<any> {
        const s3Client = this.getS3();
        const command = new PutObjectCommand({
            Bucket: this.publicBucketName,
            Key: key,
            Body: file_buffer,
            ContentType: content_type,
            ACL: 'public-read',
        });

        try {
            const data = await s3Client.send(command);
            return data;
        } catch (err) {
            // Handle error
            console.error(err);
            throw err; // Or handle it differently

        }
    }

    private getS3() {
        // return new S3({
        //     region: this.region,
        //     accessKeyId: this.accessKeyId,
        //     secretAccessKey: this.secretAccessKey,
        // });
        return new S3Client({
            region: this.region,
            credentials: {
                accessKeyId: this.accessKeyId,
                secretAccessKey: this.secretAccessKey,
            },
        });

    }

    private slug(str) {
        str = str.replace(/^\s+|\s+$/g, ''); // trim
        str = str.toLowerCase();

        // remove accents, swap ñ for n, etc
        const from =
            'ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆĞÍÌÎÏİŇÑÓÖÒÔÕØŘŔŠŞŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇğíìîïıňñóöòôõøðřŕšşťúůüùûýÿžþÞĐđßÆa·/_,:;';
        const to =
            'AAAAAACCCDEEEEEEEEGIIIIINNOOOOOORRSSTUUUUUYYZaaaaaacccdeeeeeeeegiiiiinnooooooorrsstuuuuuyyzbBDdBAa------';
        for (let i = 0, l = from.length; i < l; i++) {
            str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
        }

        str = str
            .replace(/[^a-z0-9 -]/g, '') // remove invalid chars
            .replace(/\s+/g, '-') // collapse whitespace and replace by -
            .replace(/-+/g, '-'); // collapse dashes

        return str;
    }
}
