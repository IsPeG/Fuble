import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import LoadingScreen from "./components/ui/LoadingScreen/LoadingScreen";

const App = React.lazy(() => import("./App"));

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.Suspense fallback={<LoadingScreen />}>
    {/* Problems with strictmode: */}
    {/* 1- E and Q keys fire the onClick function twice */}
    {/* <StrictMode> */}
    <App />
    {/* </StrictMode> */}
  </React.Suspense>
);
