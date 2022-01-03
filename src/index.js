import ReactDOM from "react-dom";
import App from "./App";
import { AuthContextProvider } from "./context/AuthContext";

ReactDOM.render(
<AuthContextProvider>
  <App/>
</AuthContextProvider>
, document.getElementById("root"));


export default ReactDOM ;