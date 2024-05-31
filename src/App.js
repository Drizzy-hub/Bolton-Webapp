import { Navigator } from "./navigation";
import { AuthenticatedUserProvider } from "./provider";


function App() {
  return (
    <AuthenticatedUserProvider>
<Navigator/>
</AuthenticatedUserProvider>
  );
}

export default App;
