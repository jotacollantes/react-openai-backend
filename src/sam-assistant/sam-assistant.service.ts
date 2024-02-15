import { Injectable } from '@nestjs/common';

import OpenAI from 'openai';
import {
  checkCompleteStatusUseCase,
  createMessageUseCase,
  createRunUseCase,
  createThreadUseCase,
  getMessageListUseCase,
} from './use-cases';
import { QuestionDto } from './dtos/question.dto';

@Injectable()
export class SamAssistantService {
  private openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  async createThread() {
    return await createThreadUseCase(this.openai);
  }

  async userQuestion(questionDto: QuestionDto) {
    const { threadId, question } = questionDto;

    // const message = await createMessageUseCase(this.openai, {
    //   threadId,
    //   question,
    // });
    await createMessageUseCase(this.openai, {
      threadId,
      question,
    });
    const run = await createRunUseCase(this.openai, { threadId });

    await checkCompleteStatusUseCase(this.openai, {
      runId: run.id,
      threadId: threadId,
    });
    //Listamos todos los mensajes del Thread
    const messages = await getMessageListUseCase(this.openai, { threadId });

    return messages;
  }
}
