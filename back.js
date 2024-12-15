document.addEventListener("DOMContentLoaded", () => {
    const buttonContainer = document.getElementById("button-container");
    const subButtonContainer = document.getElementById("sub-button-container");
    const graphContainer = document.getElementById("graph-container");
    const buttonContainerBelow = document.createElement('div'); // Container for buttons below the graph
    let points = []; // Points array that holds the generated points
    let centroids = []; // Store centroids
    const PADDING = 10;

// Function to clear the graph container
const clearGraph = () => {
    graphContainer.innerHTML = "";
    buttonContainerBelow.innerHTML = ""; // Clear buttons when graph is cleared
};

// Function to generate 100 points in a uniform layout
const generateUniformLayout = () => {
    const graphWidth = 500 - 2 * PADDING; // Adjust for padding
    const points = [];
    for (let i = 0; i < 100; i++) {
        points.push({
            x: Math.random() * graphWidth + PADDING, // Add padding
            y: Math.random() * graphWidth + PADDING  // Add padding
        });
    }
    return points;
};

const generateGaussianMixture = () => {
    const points = [];
    const numClusters = 3; // Number of clusters
    const clusterSpread = 100; // Spread of the points around the center
    const graphWidth = 500 - 2 * PADDING; // Adjust for padding

    for (let i = 0; i < numClusters; i++) {
        const centerX = Math.random() * graphWidth + PADDING;
        const centerY = Math.random() * graphWidth + PADDING;

        for (let j = 0; j < 40; j++) { // Generate 40 points per cluster
            const x = centerX + (Math.random() - 0.5) * clusterSpread;
            const y = centerY + (Math.random() - 0.5) * clusterSpread;
            points.push({ x, y });
        }
    }

    return points;
};

const generateSmileyLayout = () => {
    const points = [];
    const radius = 100;
    const eyeRadius = 15;

    // Smiley face outer circle
    for (let angle = 0; angle < Math.PI * 2; angle += 0.1) {
        const x = 250 + radius * Math.cos(angle);
        const y = 250 + radius * Math.sin(angle);
        points.push({ x, y });
    }

    // Left eye
    for (let angle = 0; angle < Math.PI * 2; angle += 0.1) {
        const x = 200 + eyeRadius * Math.cos(angle);
        const y = 200 + eyeRadius * Math.sin(angle);
        points.push({ x, y });
    }

    // Right eye
    for (let angle = 0; angle < Math.PI * 2; angle += 0.1) {
        const x = 300 + eyeRadius * Math.cos(angle);
        const y = 200 + eyeRadius * Math.sin(angle);
        points.push({ x, y });
    }

    // Smile
    for (let angle = Math.PI / 4; angle < Math.PI * 3 / 4; angle += 0.1) {
        const x = 200 + 80 * Math.cos(angle);
        const y = 350 + 40 * Math.sin(angle);
        points.push({ x, y });
    }

    return points.map(point => ({
        x: Math.max(PADDING, Math.min(500 - PADDING, point.x)),
        y: Math.max(PADDING, Math.min(500 - PADDING, point.y))
    }));
};

const generateSpiralLayout = () => {
    const points = [];
    const numPoints = 200;
    const spiralFactor = 5; // Controls the distance between coils

    for (let i = 0; i < numPoints; i++) {
        const angle = 0.1 * i; // Increasing angle for spiral
        const radius = spiralFactor * Math.sqrt(i); // Increasing radius
        const x = 250 + radius * Math.cos(angle);
        const y = 250 + radius * Math.sin(angle);
        points.push({ x, y });
    }

    return points.map(point => ({
        x: Math.max(PADDING, Math.min(500 - PADDING, point.x)),
        y: Math.max(PADDING, Math.min(500 - PADDING, point.y))
    }));
};

const generateGridLayout = () => {
    const points = [];
    const gridSize = 10; // Number of rows and columns
    const spacing = (500 - 2 * PADDING) / (gridSize - 1); // Distance between points

    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            const x = PADDING + i * spacing;
            const y = PADDING + j * spacing;
            points.push({ x, y });
        }
    }

    return points;
};

const generateClusteredCircles = () => {
    const points = [];
    const numClusters = 6;
    const clusterRadius = 30;
    const numPoints = 30;
    const graphWidth = 500 - 2 * PADDING; // Adjust for padding

    for (let i = 0; i < numClusters; i++) {
        const centerX = Math.random() * graphWidth + PADDING;
        const centerY = Math.random() * graphWidth + PADDING;

        for (let j = 0; j < numPoints; j++) {
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * clusterRadius;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            points.push({ x, y });
        }
    }

    return points.map(point => ({
        x: Math.max(PADDING, Math.min(500 - PADDING, point.x)),
        y: Math.max(PADDING, Math.min(500 - PADDING, point.y))
    }));
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
    const resolution = 3; // Resolution of the grid
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
        circle.setAttribute("fill", point.color || "black");
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
    if (centroids.length >= 7) {
        alert("You can only add up to 7 centroids.");
        return; // Prevent adding more than 7 centroids
    }

    const colors = ["red", "blue", "green", "purple", "orange", "gray", "pink"];
    const centroid = {
        x: Math.random() * 500,
        y: Math.random() * 500,
        color: colors[centroids.length % colors.length]
    };
    centroids.push(centroid); // Add the new centroid
    renderGraph(); // Re-render the graph with the existing points and the new centroid
};


    // Implement the K-means algorithm when the "Go" button is clicked
    const goAction = () => {
        // Step 1: Assign points to the closest centroid
        const clusters = Array(centroids.length).fill().map(() => []); // Create an empty cluster for each centroid
        
        points.forEach(point => {
            const closestCentroid = getClosestCentroid(point.x, point.y);
            const centroidIndex = centroids.indexOf(closestCentroid);
            clusters[centroidIndex].push(point); // Add the point to the corresponding centroid's cluster
        });
    
        // Step 2: Recalculate the centroids based on the assigned points
        centroids.forEach((centroid, index) => {
            const clusterPoints = clusters[index];
            if (clusterPoints.length > 0) {
                // Calculate the average position of the points in the cluster
                const avgX = clusterPoints.reduce((sum, point) => sum + point.x, 0) / clusterPoints.length;
                const avgY = clusterPoints.reduce((sum, point) => sum + point.y, 0) / clusterPoints.length;
    
                centroid.x = avgX;
                centroid.y = avgY;
            }
        });
    
        // Reassign the points to their nearest centroid and update the colors
        reassignPoints();
    
        // Re-render the graph with updated centroids but without updating point colors yet
        renderGraph();
    
    };
    

    const reassignPoints = () => {
    points.forEach(point => {
        const closestCentroid = getClosestCentroid(point.x, point.y);
        point.color = closestCentroid.color; // Assign the color of the closest centroid to the point
    });

    // Re-render the graph with the updated point colors
    renderGraph();
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
                case "gaussian-mixture":
                    points = generateGaussianMixture();
                    break;
                case "smiley":
                    points = generateSmileyLayout();
                    break;
                case "spiral":
                    points = generateSpiralLayout();
                    break;
                case "grid":
                    points = generateGridLayout();
                    break;
                case "clustered-circles":
                    points = generateClusteredCircles();
                    break;
                default:
                    console.log("Unknown layout:", layout);
                    return;
            }
            renderGraph();
        }
    });
});
