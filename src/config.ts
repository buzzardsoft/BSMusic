// tslint:disable-next-line: no-var-requires
require('dotenv').config();

export class Config {
    constructor(private configuration: any) {
    }

    public getS3BucketName(): string {
        return this.configuration.S3_BUCKET_NAME;
    }

    public getDatabaseHost(): string {
        return this.configuration.DATABASE_HOST;
    }

    public getDatabasePort(): number {
        return parseInt(this.configuration.DATABASE_HOST, 10);
    }

    public getDatabaseName(): string {
        return this.configuration.DATABASE_NAME;
    }

    public getDatabaseUsername(): string {
        return this.configuration.DATABASE_ADMIN_USERNAME;
    }

    public getDatabasePassword(): string {
        return this.configuration.DATABASE_ADMIN_PASSWORD;
    }
}

export const config = new Config(process.env);
