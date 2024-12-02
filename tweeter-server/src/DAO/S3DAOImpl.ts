import { ObjectCannedACL, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

export class S3DAOImpl {
    async putImage(
        alias: string,
        imageStringBase64Encoded: string,
        iamgeFileExtention: string
    ): Promise<string> {
        let decodedImageBuffer: Buffer = Buffer.from(
            imageStringBase64Encoded,
            "base64"
        );

        const BUCKET = "jisu-tweeter-image-bucket";
        const REGION = "us-east-2";

        const s3Params = {
            Bucket: BUCKET,
            Key: "image/" + alias,
            Body: decodedImageBuffer,
            ContentType: `image/${iamgeFileExtention}`,
            ACL: ObjectCannedACL.public_read,
        };
        const c = new PutObjectCommand(s3Params);
        const client = new S3Client({ region: REGION });
        try {
            await client.send(c);
            return (
                `https://${BUCKET}.s3.${REGION}.amazonaws.com/image/${alias}`
            );
        } catch (error) {
            throw Error("s3 put image failed with: " + error);
        }
    }
}
