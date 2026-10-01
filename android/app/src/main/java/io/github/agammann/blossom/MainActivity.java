package io.github.agammann.blossom;

import com.getcapacitor.BridgeActivity;
import android.os.Bundle;
import androidx.activity.OnBackPressedCallback;

public class MainActivity extends BridgeActivity {
    @Override
    public void onPause() {
        if (getBridge() != null && getBridge().getWebView() != null) {
            // Explicitly cancel the shared narration/lesson flow before the WebView pauses.
            getBridge().getWebView().evaluateJavascript("window.dispatchEvent(new Event('pagehide'));", null);
        }
        super.onPause();
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                // Hash routes stay inside one WebView document. Handle them before exiting.
                getBridge().getWebView().evaluateJavascript(
                    "(function(){var dialog=document.querySelector('dialog[open]');" +
                    "if(dialog){dialog.close();return true;}" +
                    "if(location.hash&&location.hash!=='#'){location.hash='';return true;}" +
                    "return false;})()",
                    handled -> {
                        if (!"true".equals(handled)) {
                            setEnabled(false);
                            getOnBackPressedDispatcher().onBackPressed();
                            setEnabled(true);
                        }
                    }
                );
            }
        });
    }
}
