import * as LocalAuthentication from 'expo-local-authentication';
import { useRouter } from 'expo-router';
import { useSetAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { isLoggedInAtom } from './atoms';

const PIN_CODE = '3333';

interface CalcButtonProps {
  onPress: () => void;
  text: string;
  isOperator?: boolean;
  isZero?: boolean;
}

const CalcButton = ({ onPress, text, isOperator = false, isZero = false }: CalcButtonProps) => (
  <TouchableOpacity 
    style={[
      styles.calcButton, 
      isOperator && styles.operatorButton,
      isZero && styles.zeroButton,
    ]} 
    onPress={onPress}
  >
    <Text style={[styles.calcButtonText, isOperator && styles.operatorText]}>
      {text}
    </Text>
  </TouchableOpacity>
);

export default function LoginScreen() {
  const router = useRouter();
  const setIsLoggedIn = useSetAtom(isLoggedInAtom);
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const [display, setDisplay] = useState('0');
  const [hasOperator, setHasOperator] = useState(false);
  const [firstNumber, setFirstNumber] = useState('');
  const [pinInput, setPinInput] = useState('');

  useEffect(() => {
    (async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      setIsBiometricSupported(compatible);
    })();
  }, []);

  const handleBiometricAuth = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to continue',
        fallbackLabel: 'Use passcode',
      });

      if (result.success) {
        setIsLoggedIn(true);
        router.replace('/(screens)/home');
      } else {
        Alert.alert('Authentication failed', 'Please try again');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred during authentication');
      console.error(error);
    }
  };

  const handleNumber = (num: string) => {
    if (display === '0' || hasOperator) {
      setDisplay(num);
      setHasOperator(false);
    } else {
      setDisplay(display + num);
    }

    // Handle PIN input
    const newPinInput = pinInput + num;
    setPinInput(newPinInput);
    
    if (newPinInput === PIN_CODE) {
      setPinInput('');
      handleBiometricAuth();
    }
    
    if (newPinInput.length >= 4) {
      setPinInput('');
    }
  };

  const handleOperator = (operator: string) => {
    if (operator === 'C') {
      setDisplay('0');
      setFirstNumber('');
      setHasOperator(false);
      setPinInput('');
      return;
    }

    if (operator === '=') {
      try {
        const result = eval(firstNumber + display);
        setDisplay(String(result));
        setFirstNumber('');
        setHasOperator(false);
      } catch (error) {
        setDisplay('Error');
      }
      return;
    }

    setFirstNumber(firstNumber + display + operator);
    setHasOperator(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.displayContainer}>
        <Text style={styles.displayText}>{display}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <View style={styles.row}>
          <CalcButton text="C" onPress={() => handleOperator('C')} isOperator />
          <CalcButton text="±" onPress={() => handleOperator('*-1')} isOperator />
          <CalcButton text="%" onPress={() => handleOperator('/100')} isOperator />
          <CalcButton text="÷" onPress={() => handleOperator('/')} isOperator />
        </View>
        <View style={styles.row}>
          <CalcButton text="7" onPress={() => handleNumber('7')} />
          <CalcButton text="8" onPress={() => handleNumber('8')} />
          <CalcButton text="9" onPress={() => handleNumber('9')} />
          <CalcButton text="×" onPress={() => handleOperator('*')} isOperator />
        </View>
        <View style={styles.row}>
          <CalcButton text="4" onPress={() => handleNumber('4')} />
          <CalcButton text="5" onPress={() => handleNumber('5')} />
          <CalcButton text="6" onPress={() => handleNumber('6')} />
          <CalcButton text="-" onPress={() => handleOperator('-')} isOperator />
        </View>
        <View style={styles.row}>
          <CalcButton text="1" onPress={() => handleNumber('1')} />
          <CalcButton text="2" onPress={() => handleNumber('2')} />
          <CalcButton text="3" onPress={() => handleNumber('3')} />
          <CalcButton text="+" onPress={() => handleOperator('+')} isOperator />
        </View>
        <View style={styles.row}>
          <CalcButton text="0" onPress={() => handleNumber('0')} isZero />
          <CalcButton text="." onPress={() => handleNumber('.')} />
          <CalcButton text="=" onPress={() => handleOperator('=')} isOperator />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
  },
  displayContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: 10,
  },
  displayText: {
    color: '#fff',
    fontSize: 70,
  },
  buttonContainer: {
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  calcButton: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: '#333333',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  zeroButton: {
    flex: 2.1,
    aspectRatio: undefined,
  },
  operatorButton: {
    backgroundColor: '#FF9F0A',
  },
  calcButtonText: {
    color: '#fff',
    fontSize: 34,
    fontWeight: '500',
  },
  operatorText: {
    color: '#fff',
  },
}); 