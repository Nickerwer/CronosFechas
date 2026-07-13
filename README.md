# Gestor de Fechas Personales

Aplicación nativa moderna optimizada para escritorio y móviles que permite gestionar, calcular lapsos de tiempo y visualizar eventos cronológicamente partiendo de una única fuente estructurada JSON.

## Características:
- **Vista Compacta (Modo Lista)**: Alterna entre el diseño de tarjetas completas o una lista ultra compacta con menos margen y texto sintetizado mediante el botón `📋` / `📱` en la barra superior.
- **Calendario Dinámico Completo**: Cuadrícula mensual con mapeo interactivo de eventos en sus fechas.
- **Ordenación del Timeline Independiente**: Filtro exclusivo para ordenar de más antiguo a más reciente o viceversa.

## Ejecución Local
Por razones de seguridad del navegador (`CORS`), el método de consumo `fetch` requiere levantar un servidor local rápido. Puedes usar cualquiera de las siguientes opciones dentro del directorio raíz:

- **Python**: `python -m http.server 8000`
- **NodeJS (npx)**: `npx serve`
- **VS Code**: Clic derecho a `index.html` -> *Open with Live Server*.

## Modificación del JSON
El archivo `fechas.json` se puede editar manualmente en caliente. Permite crear colecciones de grupos y eventos con tipos específicos (`desde`, `periodo`, `hasta`, `aniversario`). Las estadísticas e interfaces se recalculan solas.

## Tipos de eventos
1. Tipo desde (Tiempo transcurrido hasta hoy)
Este tipo calcula cuántos años, meses, semanas y días han pasado desde la fecha indicada hasta el día de hoy. Es ideal para aniversarios de boda, fechas de contratación, o el día que compraste algo.
{
  "tipo": "desde",
  "titulo": "Inicio en mi trabajo actual",
  "fecha": "2023-11-10",
  "favorito": true,
  "tags": ["Profesional", "Hito"],
  "notas": "Primer día en la oficina de Madrid."
}

2. Tipo periodo (Duración estática entre dos fechas)
Calcula únicamente la duración que hay entre la fecha de inicio y la de fin. No tiene en cuenta el día de hoy, por lo que el resultado siempre será el mismo. Es perfecto para reflejar la duración de un viaje, unas obras, un curso o un contrato temporal.
{
  "tipo": "periodo",
  "titulo": "Viaje de mochilero por Japón",
  "inicio": "2025-04-01",
  "fin": "2025-05-15",
  "favorito": false,
  "tags": ["Viajes", "Ocio"],
  "notas": "Recorrido de Tokio a Kioto."
}

3. Tipo hasta (Cuenta atrás para el futuro)
Calcula el tiempo que falta desde el día de hoy hasta la fecha indicada. Es el clásico "countdown" o cuenta atrás. Ideal para entregas de proyectos, exámenes, la fecha de fin de un contrato o el vencimiento de un seguro.
{
  "tipo": "hasta",
  "titulo": "Examen de Oposición",
  "fecha": "2026-10-24",
  "favorito": true,
  "tags": ["Estudios", "Examen"],
  "notas": "Aula 3 de la Facultad de Derecho a las 9:00."
}

4. Tipo aniversario (Eventos cíclicos anuales)
Calcula automáticamente dos cosas muy útiles: la edad del evento (cuántos años cumple) y cuántos días faltan para el próximo aniversario anual. Es perfecto para cumpleaños, fallecimientos o fechas históricas recurrentes.
{
  "tipo": "aniversario",
  "titulo": "Cumpleaños de Sofía",
  "fecha": "1995-08-20",
  "favorito": false,
  "tags": ["Familia", "Cumpleaños"],
  "notas": "¡No olvidar comprar el pastel de chocolate!"
}