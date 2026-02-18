// src/components/dashboard/EmptyState.tsx

import { FileUpload } from "./FileUpload";

type EmptyStateProps = {
  onFileSelected: (fileContent: string) => void;
};

export const EmptyState = ({ onFileSelected }: EmptyStateProps) => {
  return (
    <main
      className="min-h-screen w-full flex flex-col justify-center items-center bg-[#975f78]"
      aria-label="Pantalla de bienvenida"
    >
      <div className="flex flex-col items-center rounded-3xl px-8">
        <section className="flex items-center gap-4" aria-labelledby="brand-heading">
          <img
            src="/visuwallet-icon-2.png"
            alt=""
            className="h-20 w-20 object-contain"
          />
          <div className="flex flex-col">
            <h1
              id="brand-heading"
              className="text-3xl font-medium tracking-widest uppercase text-[#f6eff3]"
            >
              VISUWALLET
            </h1>
            <p className="text-sm tracking-[0.2em] uppercase text-[#f6eff3] mt-0.5">
              VISUALIZA TUS FINANZAS
            </p>
            
          </div>
        </section>
        <section className="mt-8 flex justify-center" aria-label="Subir archivo">
          <FileUpload onFileSelected={onFileSelected} />
        </section>
      </div>
    </main>
  );
};
