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

    try {
        console.log("Enviando request al servidor...");
        const response = await fetch("http://127.0.0.1:5000/generar-roadmap", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload),
            mode: "cors"
        });

        if (!response.ok) {
            const error = await response.text();
            console.error("Error desde el servidor (status != 200):", error);
            alert("Hubo un error al generar el roadmap.");
            return;
        }

        const data = await response.json();
        console.log("Respuesta parseada como JSON:", data);

        const nodes = data.nodes;  // [{ id: "C1", titulo: "Intro a..." }, ...]
        const edges = data.edges;  // [["C1", "C2"], ["C1", "C3"]]

        const nodosGoJS = [];

        // Primero, los nodos con key y título
        nodes.forEach(n => {
            nodosGoJS.push({
                key: n.id,
                titulo: n.titulo
            });
        });

        // Luego, añadimos los enlaces padre-hijo
        edges.forEach(([from, to]) => {
            const nodo = nodosGoJS.find(n => n.key === to);
            if (nodo) {
                nodo.parent = from;
            }
        });

        // Configurar GoJS como antes
        const $ = go.GraphObject.make;

        const myDiagram = $(go.Diagram, "myDiagramDiv", {
            layout: $(go.TreeLayout, { angle: 0, layerSpacing: 40 }),
            "undoManager.isEnabled": false,
            "allowMove": false,
            "allowLink": false,
            "allowRelink": false,
            "allowDelete": false,
            "allowInsert": false,
            initialAutoScale: go.Diagram.UniformToFill
        });

        // Ahora usamos el campo "titulo" para mostrar en el nodo
        myDiagram.nodeTemplate = $(
            go.Node, "Auto",
            {
                cursor: "pointer",
                mouseEnter: (e, obj) => {
                    const shape = obj.findObject("SHAPE");
                    if (shape) shape.fill = "#76bdd5";
                },
                mouseLeave: (e, obj) => {
                    const shape = obj.findObject("SHAPE");
                    if (shape) shape.fill = "#add8e6";
                }
            },
            $(
                go.Shape, "RoundedRectangle",
                { name: "SHAPE", fill: "lightblue", stroke: "#333" }
            ),
            $(
                go.TextBlock,
                { margin: 8, font: "bold 14px sans-serif" },
                new go.Binding("text", "titulo") // Ahora mostramos el título
            )
        );

        // Pintamos el grafo
        myDiagram.model = new go.TreeModel(nodosGoJS);

        // Comportamiento al hacer clic
        myDiagram.addDiagramListener("ObjectSingleClicked", (e) => {
            const node = e.subject.part;
            if (node && node.data.key) {
                const id = node.data.key;
                const url = `/getCurso/${id}`;
                window.open(url, "_blank");
            }
        });


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
