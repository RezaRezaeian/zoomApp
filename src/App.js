import "./App.css";
import Zoom from "./zoomComponent/zoom.js";
import Footer from "./textToSpeak/textToSpeak.js";
import Watermark from "./waterMark/waterMark.js";

function App() {
  return (
    <div className="App">
      <Zoom></Zoom>
      <Footer></Footer>
      <Watermark text="واترمارک شما" />
    </div>
  );
}

export default App;
