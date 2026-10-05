# Identificación adaptada del Playground

La tarjeta de `../buyer-identification.tsx` adapta el panel de formulario de
[Sign Up Split Panel, diarmuradi](../../../../components/blocks/21st-dev/sign-up-1/README.md):
cabecera centrada, marca elevada, acceso social, separador, campos etiquetados,
contraseña con visibilidad alternable, FancyButton y enlace al modo complementario.
`fancy-button.tsx` se extrajo del bloque instalado y conserva su implementación
Base UI. `google-icon.tsx` extrae únicamente el SVG Google del mismo bloque.

El login adapta la composición compacta centrada y el botón de Google de
[Modern & Stunning Sign In, preetsuthar17](../../../../components/blocks/21st-dev/modern-stunning-sign-in/README.md).
Se sustituyen marca, textos, colores e imágenes ajenas por los tokens de la demo.
Se omiten testimonios del ejemplo porque no corresponden al producto.
Los registros descargados no declaran licencia específica; se conserva esa nota
junto a las fuentes originales. No se modifican los ejemplos del Playground.

Las acciones están conectadas al checkout: invitado y registro verifican correo
o teléfono con 123456; login con credenciales de prueba; Google permite elegir
una cuenta ficticia y continúa con contacto verificado. El botón no hace OAuth,
no transmite datos ni almacena contraseñas. Cancelar Google conserva el formulario.

Los tres modos se eligen mediante pestañas equivalentes sobre un único panel. Invitado muestra directamente nombre y contacto; Google y contraseña solo aparecen en login/registro. Flechas, Inicio y Fin permiten cambiar de pestaña por teclado conservando el foco.
