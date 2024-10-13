// Preguntamos al usuario si quiere que el script sea interactivo o no
const isNotInteractive = confirm("Bienvenido al script de autorellenado de horas de QBID. Pulsa 'CANCELAR' para rellenar un día y comprobar si las horas están adecuadamente seleccionadas. Pulsa 'OK' para rellenar TODOS los días automáticamente.");
const regexExpresion = "/[^\\\\d]/g, ''";

// Crea un nuevo elemento script
let newScript = document.createElement('script');

// Asignar el código que se inyectará en el head del documento padre que, a su vez, contiene otra inyección para el elemento iframe.
newScript.textContent = `
    injectScriptToIframe();

    function injectScriptToIframe() {
        // Usamos un timeout para asegurarnos de que el iframe esté cargado.
        setTimeout(() => {
            let iframe = parent.document.getElementById("jspContainer");

            if (iframe && iframe.contentWindow && iframe.contentWindow.document) {
                let iframeDocument1 = parent.document.getElementById("jspContainer").contentWindow.document
                let iframeDocument = iframeDocument1.getElementById("contentmain").contentWindow.document

                $(iframeDocument).ready(function() { // Asegurarnos de que el contenido del iframe esté completamente cargado
                    let newScriptIframe = iframeDocument.createElement('script');

                    newScriptIframe.textContent = \`
                        const isNotInteractive2 = ${isNotInteractive};

                        // Contiene el número máximo de horas del alumno
                        var maxHours2;
                        // Contiene todos los selects
                        var selects2;
                        // Contiene los selects mezclados
                        var shuffledSelects;
                        // Contiene los selects escogidos aleatoriamente
                        var selectedSelects;

                        initScript();

                        function initScript() {
                            if ($(".panel-footer .btn-info").length === 0) { // Verifica si el botón de guardar está disponible
                                endScript();
                                return;
                            }

                            getMaxHours();
                            getAllSelects();
                            getRandomSelects();
                            setRandomSelects();

                            if (isNotInteractive2) {
                                parent.nextPage();
                                clickSaveHours();
                            } else {
                                checkSelects();
                            }
                        }

                        // Obtener las horas máximas del alumno
                        function getMaxHours() {
                            maxHours2 = parseInt($('.col-sm-2 .label-info').text().replace(${regexExpresion}));
                        }

                        // Obtener todos los elementos con la clase .form-control, excluyendo los de ausencia y observaciones
                        function getAllSelects() {
                            selects2 = $('.form-control:not(#motiuAbsenciaParcial, #observacionsInutilsAlumneMaiOmplira, #motiuAbsencia)');
                            resetSelects(); // Reinicia todos los selects por si el día ya ha sido rellenado
                        }

                        function getRandomSelects() {
                            shuffledSelects = selects2.toArray().sort(() => Math.random() - 0.5); // Mezcla los selects aleatoriamente
                            selectedSelects = shuffledSelects.slice(0, maxHours2);                // Selecciona el número de selects según las horas del alumno
                        }

                        function setRandomSelects() {
                            $(selectedSelects).val('1.0'); // Asignar el valor 1.0 (1 hora) a los selects seleccionados
                        }

                        function resetSelects() {
                            $(selects2).val('0');
                        }

                        function checkSelects() {
                            alert("Tienes 10 segundos desde que pulsas aceptar para comprobar si los selects son correctos. Seguidamente, se te preguntará si deseas guardar estas horas o volver a seleccionar aleatoriamente otras de nuevo.");
                            setTimeout(() => {
                                var fillSelects = confirm("¿Deseas volver a rellenar los selects con diferentes horas?");
                                if (fillSelects) {
                                    resetSelects();
                                    getRandomSelects();
                                    setRandomSelects();
                                    checkSelects(); // Reinicia el proceso
                                } else {
                                    parent.nextPage();
                                    clickSaveHours();
                                }
                            }, 10000);
                        }

                        function clickSaveHours() {
                            $(".panel-footer .btn-info").click();
                        }

                        function endScript() {
                            alert("Todas las horas han sido guardadas correctamente.");
                        }
                    \`;

                    iframeDocument.head.appendChild(newScriptIframe); // Inyecta el script en el iframe
                });
            } else {
                console.error("No se puede acceder al iframe o su contenido.");
            }
        }, 2000); // Tiempo de espera para asegurarse de que el iframe está cargado
    }

    function nextPage() {
        setTimeout(() => {
            let iframe = parent.document.getElementById("jspContainer");

            if (iframe && iframe.contentWindow && iframe.contentWindow.document) {
                let iframeDocument1 = parent.document.getElementById("jspContainer").contentWindow.document
                let iframeDocument = iframeDocument1.getElementById("contentmain").contentWindow.document

                $(iframeDocument).ready(function() { // Asegurarnos de que el contenido del iframe esté completamente cargado
                    let newScriptIframe = iframeDocument.createElement('script');

                    newScriptIframe.textContent = \`
                        if (!${isNotInteractive}) {
                            alert("Horas guardadas correctamente. Siguiente página...");
                        }
                        parent.injectScriptToIframe(); // Reinyecta el script en la siguiente página del iframe
                        $(".base").click(); // Simula el click para ir a la siguiente página
                    \`;

                    iframeDocument.head.appendChild(newScriptIframe); // Inyecta el script en el iframe
                });
            }
        }, 2000); // Tiempo de espera para asegurarse de que el iframe guarda correctamente los datos
    }
`;

// Añade el script al head del documento padre
parent.document.head.appendChild(newScript);