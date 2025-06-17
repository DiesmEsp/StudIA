const $ = go.GraphObject.make;

const myDiagram = $(go.Diagram, "myDiagramDiv", {
    layout: $(go.TreeLayout, { angle: 0, layerSpacing: 40 }),

    "undoManager.isEnabled": false, // Desactiva ctrl+z y acciones reversibles
    "allowMove": false,             // No permite mover nodos
    "allowLink": false,             // No permite crear enlaces
    "allowRelink": false,           // No permite cambiar conexiones
    "allowDelete": false,           // No permite eliminar elementos
    "allowInsert": false,           // No permite agregar nodos manualmente

    initialAutoScale: go.Diagram.UniformToFill
});

// Define el template de los nodos
myDiagram.nodeTemplate = $(
    go.Node, "Auto",
    {
        // Cambiar el cursor al pasar el mouse
        cursor: "pointer",
        mouseEnter: (e, obj) => {
            const shape = obj.findObject("SHAPE");
            if (shape) shape.fill = "#76bdd5"; // azul más claro
        },
        mouseLeave: (e, obj) => {
            const shape = obj.findObject("SHAPE");
            if (shape) shape.fill = "#add8e6"; // color original
        }
    },
    $(
        go.Shape,
        "RoundedRectangle",
        {
            name: "SHAPE", // Necesario para poder encontrarlo y cambiar el color
            fill: "lightblue",
            stroke: "#333"
        }
    ),
    $(
        go.TextBlock,
        { margin: 8, font: "bold 14px sans-serif" },
        new go.Binding("text", "key")
    )
);

// Cambiar: ahora usamos id en vez de url
myDiagram.model = new go.TreeModel([
    { key: "Curso 1", id: 1 },
    { key: "Curso 2", parent: "Curso 1", id: 2 },
    { key: "Curso 3", parent: "Curso 1", id: 3 },
    { key: "Curso 4", parent: "Curso 2", id: 4 }
]);

// Nuevo comportamiento al hacer clic: construir URL dinámica y abrir nueva pestaña
myDiagram.addDiagramListener("ObjectSingleClicked", (e) => {
    const node = e.subject.part;
    if (node && node.data.id) {
        const id = node.data.id;
        const url = `/getCurso/${id}`;
        window.open(url, "_blank"); // Abrir en nueva pestaña
    }
});
