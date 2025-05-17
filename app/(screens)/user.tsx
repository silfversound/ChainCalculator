import { ThemedText } from '@/components/ThemedText';
import Slider from '@react-native-community/slider';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { useAtom } from 'jotai';
import { useState } from 'react';
import { Dimensions, Platform, StyleSheet, View } from 'react-native';
import { Button } from '../../components/Button';
import { contentAtom, selectedNodeAtom } from '../atoms';

const SCREEN_HEIGHT = Dimensions.get('window').height;

type MeetingType = 'none' | 'virtual' | 'in-person';

interface Content {
  id: number;
  trust: number;
  risk: number;
  color: string;
  meetingType: MeetingType;
}

const getRiskColor = (value: number) => {
  if (value <= 30) return '#4CAF50'; // Green for low risk
  if (value <= 70) return '#FFC107'; // Yellow for medium risk
  return '#F44336'; // Red for high risk
};

const getRiskLevel = (value: number) => {
  if (value <= 30) return 'Low Risk';
  if (value <= 70) return 'Medium Risk';
  return 'High Risk';
};

export default function UserScreen() {
  const router = useRouter();
  const [selectedNode] = useAtom(selectedNodeAtom);
  const [content, setContent] = useAtom(contentAtom);
  const [originalTrust] = useState(content.trust); // Store the initial trust value

  const handleClose = () => {
    router.back();
  };

  const handleOpenChat = () => {
    router.push('/(screens)/chat');
  };

  const handleTrustChange = (value: number) => {
    const trustDrop = originalTrust - value;
    const dropPercentage = (trustDrop / originalTrust) * 100;

    if (dropPercentage > 25) {
      // If trust dropped more than 25%, set risk to 80
      setContent((prev: Content) => ({ ...prev, trust: value, risk: 80 }));
    } else {
      // Otherwise just update trust
      setContent((prev: Content) => ({ ...prev, trust: value }));
    }
  };

  const handleMeetingTypeChange = (value: MeetingType) => {
    setContent((prev: Content) => ({ ...prev, meetingType: value }));
    console.log(content);
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.container}>
        <View style={styles.handle} />
        <View style={styles.content}>
          
          <Button onPress={handleOpenChat} text="Open Chat" />
          <View style={styles.sliderContainer}>
            <ThemedText style={styles.sliderValue}>Trust Level: {Math.round(content.trust)}%</ThemedText>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={100}
              value={content.trust}
              onValueChange={handleTrustChange}
              minimumTrackTintColor="#007AFF"
              maximumTrackTintColor="#DEDEDE"
              thumbTintColor="#007AFF"
            />
          </View>

          <View style={styles.riskContainer}>
            <ThemedText style={styles.riskLabel}>Risk Level</ThemedText>
            <View style={styles.riskBarContainer}>
              <View style={[styles.riskBar, { backgroundColor: getRiskColor(10) }]} />
              <ThemedText style={styles.riskText}>{getRiskLevel(10)}</ThemedText>
            </View>
          </View>

          <View style={styles.pickerContainer}>
            <ThemedText style={styles.pickerLabel}>Meeting Type</ThemedText>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={content.meetingType}
                onValueChange={(itemValue) => handleMeetingTypeChange(itemValue as MeetingType)}
                style={styles.picker}
              >
                <Picker.Item label="None" value="none" />
                <Picker.Item label="Virtual" value="virtual" />
                <Picker.Item label="In Person" value="in-person" />
              </Picker>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    // backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#fff',
    height: SCREEN_HEIGHT * 0.7,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    // justifyContent: 'space-between',
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
  content: {
    // alignItems: 'center',
    gap: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  sliderContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 10,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  pickerContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 10,
  },
  pickerLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  pickerWrapper: {
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#F0F0F0',
    ...Platform.select({
      ios: {
        borderRadius: 10,
      },
    }),
  },
  picker: {
    width: '100%',
    ...Platform.select({
      android: {
        backgroundColor: '#F0F0F0',
      },
    }),
  },
  riskContainer: {
    width: '100%',
    gap: 8,
  },
  riskLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  riskBarContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 5,
  },
  riskBar: {
    width: '100%',
    height: 12,
    borderRadius: 6,
  },
  riskText: {
    fontSize: 14,
    fontWeight: '500',
  },
}); 