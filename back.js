document.addEventListener("DOMContentLoaded", () => {
    const buttonContainer = document.getElementById("button-container");
    const subButtonContainer = document.getElementById("sub-button-container");
    const graphContainer = document.getElementById("graph-container");
    const buttonContainerBelow = document.createElement('div'); // Container for buttons below the graph
    let points = []; // Points array that holds the generated points
    let centroids = []; // Store centroids

    // Function to clear the graph container
    const clearGraph = () => {
        graphContainer.innerHTML = "";
        buttonContainerBelow.innerHTML = ""; // Clear buttons when graph is cleared
    };

    // Function to generate 100 points in a uniform layout
    const generateUniformLayout = () => {
        const points = [];
        for (let i = 0; i < 100; i++) {
            points.push({
                x: Math.random() * 500, // Random x within the SVG dimensions
                y: Math.random() * 500  // Random y within the SVG dimensions
            });
        }
        return points;
    };

    // Function to render points in the graph
    const renderGraph = (points) => {
        clearGraph();

        // Create an SVG element for the graph
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("width", 500);
        svg.setAttribute("height", 500);
        svg.style.border = "1px solid black";

        // Append points to the SVG
        points.forEach(point => {
            const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            circle.setAttribute("cx", point.x);
            circle.setAttribute("cy", point.y);
            circle.setAttribute("r", 5); // Radius of the dot
            circle.setAttribute("fill", "black"); // Dot color
            svg.appendChild(circle);
        });

        // Append centroids to the SVG
        centroids.forEach(centroid => {
            const centroidCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            centroidCircle.setAttribute("cx", centroid.x);
            centroidCircle.setAttribute("cy", centroid.y);
            centroidCircle.setAttribute("r", 10); // Larger radius for centroid
            centroidCircle.setAttribute("fill", "red"); // Centroid color
            svg.appendChild(centroidCircle);
        });

        graphContainer.appendChild(svg);
        // Add buttons under the graph after rendering
        addButtonsBelowGraph();
    };

    // Function to add buttons under the graph
    const addButtonsBelowGraph = () => {
        // Define buttons
        const buttons = [
            { text: "Add Centroid", action: addCentroid },
            { text: "Go", action: goAction },
            { text: "Reset", action: resetGraph }
        ];

        // Create and append buttons
        buttons.forEach(button => {
            const btn = document.createElement("button");
            btn.textContent = button.text;
            btn.addEventListener("click", button.action);
            buttonContainerBelow.appendChild(btn);
        });

        // Append the button container to the DOM after the graph
        graphContainer.parentNode.insertBefore(buttonContainerBelow, graphContainer.nextSibling);
    };

    // Add a randomly placed centroid to the graph
    const addCentroid = () => {
        const centroid = {
            x: Math.random() * 500,
            y: Math.random() * 500
        };
        centroids.push(centroid); // Add the new centroid
        renderGraph(points); // Re-render the graph with the existing points and the new centroid
    };

    // Placeholder for the "Go" button functionality
    const goAction = () => {
        console.log("Go button clicked!");
        // Add any logic you want for the "Go" button
    };

    // Reset the graph and remove centroids
    const resetGraph = () => {
        centroids = [];
        renderGraph(points); // Re-render the graph with no centroids
    };

    // Event listener for main buttons
    buttonContainer.addEventListener("click", (event) => {
        const clusterType = event.target.dataset.cluster;
        if (clusterType) {
            // Show sub-buttons
            subButtonContainer.style.display = "block";
            clearGraph();
        }
    });

    // Event listener for sub-buttons
    subButtonContainer.addEventListener("click", (event) => {
        const layout = event.target.dataset.layout;
        if (layout) {
            switch (layout) {
                case "uniform":
                    points = generateUniformLayout();
                    break;
                case "gaussian-mixture":
                    points = generateGaussianMixture();
                    break;
                case "spiral":
                    points = generateSpiralLayout();
                    break;
                default:
                    console.log("Unknown layout:", layout);
                    return;
            }
            renderGraph(points);
        }
    });
});
