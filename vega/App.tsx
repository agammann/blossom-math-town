import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { WebView } from '@amazon-devices/webview';

export const App = () => {
  const [error,setError]=React.useState(false);
  if(error){
    return <View style={styles.error}><Text style={styles.errorText}>Blossom could not open. Please restart the app.</Text></View>;
  }
  return (
    <View style={styles.container}>
      <WebView
        hasTVPreferredFocus={true}
        source={{uri:'file:///pkg/assets/blossom/tv.html'}}
        javaScriptEnabled={true}
        allowFileAccess={true}
        allowSystemKeyEvents={true}
        mediaPlaybackRequiresUserAction={false}
        onError={() => setError(true)}
        style={styles.webview}
      />
    </View>
  );
};

const styles=StyleSheet.create({
  container:{flex:1,backgroundColor:'#e9f4ff'},
  webview:{flex:1},
  error:{flex:1,alignItems:'center',justifyContent:'center',backgroundColor:'#e9f4ff'},
  errorText:{fontSize:28,color:'#212450',textAlign:'center'},
});
