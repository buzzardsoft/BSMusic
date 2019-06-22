import { S3 } from 'aws-sdk';
import { Readable } from 'stream';
import { config } from './config';

export class Bucket {
    private readonly s3: S3;

    constructor(private bucketName: string) {
        this.s3 = new S3();
    }

    // upload to a key in the S3 bucket. The body can be a stream
    public upload(key: string, body: S3.Body): Promise<string> {
        return new Promise((resolve: (value: string) => void, reject: (err: Error) => void) => {
            this.s3.upload({
                Body: body,
                Bucket: this.bucketName,
                Key: key
            }, (err: Error, data: S3.ManagedUpload.SendData): void => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data.Key);
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

    public delete(key: string): Promise<void> {
        return this.s3
            .deleteObject({
                Bucket: this.bucketName,
                Key: key
            })
            .promise()
            .then(() => {
                return Promise.resolve();
            })
            .catch((err: Error) => {
                return Promise.reject(err);
            });
    }
}
