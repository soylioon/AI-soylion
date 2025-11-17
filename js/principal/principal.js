document.addEventListener("DOMContentLoaded", async function () {

    const containerChat = document.getElementById("containerChat");

    try {
        const response = await fetch("view/chat/chat.html");
        const html = await response.text();
        containerChat.innerHTML = html;
    } catch (error) {
        console.error("Error cargando el chat:", error);
        return;
    }

    inicializarChat();
});


/* *
 *  funtion para inicializar chat
 */

function inicializarChat() {

    const btnFlotante = document.getElementById("btnFlotante");
    const contentChat = document.getElementById("contentChat");
    const cerrarChat = document.getElementById("cerrarChat");
    const input = document.getElementById("chatInput");
    const contentChatMessages = document.getElementById("contentChatMessages");
    const mostrarEscribiendoDiv = document.getElementById("mostrarEscribiendo");
    const btnLimpiarChat = document.getElementById("btnLimpiarChat");

    const indexInput = document.getElementById("indexChatInput");
    const indexBtnChatEnviar = document.getElementById("btnChatEnviar");
    const btnChatIndex = document.getElementById("btnChatEnviar");
    const sugerencias = document.querySelectorAll(".btn-gradient");
    const containerChat = document.getElementById("containerChat");

    let visible = false;

    /* *
    *  mostrr chat desde index
    */

    btnChatIndex.addEventListener("click", () => {

        if (!containerChat.contains(contentChat)) {
            containerChat.appendChild(contentChat);
        }

        containerChat.classList.remove("d-none");

        contentChat.classList.remove("d-none");
        contentChat.classList.add("animate__animated", "animate__fadeIn");

        visible = true;
    });


    /* *
    *  selecionar archivo 
    */
    document.getElementById('btnSelectArchivo').addEventListener('click', function () {
        document.getElementById('inputArchivo').click();
    });

    document.getElementById('inputArchivo').addEventListener('change', function () {
        if (this.files.length > 0) {
            console.log("Archivo seleccionado:", this.files[0].name);
        }
    });

    /* *
     *  limpiar chat
     */
    btnLimpiarChat.addEventListener("click", () => {
        contentChatMessages.querySelectorAll(".chat-message").forEach(m => m.remove());
        localStorage.removeItem("chatHistorial");
    });


    const historial = JSON.parse(localStorage.getItem("chatHistorial") || "[]");
    historial.forEach((msg) => agregarMensajes(msg.text, msg.type, false));


    /* *
     *  abrir y cerrar chat
     */

    const ocultarChat = () => {
        contentChat.classList.add("animate__animated", "animate__fadeOut");
        setTimeout(() => {
            contentChat.classList.add("d-none");
            contentChat.classList.remove("animate__fadeOut");
        }, 400);
        visible = false;
    };

    const mostrarChat = () => {
        contentChat.classList.remove("d-none");
        contentChat.classList.add("animate__animated", "animate__fadeIn");
        setTimeout(() => contentChat.classList.remove("animate__fadeIn"), 400);
        visible = true;
    };

    btnFlotante.addEventListener("click", () => {
        if (!containerChat.contains(contentChat)) {
            containerChat.appendChild(contentChat);
        }
        visible ? ocultarChat() : mostrarChat();
    });

    cerrarChat.addEventListener("click", ocultarChat);


    /* *
    *  agregar mensages automaticos
     */
    function agregarMensajes(text, type = "sent", guardar = true) {
        const wrapper = document.createElement("div");
        wrapper.classList.add("d-flex", "chat-message", "w-100");

        if (type === "sent") {
            wrapper.classList.add("justify-content-end");
            wrapper.innerHTML = `
                <div class="p-3 rounded-4 shadow-sm text-white" 
                     style="max-width:70%; background-color:#0d6efd;">
                    ${text}
                    <div class="small text-end opacity-50 mt-1">${horaActual()}</div>
                </div>`;
        } else {
            wrapper.classList.add("justify-content-start");
            wrapper.innerHTML = `
                <div class="p-3 rounded-4 shadow-sm text-white" 
                     style="max-width:70%; background-color:#6c757d;">
                    ${text}
                    <div class="small text-end opacity-50 mt-1">${horaActual()}</div>
                </div>`;
        }

        /*  contentChatMessages.insertBefore(wrapper, mostrarEscribiendoDiv);
         contentChatMessages.scrollTop = contentChatMessages.scrollHeight; */

        contentChatMessages.appendChild(wrapper);
        contentChatMessages.scrollTop = contentChatMessages.scrollHeight;

        if (guardar) {
            historial.push({ text, type });
            localStorage.setItem("chatHistorial", JSON.stringify(historial));
        }
    }

    function horaActual() {
        const now = new Date();
        return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }

    function mostrarEscribiendo() {
        mostrarEscribiendoDiv.classList.remove("d-none");
    }

    function ocultarEscribiendo() {
        mostrarEscribiendoDiv.classList.add("d-none");
    }

    function chatRespuestas() {
        const respuestas = [
            "Hola, ¿en qué puedo ayudarte?",
            "Claro, un momento...",
            "Perfecto, entendido.",
            "Interesante, continúa.",
            "Estoy aquí para ayudarte.",
        ];

        const mensaje = respuestas[Math.floor(Math.random() * respuestas.length)];

        mostrarEscribiendo();

        setTimeout(() => {
            ocultarEscribiendo();
            agregarMensajes(mensaje, "received");
        }, 1200);
    }


    /* *
     *  enviar mensajes
     */

    function enviarMensaje() {
        const msg = input.value.trim();
        if (msg === "") return;

        agregarMensajes(msg, "sent");
        input.value = "";
        chatRespuestas();
    }

    document.getElementById("btnEnviar").addEventListener("click", enviarMensaje);
    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") enviarMensaje();
    });


    /* *
      *  envio de mensajes desde el index
      */

    function enviarDesdeIndex() {
        const texto = indexInput.value.trim();
        if (texto === "") return;

        containerChat.classList.remove("d-none");
        contentChat.classList.remove("d-none");
        contentChat.classList.add("animate__animated", "animate__fadeIn");

        visible = true;

        agregarMensajes(texto, "sent");
        indexInput.value = "";
        chatRespuestas();
    }

    indexBtnChatEnviar.addEventListener("click", enviarDesdeIndex);

    indexInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") enviarDesdeIndex();
    });

    sugerencias.forEach((btn) => {
        btn.addEventListener("click", () => {
            const texto = btn.textContent.trim();
            indexInput.value = texto;
            indexInput.focus();
        });
    });

    /* *
    *  para q se adate a disposivos moviles 
    */

}
