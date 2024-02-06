import "./App.css";
import Home from "./Home/Home";
import { QueryClient, QueryClientProvider } from "react-query";
import { Toaster } from "react-hot-toast";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Home />
      <Toaster
        toastOptions={{
          style: {
            margin: "8px 10px !important",
          },
          error: {
            style: {
              background: "#f26262",
              color: "#fff",
            },
          },
        }}
      />
    </QueryClientProvider>
  );
}

export default App;
