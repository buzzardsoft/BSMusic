import { S3 } from 'aws-sdk';
import { Readable } from 'stream';
import { config } from './config';

export class Bucket {
    private readonly s3: S3;

    constructor(private bucketName: string) {
        this.s3 = new S3();
    }

    // upload to a key in the S3 bucket. The body can be a stream
    public upload(key: string, body: S3.Body): Promise<S3.ManagedUpload.SendData> {
        return new Promise((resolve: (value: S3.ManagedUpload.SendData) => void, reject: (err: Error) => void) => {
            this.s3.upload({
                Body: body,
                Bucket: this.bucketName,
                Key: key
            }, (err: Error, data: S3.ManagedUpload.SendData): void => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }

    public getObjectStream(key: string): Readable {
        return this.s3.getObject({
            Bucket: this.bucketName,
            Key: key
        })
        .createReadStream();
    }
}

export const bucket = new Bucket(config.getS3BucketName());
