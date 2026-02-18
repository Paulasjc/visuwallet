// 1. Importamos el componente Input de Shadcn
import { Input } from "@/components/ui/input";
import { useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Upload } from 'lucide-react';


type FileUploadProps = {
  onFileSelected: (fileContent: string) => void;
}

// 2. Declaramos el componente. No necesita props por ahora.
export const FileUpload = ({ onFileSelected }: FileUploadProps) => {

  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; // Coge el primer archivo seleccionado

    if (file) {
      const reader = new FileReader(); // Crea un lector de archivos

      // Esto se ejecuta CUANDO el lector TERMINA de leer el archivo
      reader.onload = (e) => {
        const text = e.target?.result as string;
        // ¡Aquí tenemos el contenido del archivo como texto!
        // Ahora, usamos el "walkie-talkie" para avisar al padre
        onFileSelected(text);
      };

      // Le decimos al lector que empiece a leer el archivo como texto
      reader.readAsText(file);
    }
  };

  const handleButtonClick = () => {
    inputRef.current?.click(); // Llama al 'click' del input invisible
  };
  // 3. Usamos 'return' para devolver el JSX
  return (
    <div>
      {/* 6. El Input real: lo hacemos invisible con clases de Tailwind */}
      <Input
        ref={inputRef} // Conectamos la referencia
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="hidden" // ¡La clase mágica!
      />

      {/* Botón cuqui: redondeado, suave, coherente con la nueva paleta */}
      <Button
        onClick={handleButtonClick}
        variant="outline"
        className="rounded-full border-2 border-[#f6eff3] bg-transparent text-[#f6eff3] hover:bg-[#f6eff3]/10 hover:border-[#f6eff3] transition-colors shadow-sm px-6 py-5 text-sm font-medium"
      >
        <Upload className="mr-2 h-4 w-4" />
        Subir Archivo CSV
      </Button>
    </div>
  );
};
