import { useQuery, useMutation, useSubscription } from '@apollo/react-hooks';
import { addMessageMutation, messagesQuery, messageAddedSubscription } from './graphql/queries';

export function useChatMessages() {

  const {data} = useQuery(messagesQuery);
  const messages = data ? data.messages : [];

  const [addMessage] = useMutation(addMessageMutation);

  useSubscription(messageAddedSubscription, {
    onSubscriptionData: ({client, subscriptionData}) => {
      client.writeData({data: {
        messages: messages.concat(subscriptionData.data.messageAdded)
      }});
    }
  });

  // const [messages, setMessages] = useState([]);

  return {
    messages,
    addMessage: (text) => addMessage({variables: {input: {text}}}),
  };

}