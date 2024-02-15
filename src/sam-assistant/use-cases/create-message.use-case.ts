import OpenAI from 'openai';

interface Options {
  threadId: string;
  question: string;
}

export const createMessageUseCase = async (
  openai: OpenAI,
  options: Options,
) => {
  const { threadId, question } = options;
  //Se crea el mensaje en el thread
  const message = await openai.beta.threads.messages.create(threadId, {
    //EL body es con informacion es con la pregunta del usaurio por eso el rol es body
    role: 'user',
    content: question,
  });

  return message;
};
