import * as path from 'path';
import * as fs from 'fs';

import OpenAI from 'openai';

interface Options {
  prompt: string;
  voice?: string;
}

export const textToAudioUseCase = async (
  openai: OpenAI,
  { prompt, voice }: Options,
) => {
  const voices = {
    nova: 'nova',
    alloy: 'alloy',
    echo: 'echo',
    fable: 'fable',
    onyx: 'onyx',
    shimmer: 'shimmer',
  };
  //Si no se encuentra se usa la voz de nova
  const selectedVoice = voices[voice] ?? 'nova';
  //__dirname es el directorio actual y retrocedemos 3 carpetas
  const folderPath = path.resolve(__dirname, '../../../generated/audios/');
  //Nombre del archivo del audio con su path.
  const speechFile = path.resolve(`${folderPath}/${new Date().getTime()}.mp3`);
  //Creamos la carpeta y sus subdirectorios
  fs.mkdirSync(folderPath, { recursive: true });
  //Generamos el audio desde openai
  const mp3 = await openai.audio.speech.create({
    //model: 'tts-1',
    model: 'tts-1-hd',
    voice: selectedVoice,
    input: prompt,
    response_format: 'mp3',
  });
  //Almacenamos la data del binario en la variable buffer que es la que usaremos para guardarla en el path speachFile
  const buffer = Buffer.from(await mp3.arrayBuffer());
  fs.writeFileSync(speechFile, buffer);
  //retornamos el path del archivo
  return speechFile;
};
