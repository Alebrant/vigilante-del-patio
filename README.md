# choza-helper

Chatbot para escuchar a mensajes de mozunidad. Configurable para comentar la jugada, o encargarse de meter timeouts.

# Configuración

Debe de desplegarse incluyendo en las variables de enotrno las siguientes variables:
- ADMIN_USER: Usuario de twitch del bot que se encargará de escuchar los mensajes de mozunidad
- ADMIN_TOKEN: Token del usuario de witch del bot (entrar en https://twitchapps.com/tmi/ con la cuenta del bot logeada en twitch y dar permisos)
- CHANNEL: Canal de twitch en el que escuchará a mensajes
- TIMEOUT: Número de segundos que se lanzará timeout si el usuario da menos mozunidad que el 40%. Es opcional, si no se rellena o se rellena con un 0 no se ejecutará timeout.
- SAY: Es opcional. De estar configurada, el bot mostrará un mensaje.

# Servir

Para servir al bot debe lanzarse sobre un servidor NodeJS con el script start
> npm run start

Una buena opción de servidor online es https://www.heroku.com/ que proporciona opción para tener un servidor personal funcionando constantemente.
