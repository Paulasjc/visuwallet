VisuWallet — Visualiza tus finanzas
VisuWallet es una aplicación de una sola página que permite visualizar movimientos bancarios a partir de un archivo CSV. El usuario sube su exportación (por ejemplo, de su banco), y la app muestra:
- Resumen: ingresos totales, gastos totales y balance neto en tarjetas.
- Tabla de transacciones con paginación (‹ › en el header), concepto truncado con tooltip y colores según signo del importe.
- Gráfico de tarta de gastos por categoría (Recharts), con etiquetas en dos líneas para evitar cortes de texto.
Aspectos técnicos:
- CSV flexible: detección automática de la fila de cabeceras y del delimitador (coma o punto y coma). Búsqueda de columnas Fecha / Concepto / Importe por palabras clave en varios idiomas (es, en, de, etc.). Formulario para corregir el mapeo si la detección falla.
Parsing robusto: normalización de importes (formato europeo y US, símbolos €/$), parsing de fechas (ISO, DD/MM/YYYY, MM/DD/YYYY) y limpieza de BOM.
Categorización: reglas por palabras clave en la descripción (Compras, Alimentación, Transporte, Ocio, Nómina, Otros Gastos).
Stack: React 19, TypeScript, Vite 7, Tailwind CSS 4, Recharts, PapaParse. UI con paleta propia, estados de carga/error y flujo “Subir otro archivo” sin salir del dashboard.
