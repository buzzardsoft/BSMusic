import Promise = require('bluebird');
import * as mm from 'music-metadata';

import { Bucket } from '../bucket';

/*
    We need a format that can be written to Postgres, which means excluding Buffer types.
        - mm.IPicture contains a buffer for artwork, with usage of IPicture that is optional
        - mm.IFormat contains an optional audioMD5 buffer

    In this file, we'll remove those values and transform them into the values we need for
    the database.
 */
export interface ISongExtractorPicture extends Omit<mm.IPicture, 'data'> {
    pictureKey: string;     // S3 bucket key for the song picture
}
export interface ISongExtractorMetadata extends mm.IAudioMetadata {
    pictures?: ISongExtractorPicture[];
    audioMD5String?: string;
}

export function extractSongMetadata(songKey: string, bucket: Bucket): Promise<ISongExtractorMetadata> {
    return Promise
        .resolve()      // map between native and Bluebird promises
        .then(() => {
            return mm.parseStream(bucket.getObjectStream(songKey));
        })
        .then((metadata: mm.IAudioMetadata): Promise<mm.IAudioMetadata> => {
            return Promise.resolve(metadata);
        })
        .then((metadata: mm.IAudioMetadata): Promise<ISongExtractorMetadata> => {
            const resultMetadata: ISongExtractorMetadata = metadata;

            if (resultMetadata.format.audioMD5) {
                resultMetadata.audioMD5String = resultMetadata.format.audioMD5.toString('hex');

                // copy all of the fields except for the audioMD5 buffer
                const oldFormat: mm.IFormat = resultMetadata.format;
                resultMetadata.format = {
                    container: oldFormat.container,
                    tagTypes: oldFormat.tagTypes,
                    duration: oldFormat.duration,
                    bitrate: oldFormat.bitrate,
                    sampleRate: oldFormat.sampleRate,
                    bitsPerSample: oldFormat.bitsPerSample,
                    tool: oldFormat.tool,
                    codec: oldFormat.codec,
                    codecProfile: oldFormat.codecProfile,
                    lossless: oldFormat.lossless,
                    numberOfChannels: oldFormat.numberOfChannels,
                    numberOfSamples: oldFormat.numberOfSamples,
                };
            }

            // TODO: loop through pictures, push picture data to S3, convert to ISongExtractorPicture, remove old
            // TODO: For now just throw out the picture data
            delete resultMetadata.common.picture;
            delete resultMetadata.native;

            return Promise.resolve(resultMetadata);
        });
}
