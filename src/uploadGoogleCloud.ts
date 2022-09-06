import { Storage } from "@google-cloud/storage";
import { configs } from "./config";
var mimeTypes = require('mimetypes');
const BUCKET_NAME = configs.gCloudStorage.bucket;
const BASE_FORDER = configs.gCloudStorage.baseFolder;


const storage = new Storage({
  projectId: configs.gCloudStorage.projectId,
  credentials: {
    type: "service_account",
    private_key: configs.gCloudStorage.privateKey.replace(/\\n/g, '\n'),
    client_email: configs.gCloudStorage.clientEmail,
    client_id: configs.gCloudStorage.clientId
  }
});

const uploadImage = (
  imageBuffer: string,
  _baseFolder = BASE_FORDER
): Promise<string> => {
  return new Promise((resolve, reject) => {
    var image = imageBuffer,
    //@ts-ignore
      mimeType = image.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/)[1],
      base64EncodedImageString = image.replace(/^data:image\/\w+;base64,/, ''),
      dataBuffer = new Buffer(base64EncodedImageString, 'base64');
    const bucket = storage.bucket(BUCKET_NAME);
    const filename = `${new Date().getTime().toString()}.${mimeTypes.detectExtension(mimeType)}`;
    const baseFolder = _baseFolder.endsWith('/') ? _baseFolder : `${_baseFolder}/`;
    const blob = bucket.file(baseFolder + filename);
    blob.save(dataBuffer, {
      metadata: { contentType: mimeType },
      public: true,
      validation: 'md5'
    }, function(error) {
  
        if (error) {
            console.log('Unable to upload the image.');
            console.log(error);
            resolve("err");
        }else{
          console.log('Uploaded');
          const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
          resolve(publicUrl);
        }
  
    });

  })
};

export { uploadImage }

