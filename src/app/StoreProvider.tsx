"use client";
import { useRef } from "react";
import { Provider } from "react-redux";
import { makeStore, AppStore } from "../lib/store";
import { PersistGate } from "redux-persist/integration/react";
import { Persistor, persistStore } from "redux-persist";
import { createContext, useContext } from "react";
import { LoaderCircle } from "lucide-react";
const PersistorContext = createContext<any>(null);
export const usePersistor = () => useContext(PersistorContext);

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore>(null);
  const presistorRef = useRef<Persistor>(null);
  if (!storeRef.current) {
    storeRef.current = makeStore();
    presistorRef.current = persistStore(storeRef.current);
  }
  return (
    <Provider store={storeRef.current}>
      <PersistorContext.Provider value={presistorRef.current}>
        <PersistGate
          loading={
            <div className="bg-[var(--background)] noise h-screen w-screen flex justify-center items-center">
              <LoaderCircle
                className="animate-spin w-20 h-20"
                color="#000000"
              />
            </div>
          }
          persistor={presistorRef.current!}
        >
          {children}
        </PersistGate>
      </PersistorContext.Provider>
    </Provider>
  );
}
