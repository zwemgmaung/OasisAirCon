import React from 'react';
import { SafeAreaView, View, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export default function App() {
  // PDF Data (Base64) ကို လက်ခံပြီး ဖုန်းထဲသိမ်းဆည်းတဲ့ Logic ပါ
  const handleMessage = async (event) => {
    const pdfData = event.nativeEvent.data;

    if (pdfData.startsWith('data:application/pdf;base64,')) {
      const base64Code = pdfData.replace('data:application/pdf;base64,', '');
      const filename = FileSystem.documentDirectory + "Oasis_Master_Report.pdf";

      try {
        // PDF ဖိုင်အဖြစ် ဖုန်းထဲ သိမ်းလိုက်ပါတယ်
        await FileSystem.writeAsStringAsync(filename, base64Code, {
          encoding: FileSystem.EncodingType.Base64,
        });

        // သိမ်းပြီးသားဖိုင်ကို Share/Open လုပ်ဖို့ ပြသပေးပါတယ်
        await Sharing.shareAsync(filename);
      } catch (error) {
        alert("PDF Save Error: " + error.message);
      }
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#28a745' }}>
      <WebView 
        source={{ uri: 'https://zwemgmaung.github.io/Oasis-AC-Service/dashboard.html' }} 
        onMessage={handleMessage} // ဒါလေးက Download အတွက် အသက်ပါ ကိုကို
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        renderLoading={() => (
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <ActivityIndicator size="large" color="#28a745" />
          </View>
        )}
      />
    </SafeAreaView>
  );
}
