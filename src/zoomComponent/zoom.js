import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import ZoomMtgEmbedded from "@zoom/meetingsdk/embedded";
import { generateSignature } from "./zoomService";

function Zoom({
  sdkKey,
  meetingNumber,
  password,
  userName,
  userEmail,
}) {
  const zoomContainerRef = useRef(null);
  const clientRef = useRef(null);
  const [connectionState, setConnectionState] = useState('initializing');
  const [error, setError] = useState(null);

  const logDebug = (message, data = {}) => {
    console.log(`[Zoom Debug] ${message}`, {
      timestamp: new Date().toISOString(),
      connectionState,
      ...data
    });
  };

  const logError = (message, err, additionalData = {}) => {
    // Ensure error is properly formatted
    const errorObj = err instanceof Error ? err : new Error(typeof err === 'string' ? err : 'Unknown error');

    console.error(`[Zoom Error] ${message}`, {
      timestamp: new Date().toISOString(),
      errorMessage: errorObj.message,
      errorName: errorObj.name,
      errorStack: errorObj.stack,
      // Include any custom Zoom error properties
      zoomErrorCode: err?.errorCode,
      zoomErrorMessage: err?.errorMessage,
      connectionState,
      ...additionalData
    });

    // Standardize error format before setting state
    setError({
      message: errorObj.message,
      name: errorObj.name,
      code: err?.errorCode,
      details: err?.errorMessage
    });
  };

  const validateProps = () => {
    const requiredProps = {
      sdkKey,
      meetingNumber,
      password,
      userName,
      userEmail
    };

    logDebug('Validating props', {
      hasProps: Object.entries(requiredProps).reduce((acc, [key, value]) => ({
        ...acc,
        [key]: !!value
      }), {})
    });

    Object.entries(requiredProps).forEach(([key, value]) => {
      if (!value) {
        throw new Error(`${key} is required`);
      }
    });
  };

  useEffect(() => {
    const initializeZoom = async () => {
      logDebug('Starting Zoom initialization', {
        meetingNumber,
        userName,
        userEmail,
        sdkKeyPresent: !!sdkKey
      });

      try {
        validateProps();

        const meetingSDKElement = document.getElementById("meetingSDKElement");
        if (!meetingSDKElement) {
          throw new Error('Meeting SDK element not found');
        }

        // Create client
        try {
          clientRef.current = ZoomMtgEmbedded.createClient();
          logDebug('Zoom client created successfully');
        } catch (clientError) {
          logError('Failed to create Zoom client', clientError);
          return;
        }

        // Initialize client
        try {
          await clientRef.current.init({
            zoomAppRoot: meetingSDKElement,
            language: "en-US",
          });
          logDebug('Zoom client initialized successfully');
          setConnectionState('initialized');
        } catch (initError) {
          logError('Failed to initialize Zoom client', initError);
          return;
        }

        // Generate signature
        let signature;
        try {
          signature = generateSignature(sdkKey, meetingNumber);
          logDebug('Signature generated successfully');
        } catch (signError) {
          logError('Failed to generate signature', signError);
          return;
        }

        // Join meeting
        try {
          logDebug('Attempting to join meeting');
          setConnectionState('joining');

          clientRef.current.join({
            sdkKey,
            signature,
            meetingNumber,
            password,
            userName,
            userEmail,
            success: (success) => {
              logDebug('Successfully joined meeting', { success });
              setConnectionState('connected');
            },
            error: (joinError) => {
              logError('Failed to join meeting', joinError);
              setConnectionState('error');
            }
          });

        } catch (joinError) {
          logError('Join meeting promise rejected', joinError);
        }

      } catch (error) {
        logError('General initialization error', error);
        setConnectionState('error');
      }
    };

    initializeZoom();

    return () => {
      logDebug('Starting cleanup');
      if (clientRef.current) {
        try {
          clientRef.current.leaveMeeting();
          logDebug('Successfully left meeting');
        } catch (error) {
          logError('Error during cleanup', error);
        }
      }
      setConnectionState('disconnected');
    };
  }, [sdkKey, meetingNumber, password, userName, userEmail]);

  return (
    <div
      id="meetingSDKElement"
      ref={zoomContainerRef}
      className="h-screen w-screen relative"
    >
      {connectionState === 'error' && error && (
        <div className="absolute top-0 left-0 right-0 bg-red-500 text-white p-2 text-center">
          {error.message || 'Failed to connect to meeting'}
          {error.code ? ` (Error ${error.code})` : ''}
        </div>
      )}
      <div className="absolute bottom-4 right-4 text-sm text-gray-500">
        Status: {connectionState}
      </div>
    </div>
  );
}

export default Zoom;