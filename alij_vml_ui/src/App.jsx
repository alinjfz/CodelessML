import "./output.css";
import CustomNavbar from "./components/CustomNavbar";
import LogisticRegression from "./components/LogisticRegression";

function App() {
  return (
    <div className="container mx-auto App">
      <CustomNavbar />
      <div className="w-full flex flex-col gap-4">
        <LogisticRegression />
      </div>
    </div>
  );
}

export default App;
