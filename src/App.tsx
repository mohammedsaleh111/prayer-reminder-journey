
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./state/store";

// Pages
import Index from "./pages/Index";
import Tracker from "./pages/Tracker";
import Plans from "./pages/Plans";
import Progress from "./pages/Progress";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <BrowserRouter>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/tracker" element={<Tracker />} />
            <Route path="/plans" element={<Plans />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </QueryClientProvider>
    </Provider>
  </BrowserRouter>
);

export default App;
