# 🏫 CLASSROOM SURVIVAL

> *"Total, si los profes no hacen nada, tienen 3 meses de vacaciones..."* — Cuñao medio español. Hoy vas a comprobarlo.

Minijuego 3D en tono de humor sobre la vida docente en España: eres profesor o profesora en un aula llena de fieras y tienes que **sobrevivir a la clase sin que tu salud mental llegue a cero**.

🎮 **Juégalo ahora en tu navegador:** https://ray86-dev.github.io/classroom-survival/

Sin instalación, sin registro. Solo necesitas internet la primera vez (Three.js se carga desde CDN).

![Pantalla inicial](docs/img/menu.png)

![Partida en curso](docs/img/partida.png)

![Ranking mundial](docs/img/ranking.png)

## 🎯 Objetivo

* **Da clase** para subir el **📚 Conocimiento** del alumnado.
* Aguanta la **duración elegida** (5–50 min) sin que te tumben:
  * 😡 **Estrés** al 100% → baja laboral.
  * 😰 **Ansiedad** al 100% → ataque de ansiedad.
  * 🧠 **Salud mental** a 0 → burnout.
* **MODO IMPOSIBLE ☠️:** el caos escala con el tiempo — los eventos llegan cada vez más rápido y **hasta 3 crisis a la vez**. Solo el **1%** llega al minuto 50, suena la alarma y sale por la puerta entre aplausos.

## 🕹️ Cómo se juega

* **Clica los iconos sobre cada alumno** (🟩 opción A / 🟥 opción B) para resolver su crisis sin abrir menús. El icono central muestra el evento y se pone 🟡/🔴 cuando se agota el tiempo.
* **Click en un alumno díscolo** = 👀 mirada fulminante. Encadena miradas en menos de 3,5 s para subir el **COMBO x2…x9** (¡pero no mires a un inocente o romperás el combo!).
* **ESPACIO o 📚 DAR CLASE** para explicar de viva voz (rinde menos con el aula patas arriba).
* 🖊️ **Pizarra (clic)**: el profe camina hasta ella y escribe con tiza (+conocimiento, gasta 1 de 6 tizas).
* 📽️ **Proyector (clic)**: lo enciende/apaga; encendido pasa una diapositiva cada 7 s (+0,9 %). Si se cae internet, clic para reiniciar el router.
* 💻 **Portátil (clic)**: pasa lista — nombra a 4 alumnos y clica al llamado antes de 6 s (+1,3 % por presente).
* **Arrastra** para mirar alrededor, **rueda / slider / teclas +/−** para zoom.
* El dock inferior-izquierdo resume cada crisis por si prefieres leer la descripción antes de decidir.

### Eventos disruptivos (humor español)

Estornudos sónicos, llantos por una goma con forma de unicornio, el de *"¿puedo ir al baño?"* por 12ª vez (se levanta y **camina hasta la puerta** a esperar tu permiso), guerras de bolas de papel que **ensucian el suelo de verdad**, chicles globo, vómitos históricos con charco persistente, desmayos, tinta líquida explosiva, toques en la puerta (el visitante **entra caminando**), móviles con reggaetón, padres a recoger con excusa del dentista, el jefe de estudios interrumpiendo, balones que **entran volando por la ventana** con las cortinas ondeando, bocadillos clandestinos, el alumno youtuber ("¡saluda a mi canal!") y la inspección sorpresa.

### Poderes tácticos (teclas 1 y 2)

* ☕ **Café de sala de profes** — ansiedad −35 de golpe, pero 30 s de tembleque enseñando peor.
* 📢 **Voz de trueno** — 10 s de silencio total... seguidos de 20 s de rebote de caos x2.

### El aula vive

* 🧑‍🏫 El profe y su mesa están **al frente, en un costado junto a la pizarra**, mirando a sus fieras. Si escribes en la pizarra, camina hasta ella y vuelve.
* 🟩 **Pupitres verde colegio** de toda la vida, con su silla a juego.
* 🚪 La **puerta se abre de verdad**: tiene hueco, marco y pasillo oscuro detrás. Quien cruza el umbral (visitantes, salidas al baño, tu salida triunfal del 1 %) **se desvanece** en vez de atravesar madera.

### El alumnado tiene memoria

* 😈 **Repetidor** (gorra roja): lía 3 veces más.
* 🌟 **Delegada** (insignia): trátala bien y con confianza 3+ calmará ella sola una crisis cada 25 s.
* 💙 **Alumnado NEAE**: atiéndelo como merece y el aula rinde un 10 % mejor.

## 💻 Jugar en local

```bash
git clone https://github.com/Ray86-dev/classroom-survival.git
cd classroom-survival
npx serve .
```

Y abre http://localhost:3000 (o cualquier servidor estático).

## 🏆 Puntos y ranking mundial

Al terminar cada partida recibes una **puntuación**: conocimiento ×10 + minutos ×20 + eventos resueltos ×15 − ignorados ×10 + mejor combo ×10 + miradas + lecciones ×5, con bonus por aprobar (+500) o entrar en el club del 1 % (+2000), todo multiplicado por la **dificultad** `(1 + alumnos/30) × (1 + duración/50)`.

Tu marca se envía sola al **ranking mundial** (pestañas por duración: 5/10/15/25/50 min + general) y se guarda tu mejor marca local. Botón **🏆 RANKING** en la pantalla inicial y al final de cada partida.

Backend **Back4App (Parse)**: las claves del juego son públicas por diseño; la seguridad real está en el servidor (permisos estrictos + validación en `cloudcode.js`): cualquiera puede leer el top y registrar marcas válidas, pero nadie puede editar ni borrar nada.

## 🛠️ Tecnologías

* Un solo `index.html` (~99 KB de JS), sin build ni dependencias instaladas.
* Render 3D minimalista pixel-art en tiempo real con **Three.js** (importado por CDN como ES module).
* Sonido y música chiptune 100 % **Web Audio API** procedural: casi 20 efectos (tiza, timbre, router, proyector...) + banda sonora que se tensa con tu estrés. Sin ficheros de audio.
* Estado, físicas de juguetes (papeles, balones, confeti), escalado de dificultad y ranking, todo en vanilla JS + SDK de Parse por CDN.
* Ranking en **Back4App**: tabla `Scores`, permisos a nivel de fila y validación en `cloudcode.js` (desplegado desde este repo).

## ⚠️ Nota

Juego satírico hecho con cariño hacia el profesorado. Cualquier parecido con tu clase de 6ºB es pura coincidencia... o no.
