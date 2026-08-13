# Changelog

Todos los cambios relevantes de Save Tabs se documentan en este archivo.

## [1.2.1]

### Corregido

- El selector de idioma ya se registra correctamente y conserva la preferencia de sincronización.
- El orden manual respeta los cambios hechos con arrastrar y soltar.
- El reordenamiento ignora de forma segura destinos de arrastre no válidos.
- Las acciones usan la API disponible del navegador (`browser` en Firefox o `chrome` en Chromium).
- La exportación conserva el enlace temporal hasta que Firefox inicia la descarga.
- Los botones de cerrar y cancelar de los diálogos ya no activan la validación del formulario.
- El idioma se cambia mediante un botón ES/EN visible y persistente, compatible con Firefox.

### Añadido

- Pruebas automatizadas para migración, guardado de pestañas actuales, exportación, filtros, ordenamiento manual, duplicados, traducciones, historial y reglas de guardado automático.
- CI ejecuta las pruebas unitarias en cada push y pull request.

## [1.2.0]

### Añadido

- Arrastrar y soltar para reordenar sesiones y pestañas cuando el orden está en modo **Manual**.
- Reglas de guardado automático por dominio o grupos de dominios, procesadas en segundo plano.
- Pines/favoritos y notas para pestañas guardadas.
- Indicador de URLs duplicadas entre sesiones.
- Comprobación manual de enlaces seleccionados, con permiso de sitios solicitado sólo al utilizar la función.
- Sincronización opcional de la biblioteca mediante `chrome.storage.sync`.
- Historial de instantáneas y restauración de estados anteriores de sesiones.
- Nuevo proceso en segundo plano (`background.js`) para las reglas automáticas.

### Mejorado

- Nueva vista de sesiones horizontal para ordenar colecciones con arrastrar y soltar.
- Acciones masivas ampliadas: abrir, fijar, etiquetar, añadir notas, comprobar enlaces y eliminar.
- Sesiones con nombre, búsqueda, filtros, etiquetas, respaldos JSON, deshacer borrado y atajos de teclado.
- Selector de idioma Español/Inglés persistente para toda la interfaz, diálogos, mensajes y estados.
- La versión de la extensión pasa a `1.2.0`.

## [1.1.0]

### Añadido

- Diseño renovado del popup: lista de pestañas compacta, contador, selección total y estado vacío.
- Avisos visuales dentro de la extensión en lugar de alertas del navegador.
- Botones de abrir y eliminar deshabilitados cuando no existe una selección.

### Mejorado

- Renderizado de pestañas mediante nodos DOM para evitar insertar títulos o URLs directamente como HTML.
- Eliminados permisos no utilizados: `host_permissions` y `activeTab`.
- Actualización de la documentación de instalación, privacidad, estructura y desarrollo.

## [1.0.0]

### Añadido

- Primera versión de Save Tabs como extensión Chrome Manifest V3.
- Guardado de todas las pestañas de la ventana actual.
- Prevención de duplicados por URL dentro de la biblioteca.
- Apertura de pestañas seleccionadas.
- Eliminación de pestañas seleccionadas.
- Persistencia local con `chrome.storage.local`.
- Uso de las APIs Chrome Tabs y Storage.
