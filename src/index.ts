import { result } from "lodash";
import { uploadImage } from "./uploadGoogleCloud";
var fs = require('fs');
var mammoth = require("mammoth");
const keyword = `src="data:image`;
const dataImg: any[]=[];
const arrLink: any[] = [];
import {unescape} from 'lodash';
const findBase64 = (data: string) => {
    const arr1 = data.split(keyword);
    arr1.forEach((item: string, index: number) => {
        if(index % 2 === 1) {
            const arr2 = item.split(`" />`);
            dataImg.push(`data:image${arr2[0]}`);
        }
    })
    uploadImage(dataImg[0])
}


var options = {
    convertImage: mammoth.images.imgElement(function(image: any) {
        return image.read("base64").then(async (imageBuffer) => {
            const dataStorage = `data:${image.contentType};base64,${imageBuffer}`;
            dataImg.push({dataBase64:dataStorage, src: await uploadImage(dataStorage).then((result) => result)});

            return {
                src: "data:" + image.contentType + ";base64,"+imageBuffer
            };
            
        });
    })
};
const processFileWord = () => {
    mammoth.convertToHtml({ path: "E://WorkSpace//Tool//detect-data-base64//src//test.docx" }, options)
     
    .then((result) => {
        setTimeout(() =>{
            var html = unescape(result.value); // The generated HTML
            var messages = result.messages; // Any messages, such as warnings during conversion
            dataImg.forEach((item) => {
                if(item.src.startsWith('http')){
                    html = html.replace(item.dataBase64, item.src);
                }
            })
            fs.appendFile('mynewfile1.txt', html, function (err) {
                if (err) throw err;
                console.log('Saved!');
            });
        }, 5000)
        // arrLink.forEach(item => {
            // html.replace(item.dataBase64, item.src);
        // })
    })
    .done();
}
processFileWord()