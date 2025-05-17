import { ThemedText } from '@/components/ThemedText';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Dimensions, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { Button } from '../../components/Button';

const SCREEN_HEIGHT = Dimensions.get('window').height;

interface Message {
  id: number;
  text: string;
  isSent: boolean;
}

export default function ChatScreen() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hello! How do you think get to heaven?", isSent: false }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleClose = () => {
    router.back();

  };

  const handleSend = () => {
    if (inputText.trim()) {
      // Add user message
      const userMessage: Message = {
        id: messages.length + 1,
        text: inputText.trim(),
        isSent: true,
      };
      
      setMessages(prev => [...prev, userMessage]);
      setInputText('');
      setIsTyping(true);

      // Add bot response after 2 seconds
      setTimeout(() => {
        const botMessage: Message = {
          id: messages.length + 2,
          text: "I agree, let's meet up to talk about this. ",
          isSent: false,
        };
        setMessages(prev => [...prev, botMessage]);
        setIsTyping(false);
      }, 2000);
    }
  };

  return (
    <View style={styles.overlay}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.handle} />
        <ThemedText type="title" style={styles.title}>Chat</ThemedText>
        
        <ScrollView style={styles.chatContainer} contentContainerStyle={styles.chatContent}>
          {messages.map((message) => (
            <View 
              key={message.id} 
              style={[
                styles.messageContainer,
                message.isSent ? styles.sentMessage : styles.receivedMessage
              ]}
            >
              <ThemedText style={[
                styles.messageText,
                message.isSent ? styles.sentMessageText : styles.receivedMessageText
              ]}>
                {message.text}
              </ThemedText>
            </View>
          ))}
          {isTyping && (
            <View style={[styles.messageContainer, styles.receivedMessage]}>
              <ThemedText style={[styles.messageText, styles.receivedMessageText]}>
                Typing...
              </ThemedText>
            </View>
          )}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type a message..."
            placeholderTextColor="#666"
            multiline
          />
          <Button onPress={handleSend} text="Send" />
        </View>
        
        <Button onPress={handleClose} text="Close" />
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    // justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#fff',
    height: SCREEN_HEIGHT ,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    justifyContent: 'space-between',
    ...Platform.select({
      android: {
        elevation: 5,
      },
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: -3,
        },
        shadowOpacity: 0.3,
        shadowRadius: 3,
      },
    }),
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#DEDEDE',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  chatContainer: {
    flex: 1,
    marginBottom: 15,
  },
  chatContent: {
    gap: 10,
    paddingBottom: 10,
  },
  messageContainer: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
  },
  sentMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
  },
  receivedMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#E8E8E8',
  },
  messageText: {
    fontSize: 16,
  },
  sentMessageText: {
    color: '#fff',
  },
  receivedMessageText: {
    color: '#000',
  },
  inputContainer: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  input: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    maxHeight: 100,
  },
}); 