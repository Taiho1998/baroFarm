import { RouterProvider } from "react-router-dom";
import { Suspense } from "react";
import router from "@/routes";
import { HelmetProvider } from "react-helmet-async";

import Spinner from "@components/Spinner";
import { Slide, ToastContainer } from "react-toastify";
function App() {
  return (
    <>
      <HelmetProvider>
        <Suspense fallback={<Spinner />}>
          <RouterProvider
            router={router}
            future={{ v7_startTransition: true }}
          />
          <ToastContainer
            position="top-center"
            hideProgressBar={true}
            autoClose={2500}
            closeOnClick={true}
            theme="light"
            transition={Slide}
          />
        </Suspense>
      </HelmetProvider>
    </>
  );
}

export default App;
