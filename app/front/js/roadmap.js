document.querySelector(".roadmap-generate-button").addEventListener("click", async () => {
    const tema = document.querySelector(".roadmap-input").value.trim();
    const nivel = document.querySelector(".roadmap-select").value;

    if (!tema) {
        alert("Por favor, escribe un tema.");
        return;
    }

    const payload = {
        tema: tema,
        nivel: nivel
    };

    // try {
    //     const response = await fetch("http://127.0.0.1:5000/generar-roadmap", {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json"
    //         },
    //         body: JSON.stringify(payload)
    //     });

    //     const data = await response.json();

    //     if (!response.ok) {
    //         console.error("Error desde el servidor:", data);
    //         alert("Hubo un error al generar el roadmap.");
    //         return;
    //     }

    //     console.log("Respuesta recibida desde la API:", data.aristas);
    //     // Aquí construirás el grafo con GoJS usando data.aristas

    // } catch (err) {
    //     console.error("Error en la petición:", err);
    //     alert("No se pudo conectar con el servidor.");
    // }

    try {
        console.log("Enviando request al servidor...");
        const response = await fetch("http://127.0.0.1:5000/generar-roadmap", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload),
            mode: "cors"  // <-- Asegura que sea una petición CORS bien formada
        });

        console.log("Respuesta recibida:", response);

        if (!response.ok) {
            const error = await response.text(); // usa .text() para ver incluso errores malformateados
            console.error("Error desde el servidor (status != 200):", error);
            alert("Hubo un error al generar el roadmap.");
            return;
        }

        const data = await response.json();
        console.log("Respuesta parseada como JSON:", data);

    } catch (err) {
        console.error("Error inesperado en la petición:", err);
    }
});



// const $ = go.GraphObject.make;

// const myDiagram = $(go.Diagram, "myDiagramDiv", {
//     layout: $(go.TreeLayout, { angle: 0, layerSpacing: 40 }),

//     "undoManager.isEnabled": false, // Desactiva ctrl+z y acciones reversibles
//     "allowMove": false,             // No permite mover nodos
//     "allowLink": false,             // No permite crear enlaces
//     "allowRelink": false,           // No permite cambiar conexiones
//     "allowDelete": false,           // No permite eliminar elementos
//     "allowInsert": false,           // No permite agregar nodos manualmente

//     initialAutoScale: go.Diagram.UniformToFill
// });

// // Define el template de los nodos
// myDiagram.nodeTemplate = $(
//     go.Node, "Auto",
//     {
//         // Cambiar el cursor al pasar el mouse
//         cursor: "pointer",
//         mouseEnter: (e, obj) => {
//             const shape = obj.findObject("SHAPE");
//             if (shape) shape.fill = "#76bdd5"; // azul más claro
//         },
//         mouseLeave: (e, obj) => {
//             const shape = obj.findObject("SHAPE");
//             if (shape) shape.fill = "#add8e6"; // color original
//         }
//     },
//     $(
//         go.Shape,
//         "RoundedRectangle",
//         {
//             name: "SHAPE", // Necesario para poder encontrarlo y cambiar el color
//             fill: "lightblue",
//             stroke: "#333"
//         }
//     ),
//     $(
//         go.TextBlock,
//         { margin: 8, font: "bold 14px sans-serif" },
//         new go.Binding("text", "key")
//     )
// );

// // Cambiar: ahora usamos id en vez de url
// myDiagram.model = new go.TreeModel([
//     { key: "Curso 1", id: 1 },
//     { key: "Curso 2", parent: "Curso 1", id: 2 },
//     { key: "Curso 3", parent: "Curso 1", id: 3 },
//     { key: "Curso 4", parent: "Curso 2", id: 4 }
// ]);

// // Nuevo comportamiento al hacer clic: construir URL dinámica y abrir nueva pestaña
// myDiagram.addDiagramListener("ObjectSingleClicked", (e) => {
//     const node = e.subject.part;
//     if (node && node.data.id) {
//         const id = node.data.id;
//         const url = `/getCurso/${id}`;
//         window.open(url, "_blank"); // Abrir en nueva pestaña
//     }
// });



// // PRUEBA
// document.querySelector(".roadmap-generate-button").addEventListener("click", async () => {
//     const tema = document.querySelector(".roadmap-input").value.trim();
//     const nivel = document.querySelector(".roadmap-select").value;

//     const res = await fetch("http://127.0.0.1:5000/generar-roadmap", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ tema, nivel }),
//         mode: "cors"
//     });

//     const data = await res.json();
//     console.log("OK:", data);
// });
