import * as fs from 'fs';
//import * as path from 'path';

import OpenAI from 'openai';
import { downloadBase64ImageAsPng, downloadImageAsPng } from 'src/helpers';

interface Options {
  prompt: string;
  originalImage?: string;
  maskImage?: string;
}

export const imageGenerationUseCase = async (
  openai: OpenAI,
  options: Options,
) => {
  const { prompt, originalImage, maskImage } = options;

  try {
    // Todo: verificar original image
    //SI solo viene prompt
    if (!originalImage || !maskImage) {
      console.log('entra por aqui 123');
      const response = await openai.images.generate({
        prompt: prompt,
        model: 'dall-e-2', //dall-e-3 no alcanzo la cuota
        n: 1, //numero de imagenes
        size: '1024x1024',
        quality: 'standard',
        response_format: 'url',
      });
      console.log(response.data[0].url);
      // Todo: guardar la imagen en FS. Tomamos la url como fileName para descargarla y guardarla en FS
      //downloadImageAsPng nos devuelve el nombre del archivo
      const fileName = await downloadImageAsPng(response.data[0].url);
      const url = `${process.env.SERVER_URL}/gpt/image-generation/${fileName}`;
      console.log(url);
      return {
        url: url,
        openAIUrl: response.data[0].url,
        revised_prompt: response.data[0].revised_prompt,
      };
    }

    //* originalImage=http://localhost:3000/gpt/image-generation/1703770602518.png
    //* maskImage=Base64;ASDKJhaskljdasdlfkjhasdkjlHLKJDASKLJdashlkdjAHSKLJDhALSKJD

    //!Si viene la imagen Original y la mascara es porque la quiere editar
    const pngImagePath = await downloadImageAsPng(originalImage, true);
    const maskPath = await downloadBase64ImageAsPng(maskImage, true);

    const response = await openai.images.edit({
      model: 'dall-e-2',
      prompt: prompt,
      image: fs.createReadStream(pngImagePath),
      mask: fs.createReadStream(maskPath),
      n: 1,
      size: '1024x1024',
      response_format: 'url',
    });
    //downloadImageAsPng nos devuelve el nombre del archivo
    const fileName = await downloadImageAsPng(response.data[0].url);
    const url = `${process.env.SERVER_URL}/gpt/image-generation/${fileName}`;

    return {
      url: url,
      openAIUrl: response.data[0].url,
      revised_prompt: response.data[0].revised_prompt,
    };
  } catch (error) {
    console.log(error);
  }
};
