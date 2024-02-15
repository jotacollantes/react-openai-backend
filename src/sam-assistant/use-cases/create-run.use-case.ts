import OpenAI from 'openai';

interface Options {
  threadId: string;
  assistantId?: string;
}

export const createRunUseCase = async (openai: OpenAI, options: Options) => {
  //assistantId es el id del assistent que se creo en platform.openai.com
  const { threadId, assistantId = 'asst_KXFM2Fyw03VUvX9IhwFYmraI' } = options;

  const run = await openai.beta.threads.runs.create(threadId, {
    assistant_id: assistantId,
    // instructions; // OJO! Sobre escribe el asistente
  });

  console.log({ run });

  return run;
};
