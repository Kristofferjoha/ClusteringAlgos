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

    // Function to calculate the closest centroid for a given point
    const getClosestCentroid = (x, y) => {
        let closest = null;
        let minDistance = Infinity;

        centroids.forEach(centroid => {
            const distance = Math.sqrt(
                Math.pow(x - centroid.x, 2) + Math.pow(y - centroid.y, 2)
            );
            if (distance < minDistance) {
                minDistance = distance;
                closest = centroid;
            }
        });

        return closest;
    };



    // Function to render the proximity areas and the points
    const renderGraph = () => {
    clearGraph();

    // Create an SVG element for the graph
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", 500);
    svg.setAttribute("height", 500);
    svg.style.border = "1px solid black";

    // Create the background proximity grid with distinct regions for each centroid
    const resolution = 5; // Resolution of the grid
    for (let x = 0; x <= 500; x += resolution) {
        for (let y = 0; y <= 500; y += resolution) {
            const closestCentroid = getClosestCentroid(x, y);
            if (closestCentroid) {
                const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                rect.setAttribute("x", x);
                rect.setAttribute("y", y);
                rect.setAttribute("width", resolution);
                rect.setAttribute("height", resolution);

                // Assign each centroid's proximity area a clear, saturated color
                rect.setAttribute("fill", closestCentroid.color);
                rect.setAttribute("stroke", closestCentroid.color);
                rect.setAttribute("opacity", 0.3); // Adjust opacity for background area
                svg.appendChild(rect);
            }
        }
    }

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
        centroidCircle.setAttribute("fill", centroid.color); // Centroid color
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
        const colors = ["red", "blue", "green", "purple", "orange"];
        const centroid = {
            x: Math.random() * 500,
            y: Math.random() * 500,
            color: colors[centroids.length % colors.length]
        };
        centroids.push(centroid); // Add the new centroid
        renderGraph(); // Re-render the graph with the existing points and the new centroid
    };

    // Placeholder for the "Go" button functionality
    const goAction = () => {
        console.log("Go button clicked!");
        // Add any logic you want for the "Go" button
    };

    // Reset the graph and remove centroids
    const resetGraph = () => {
        centroids = [];
        renderGraph(); // Re-render the graph with no centroids
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
                // Other layouts can be added here
                default:
                    console.log("Unknown layout:", layout);
                    return;
            }
            renderGraph();
        }
    });
});
