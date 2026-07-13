📋 Resumen del Proyecto

CronosFechas es una aplicación web nativa (Single Page Application - SPA) diseñada bajo el paradigma de Vanilla JavaScript modular (ES6). Su objetivo es centralizar fechas y eventos importantes extraídos de un archivo estructurado (fechas.json), procesar dinámicamente el tiempo transcurrido o restante en tiempo real, y ofrecer tres tipos de visualizaciones interactivas de forma simultánea:

1. Vista de Tarjetas/Fila: Organizada por grupos colapsables (acordeones) con soporte para vista normal y vista de lista compacta en rejilla (CSS Grid).
2. Línea Temporal (Timeline): Un recorrido histórico ordenado cronológicamente con un selector de dirección exclusivo.
3. Calendario Mensual: Una representación visual interactiva en cuadrícula para ubicar los eventos en los días del mes actual.

La aplicación es completamente autogestionada: no requiere de bases de datos externas pesadas y utiliza LocalStorage para recordar las preferencias del usuario (tema, estado de los acordeones, tipo de vista, búsquedas y ordenación del timeline).


📂 Estructura de Directorios del ProyectoEl proyecto está organizado de manera limpia y modular, separando la lógica de datos, los controladores de interfaz y los estilos:

Fechas/
│
├── index.html              # Estructura e interfaz esqueleto de la aplicación
├── fechas.json             # Base de datos local (Grupos y Eventos)
├── README.md               # Instrucciones de despliegue y desarrollo
│
├── css/                    # Estilos CSS segmentados por componentes
│   ├── variables.css       # Paleta de colores, fuentes, variables y CSS Custom Properties
│   ├── base.css            # Estilos globales, reset y Navbar (fijo/sticky)
│   ├── cards.css           # Diseño de tarjetas (normal) y rejilla Grid (vista lista compacta)
│   ├── accordion.css       # Comportamiento visual de los grupos colapsables
│   ├── timeline.css        # Estilos de la línea de tiempo (nodos y conectores)
│   ├── forms.css           # Inputs, selectores, botones y cuadrícula del calendario
│   ├── dark.css            # Sobreescritura de variables de color para el Modo Oscuro
│   └── responsive.css      # Reglas @media para visualización óptima en móviles y tablets
│
└── js/                     # Lógica modular de JavaScript (ES6 Modules)
    ├── app.js              # Orquestador y punto de entrada (Bootstrapper)
    ├── storage.js          # Utilidad wrapper para leer y escribir en LocalStorage
    ├── tema.js             # Controlador para alternar entre Modo Claro y Oscuro
    ├── utilidades.js       # Motores de cálculo de fechas (diferencias y aniversarios)
    ├── fechas.js           # Procesador y aplanador del JSON hacia objetos enriquecidos
    ├── buscador.js         # Algoritmos de filtrado por query y ordenación multicriterio
    ├── render.js           # Generador del DOM de las tarjetas y grupos dinámicos
    ├── timeline.js         # Constructor de la línea de tiempo dinámica
    ├── calendario.js       # Motor lógico y generador del calendario mensual
    ├── estadisticas.js     # Calculador del Dashboard superior y próximos aniversarios
    ├── exportar.js         # Generador de descargas físicas en formato .json y .csv
    └── importar.js         # Lector de archivos JSON subidos por el usuario


🛠️ Detalle de Archivos: Función y Contenido

1. Archivos Raíz

    - index.html: Define el esqueleto semántico de la aplicación. Contiene el encabezado superior fijo (Navbar), la grilla del Dashboard (Estadísticas y Próximos Aniversarios), y las dos columnas principales (Acordeones de eventos a la izquierda; Pestañas de Timeline y Calendario a la derecha). Declara la carga de app.js como un módulo (type="module").

    - fechas.json: Funciona como la base de datos de la aplicación. Estructurado en un array de "grupos", donde cada grupo posee propiedades de diseño (color, icono) y un array de "eventos" (con propiedades como tipo, titulo, fecha, inicio, fin, favorito, tags y notas).

2. Módulos de Lógica (js/)

    🛰️ Orquestadores y Persistencia

    - app.js (Punto de Entrada): Es el cerebro de la aplicación. Inicializa los controladores de interfaz (tema oscuro, vista compacta, pestañas), realiza la petición fetch para cargar el archivo fechas.json, configura los escuchadores de eventos globales (inputs de búsqueda, selectores de ordenación, botones de exportación) y desencadena el flujo de renderizado en cadena cuando los datos sufren modificaciones.

    - storage.js: Proporciona un canal unificado para interactuar de forma segura con localStorage serializando automáticamente objetos JS a strings JSON y viceversa. Evita la repetición de bloques JSON.parse(localStorage.getItem(...)).

    - tema.js: Controla la experiencia de Modo Oscuro. Escucha las preferencias del sistema operativo del usuario para el arranque inicial y conmuta la clase .dark-mode en la etiqueta <body>, guardando la elección en el almacenamiento del navegador.

    🧮 Motores de Cálculo y Procesamiento

    - utilidades.js: Contiene la matemática del proyecto.

        - calcularDiferencia(inicio, fin): Descompone el tiempo de forma exacta y sin desajustes temporales en años, meses, semanas y días restantes.

        - obtenerProximoAniversario(fecha): Determina la edad que cumplirá un evento recurrente en su próximo aniversario y cuántos días de cuenta atrás faltan para llegar a esa fecha exacta.

    - fechas.js: Recorre la jerarquía del JSON cargado y la "aplana" en un array lineal de eventos. En el proceso, enriquece cada evento calculando en tiempo real su textoTiempo descriptivo, la propiedad fechaOrdenacion (un objeto de tipo Date real para poder ordenar de forma precisa) y la cantidad de diasAbsolutos para filtros cuantitativos.

    🔍 Buscador y Filtros

    - buscador.js: Implementa la lógica de filtrado de texto (compara el término de búsqueda contra títulos, grupos, notas y tags ignorando mayúsculas/minúsculas). Además, realiza las ordenaciones multicriterio en cascada: por favoritos, por orden alfabético, por cercanía temporal (más recientes/antiguas) y por tiempo transcurrido acumulado.

    🖌️ Renderizado e Interfaces

    - render.js: Genera dinámicamente las tarjetas de eventos y las agrupa dentro de sus correspondientes contenedores colapsables (acordeones). Escucha las interacciones con el icono de la estrella de favorito para actualizar el estado del evento de forma interactiva y sincroniza en LocalStorage qué secciones del acordeón decide dejar abiertas o cerradas el usuario.

    - timeline.js: Obtiene el listado de eventos activos y genera de forma visual el árbol histórico de la línea de tiempo. Es gobernado por un selector interno exclusivo que invierte el orden del recorrido (de más antiguo a reciente o viceversa) de manera aislada al resto de la aplicación.

    - calendario.js: Genera la cuadrícula de días basándose en la fecha del sistema o en la navegación del usuario. Calcula el desfase del primer día de la semana (alineado a lunes) y asocia dinámicamente indicadores visuales de colores sobre cada celda si existen eventos planificados para dicho día.

    - estadisticas.js: Analiza el set de datos para alimentar el panel estadístico superior con indicadores cuantitativos del perfil de la agenda y renderiza una lista ordenada de las 5 fechas de cumpleaños o efemérides más próximas en el tiempo.

    💾 Importador y Exportador

    - exportar.js: Facilita la portabilidad de los datos empaquetándolos en archivos descargables desde el navegador: un .json idéntico a la estructura de la base de datos o un archivo comprimido plano .csv legible en Excel.

    - importar.js: Vincula el lector de ficheros del navegador (FileReader) para posibilitar al usuario cargar dinámicamente un archivo JSON externo, validando su integridad estructural en tiempo de ejecución.

3. Hojas de Estilo (css/)

    - variables.css: Centraliza el aspecto visual del proyecto usando variables CSS (--bg-main, --accent, --radius, etc.). Esto permite cambiar la apariencia (colores, curvas de botones) de toda la aplicación modificando un único archivo.

    - base.css: Aplica el reinicio de estilos básicos (reset CSS), define tipografías del sistema y configura la barra de navegación fija (position: sticky; top: 0; z-index: 1000) que permanece flotando sobre el contenido de forma estable.

    - cards.css: Controla el diseño de las tarjetas individuales en su formato amplio tradicional. Asimismo, almacena la arquitectura CSS Grid para la Vista Compacta de Lista: cuando el cuerpo de la web (body) adopta la clase .compact-mode, este archivo desactiva los flexbox antiguos en los acordeones de eventos y reestructura cada tarjeta en una fila bidimensional ordenada con la siguiente disposición horizontal:

    {Título del Evento}  {Estrella Favorito (Borde Derecho)}
    {Fecha} {Tiempos calculados (En una misma línea sin colisiones)}
    {Descripción del evento (Abajo)}
    {Tags (Alineados en la esquina inferior derecha)}

    - accordion.css: Define las animaciones y estados abiertos/cerrados del listado de grupos, reduciendo también de forma armónica los rellenos internos cuando se activa la vista compacta.

    - timeline.css: Da vida al timeline generando la línea vertical izquierda y las burbujas decorativas con los colores asignados dinámicamente de sus respectivos grupos.

    - forms.css: Da estilo unificado a botones, menús de selección, barras de búsqueda y a la estructura celular del calendario dinámico.

    - dark.css: Modifica exclusivamente el valor de las variables declaradas en variables.css cuando el cuerpo tiene la clase .dark-mode. Esto permite cambiar los fondos a colores oscuros y suavizar los textos de forma nativa e instantánea.

    - responsive.css: Ajusta la distribución de columnas a pantallas pequeñas, reordenando el Grid de dos columnas de la aplicación a una única columna vertical en móviles para un desplazamiento cómodo.