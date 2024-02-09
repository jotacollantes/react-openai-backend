import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  HttpStatus,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { diskStorage } from 'multer';

import { GptService } from './gpt.service';
import {
  OrthographyDto,
  ProsConsDiscusserDto,
  TextToAudioDto,
  TranslateDto,
  AudioToTextDto,
} from './dtos';

@Controller('gpt')
export class GptController {
  constructor(private readonly gptService: GptService) {}

  @Post('orthography-check')
  orthographyCheck(@Body() orthographyDto: OrthographyDto) {
    return this.gptService.orthographyCheck(orthographyDto);
  }

  @Post('pros-cons-discusser')
  prosConsDicusser(@Body() prosConsDiscusserDto: ProsConsDiscusserDto) {
    return this.gptService.prosConsDicusser(prosConsDiscusserDto);
  }

  @Post('pros-cons-discusser-stream')
  async prosConsDicusserStream(
    @Body() prosConsDiscusserDto: ProsConsDiscusserDto,
    @Res() res: Response,
  ) {
    const stream =
      await this.gptService.prosConsDicusserStream(prosConsDiscusserDto);

    res.setHeader('Content-Type', 'application/json');
    res.status(HttpStatus.OK);

    for await (const chunk of stream) {
      const piece = chunk.choices[0].delta.content || '';
      // console.log(piece);
      res.write(piece);
    }

    res.end();
  }

  @Post('translate')
  translateText(@Body() translateDto: TranslateDto) {
    return this.gptService.translateText(translateDto);
  }

  @Get('text-to-audio/:fileId')
  async textToAudioGetter(
    @Res() res: Response,
    @Param('fileId') fileId: string,
  ) {
    const filePath = await this.gptService.textToAudioGetter(fileId);

    res.setHeader('Content-Type', 'audio/mp3');
    res.status(HttpStatus.OK);
    res.sendFile(filePath);
  }

  @Post('text-to-audio')
  async textToAudio(
    @Body() textToAudioDto: TextToAudioDto,
    @Res() res: Response,
  ) {
    const filePath = await this.gptService.textToAudio(textToAudioDto);

    res.setHeader('Content-Type', 'audio/mp3');
    res.status(HttpStatus.OK);
    res.sendFile(filePath);
  }
  //Nombre del endpoint
  @Post('audio-to-text')
  //Creamos un interceptor para poder capturar el archivo y grabarlo localmente
  @UseInterceptors(
    FileInterceptor('file', {
      //Para grabar en disco usamos diskStorage de multer
      storage: diskStorage({
        destination: './generated/uploads',
        filename: (req, file, callback) => {
          //Para tomar la ultima porcion del arreglo usamos pop()
          const fileExtension = file.originalname.split('.').pop();
          const fileName = `${new Date().getTime()}.${fileExtension}`;
          //el primer argumento es un error
          return callback(null, fileName);
        },
      }),
    }),
  )
  //audioToText ya es el metodo del Endpoint
  async audioToText(
    //Decorador
    @UploadedFile(
      //Podemos aplicar validaciones
      new ParseFilePipe({
        //Arreglo de validaciones
        validators: [
          new MaxFileSizeValidator({
            maxSize: 1000 * 1024 * 5,
            message: 'File is bigger than 5 mb ',
          }),
          new FileTypeValidator({ fileType: 'audio/*' }),
        ],
      }),
    ) //file es el argumento
    file: Express.Multer.File,
    @Body() audioToTextDto: AudioToTextDto,
  ) {
    return this.gptService.audioToText(file, audioToTextDto);
  }
}
