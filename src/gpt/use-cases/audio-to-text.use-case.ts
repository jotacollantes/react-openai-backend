import * as fs from 'fs';

import OpenAI from 'openai';

interface Options {
  prompt?: string;
  audioFile: Express.Multer.File;
}

export const audioToTextUseCase = async (openai: OpenAI, options: Options) => {
  const { prompt, audioFile } = options;

  console.log({ prompt, audioFile });

  const response = await openai.audio.transcriptions.create({
    model: 'whisper-1',
    //el archivo hay que enviarlo a AI como un stream
    file: fs.createReadStream(audioFile.path),
    prompt: prompt, // mismo idioma del audio aqui le decimos que al momento de generar el texto mantenga los puntos, signos ortograficos, expreciones como hummm, etc.
    language: 'es',
    // response_format: 'vtt', // 'srt',
    response_format: 'verbose_json',
  });

  return response;
};
