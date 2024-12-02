export interface S3DAO {
    putImage(alias: string, imageStringBase64Encoded: string, iamgeFileExtention: string):string;
}