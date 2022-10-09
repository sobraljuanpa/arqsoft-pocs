# Pruebas de concepto para arqsoft

Por ahora una api rest usando express y mongo, el ambiente local se arma usando compose.

Hay un dockerfile para crear el contenedor de la api rest que instala dependencias y se copia el directorio con la aplicacion.

Para levantar todo hay que hacer ```docker-compose up --build```