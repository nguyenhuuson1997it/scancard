import React, {useCallback, useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  View,
  TextInput,
} from 'react-native';
import Cardscan from 'react-native-cardscan';

const App = () => {
  const [compatible, setCompatible] = useState(null);
  const [card, setCard] = useState(null);
  const [recentAction, setRecentAction] = useState('none');

  const [inputNumberScan, setInputNumberScan] = useState(null);
  const [inputNameCard, setInputNameCard] = useState(null);
  const [inputExpiration, setInputExpiration] = useState(null);
  const [inputSecurity, setInputSecurity] = useState(null);

  const scanCard = useCallback(async () => {
    const {action, scanId, payload, canceledReason} = await Cardscan.scan();
    setRecentAction(action);
    if (action === 'scanned') {
      var issuer = payload.issuer || '??';
      if (issuer === 'MasterCard') {
        issuer = 'master-card';
      } else if (issuer === 'American Express') {
        issuer = 'american-express';
      } else {
        issuer = issuer.toLowerCase();
      }

      /* option default */
      setCard({
        number: payload.number,
        expiryDay: payload.expiryDay || '',
        expiryMonth: payload.expiryMonth || '??',
        expiryYear: payload.expiryYear || '??',
        issuer: issuer,
        cvc: payload.cvc || '??',
        cardholderName: payload.cardholderName || '??',
        error: payload.error || '',
      });

      /* data return */
      console.log('card info', payload);
      Alert.alert('Card Info', JSON.stringify(payload));

      /* set data */
      // setInputNumberScan(payload.number);
      // setInputNameCard(payload);
      // setInputExpiration(payload.expiryDay);
      // setInputSecurity(payload);
    }

    if (action === 'canceled') {
      if (canceledReason === 'enter_card_manually') {
        console.log('Enter card manually');
      }

      if (canceledReason === 'user_canceled') {
        console.log('User canceled scan');
      }

      if (canceledReason === 'camera_error') {
        console.log('Camera error during scan');
      }

      if (canceledReason === 'fatal_error') {
        console.log('Processing error during scan');
      }

      if (canceledReason === 'unknown') {
        console.log('Unknown reason for scan cancellation');
      }
    }
  }, [setCard, setRecentAction]);

  // check device is support
  const checkCompatible = useCallback(async () => {
    const isCompatible = await Cardscan.isSupportedAsync();
    setCompatible(isCompatible);
  }, [setCompatible]);

  useEffect(() => {
    checkCompatible();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.viewOnPress}>
        <TouchableOpacity style={styles.buttonOnPress} onPress={scanCard}>
          <Text style={styles.textOnpress}>Scan you card automatically</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.viewHorizontal}>
        <TextInput
          placeholder="Creadit card number"
          style={styles.inputNumberScan}
          value={inputNumberScan}
        />
        <TextInput
          placeholder="Name of the card holder"
          style={styles.inputNameCard}
          value={inputNameCard}
        />
      </View>
      <View style={styles.viewVertical}>
        <TextInput
          placeholder="Expiration date"
          style={styles.inputExpiration}
          value={inputExpiration}
        />
        <TextInput
          placeholder="Security code"
          style={styles.inputExpiration}
          value={inputSecurity}
        />
      </View>
      <View style={styles.viewContinute}>
        <TouchableOpacity style={styles.buttonContinute}>
          <Text style={styles.textContinute}>Continute</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
const textInput = {
  height: 50,
  backgroundColor: '#f1f1f1',
  borderWidth: 1,
  borderColor: '#9a9a9a',
  borderRadius: 20,
  marginTop: 10,
  paddingLeft: 10,
  textAlign: 'center',
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewHorizontal: {
    width: '80%',
  },
  viewVertical: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  viewOnPress: {
    width: '80%',
    height: 50,
    paddingBottom: '20%',
    textAlign: 'center',
  },
  buttonOnPress: {
    display: 'flex',
    textAlign: 'center',
    justifyContent: 'center',
    backgroundColor: '#dedede',
    borderRadius: 20,
    height: 50,
  },
  textOnpress: {
    textAlign: 'center',
    color: '#ffffff',
  },
  inputNumberScan: {
    ...textInput,
  },
  inputNameCard: {
    ...textInput,
  },
  inputExpiration: {
    ...textInput,
    width: '49%',
  },
  inputSecurity: {
    ...textInput,
    width: '49%',
  },
  viewContinute: {
    width: '80%',
    paddingTop: 10,
  },
  buttonContinute: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 50,
    backgroundColor: '#54dda8',
    borderRadius: 20,
  },
  textContinute: {
    color: '#ffffff',
  },
});
export default App;
