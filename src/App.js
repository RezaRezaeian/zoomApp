import "./App.css";
import Zoom from "./zoomComponent/zoom.js";
import Footer from "./textToSpeak/textToSpeak.js";
import Watermark from "./waterMark/waterMark.js";

function App() {
  return (
    <div className="App">
      <Zoom
        sdkKey={process.env.REACT_APP_ZOOM_SDK_KEY}
        meetingNumber="6849586348"
        password="123456"
        userName="Rezmx"
        userEmail="rreza.rezaeiann@gmail.com"
      />
      {/* <Footer></Footer> */}
      {/* <Watermark text="واترمارک شما" /> */}
    </div>
  );
}

export default App;
