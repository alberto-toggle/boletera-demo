# Sign Up Split Panel

- Autor: diarmuradi / 21st.dev.
- Origen: https://21st.dev/@diarmuradi/components/sign-up-1
- Registro: https://21st.dev/r/diarmuradi/sign-up-1
- Demo 28171, recuperada mediante MCP. Auxiliares originales descargados del registro autenticado.
- El registro consultado no incluye una licencia específica.

Se conserva la composición, el testimonio, FancyButton y los cuatro iconos
utilizados del archivo original. Se reutilizan Button, Input y Avatar de Base UI.
Los campos y el grupo de contraseña se componen localmente con etiquetas
semánticas y las primitivas existentes para evitar dependencias Radix.
Adaptaciones: IDs únicos, campos requeridos, callbacks tipados, etiquetas
accesibles para acceso social, foco visible y breakpoints de contenedor.

Las acciones muestran avisos locales: no se crean cuentas ni se envían o guardan
credenciales. No se sobrescriben primitivas ni se instalan dependencias.
