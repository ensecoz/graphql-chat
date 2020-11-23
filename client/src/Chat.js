import React from 'react';
import { useQuery, useMutation, useSubscription } from '@apollo/react-hooks';
import { addMessageMutation, messagesQuery, messageAddedSubscription } from './graphql/queries';
import MessageInput from './MessageInput';
import MessageList from './MessageList';


function Chat({user}) { 

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

  const handleSend = async (text) => {
      // const message = {id: text, from : 'you', text};
      // setMessages(messages.concat(message));
      await addMessage({variables: {input: {text}}});
  };

  return (
    <section className="section">
      <div className="container">
        <h1 className="title">Chatting as {user}</h1>
        <MessageList user={user} messages={messages} />
        <MessageInput onSend={handleSend} />
      </div>
    </section>
  );
}

export default Chat;
