'use client';
import { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface ModalContextType {
  openModal: (content: ReactNode) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [modalContent, setModalContent] = useState<ReactNode | null>(null);

  useEffect(() => {
    if (modalContent) {
      const handleKeyPress = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          closeModal(); // Close modal on 'Esc' key press
        }
      };

      document.addEventListener('keydown', handleKeyPress);

      // Cleanup the event listener when the component unmounts or modalContent changes
      return () => {
        document.removeEventListener('keydown', handleKeyPress);
      };
    }
  }, [modalContent]);

  const openModal = (content: ReactNode) => setModalContent(content);
  const closeModal = () => setModalContent(null);
 
  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      {modalContent && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-black border border-black dark:border-green-400 rounded-lg shadow-lg p-6 max-w-xl relative">
            {modalContent}
            <span
              onClick={closeModal}
              className="absolute top-0 -mt-3 right-5 px-1 text-white bg-white dark:bg-black rounded cursor-pointer"
            >
              <span className="text-green-400">{"/Esc"}</span>
            </span>
          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};
