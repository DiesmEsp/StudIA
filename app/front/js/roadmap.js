// Configurar diagrama GoJS reutilizable
const $ = go.GraphObject.make;

let myDiagram = $(go.Diagram, "myDiagramDiv", {
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

// Spinner y contenedor del diagrama
const spinner = document.getElementById("loadingSpinner");
const diagramDiv = document.getElementById("myDiagramDiv");
const placeholder = document.getElementById("roadmapPlaceholder");

// Añadir listener para el evento de carga del diagrama
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

    let hayResultados = false;

    try {
        // Mostrar el spinner y ocultar el diagrama y el placeholder
        spinner.style.display = "block";
        diagramDiv.style.display = "none";
        placeholder.style.display = "none";

        // Enviar la petición al servidor
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

        // Validar si el resultado está vacío
        if (nodes.length === 0 || edges.length === 0) {
            alert("No se encontraron resultados para este tema. Prueba con otro término más técnico o específico.");
            return;
        }

        hayResultados = true;

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

        // Pintamos el grafo
        myDiagram.model = new go.TreeModel(nodosGoJS);

        // Eliminar cualquier listener anterior para evitar duplicados
        myDiagram.removeDiagramListener("ObjectSingleClicked");

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
    } finally {
        if (hayResultados) {
            // Si hay resultados, ocultar el spinner y mostrar el diagrama
            spinner.style.display = "none";
            diagramDiv.style.display = "block";
            placeholder.style.display = "none";
        }
        else {
            // Si no hay resultados, ocultar el spinner y mostrar el placeholder
            spinner.style.display = "none";
            diagramDiv.style.display = "none";
            placeholder.style.display = "flex";
        }
    }
});


