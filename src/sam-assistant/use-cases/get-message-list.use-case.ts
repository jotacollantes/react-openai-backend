import OpenAI from 'openai';

interface Options {
  threadId: string;
}

export const getMessageListUseCase = async (
  openai: OpenAI,
  options: Options,
) => {
  const { threadId } = options;
  //! Para obtener todos los mensajes del thread.
  const messageList = await openai.beta.threads.messages.list(threadId);
  console.log(messageList);

  const messages = messageList.data.map((message) => ({
    role: message.role,
    content: message.content.map((content) => (content as any).text.value),
  }));
  //devolvemos los mensajes con sus respectivos rol "user" | "assistant", usamos reverse para cambiar el orden a ascendente, la ultima pregunta hecha por el usuario y su respuestas seran los ultimos elementos del array[]
  return messages.reverse();
};
