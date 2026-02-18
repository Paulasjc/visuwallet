// 1. Importamos el componente Input de Shadcn
import { Input } from "@/components/ui/input";


type FileUploadProps = {
    onFileSelected: (fileContent: string) => void;
}

// 2. Declaramos el componente. No necesita props por ahora.
export const FileUpload = ({onFileSelected}: FileUploadProps) => {

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
  // 3. Usamos 'return' para devolver el JSX
  return (
    <div>
      <label htmlFor="file-upload" className="font-bold">Sube tu archivo CSV:</label>
      <Input id="file-upload" type="file" accept=".csv" onChange={handleFileChange} />
    </div>
  );
};
