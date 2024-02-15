import OpenAI from 'openai';

interface Options {
  threadId: string;
  runId: string;
}

export const checkCompleteStatusUseCase = async (
  openai: OpenAI,
  options: Options,
) => {
  const { threadId, runId } = options;

  //Necesitamos el threadId y el run Id
  const runStatus = await openai.beta.threads.runs.retrieve(threadId, runId);

  console.log({ status: runStatus.status }); // ejecutamos hasta que estatus completed y una vez completado tendremos la respuesta en el listado de mensajes que esta en el thread.

  if (runStatus.status === 'completed') {
    //devolvemos el objeto
    return runStatus;
  }
  //! Si no se cumple la condicion de status===completed se vuelve a ejecutar de manera recursiva esta funcion (checkCompleteStatusUseCase)
  // Esperamos un segundo para que openAI no nos bloquee
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return await checkCompleteStatusUseCase(openai, options);
};
