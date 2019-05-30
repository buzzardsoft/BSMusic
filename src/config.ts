// tslint:disable-next-line: no-var-requires
require('dotenv').config();

export class Config {
    constructor(private configuration: any) {
    }

    public getS3BucketName() {
        return this.configuration.S3_BUCKET_NAME;
    }
}

export const config = new Config(process.env);
