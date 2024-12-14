document.addEventListener("DOMContentLoaded", () => {
    const buttonContainer = document.getElementById("button-container");
    const subButtonContainer = document.getElementById("sub-button-container");
    const graphContainer = document.getElementById("graph-container");

    // Function to clear the graph container
    const clearGraph = () => {
        graphContainer.innerHTML = "";
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

    const generateGaussianMixture = () => {
        const points = [];
        const centers = [
            { x: 150, y: 150 },
            { x: 350, y: 350 }
        ];

        centers.forEach(center => {
            for (let i = 0; i < 50; i++) {
                points.push({
                    x: center.x + Math.random() * 50 - 25,
                    y: center.y + Math.random() * 50 - 25
                });
            }
        });

        return points;
    };

    const generateSpiralLayout = () => {
        const points = [];
        const a = 0.5, b = 5; // Spiral parameters
        for (let i = 0; i < 100; i++) {
            const angle = 0.1 * i;
            points.push({
                x: 250 + (a + b * angle) * Math.cos(angle),
                y: 250 + (a + b * angle) * Math.sin(angle)
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
            circle.setAttribute("fill", "blue"); // Dot color
            svg.appendChild(circle);
        });

        graphContainer.appendChild(svg);
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
            let points;
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
                // Add more cases for other layouts
                default:
                    console.log("Unknown layout:", layout);
                    return;
            }
            renderGraph(points);
        }
    });
});
