import React from "react";

import Graph from "react-graph-vis";

function SecondGraph() {
  let nodes = [];
  let edges = [];
  // create 50 nodes
  for (let i = 0; i < 50; i++) {
    nodes.push({ id: i, label: `${i}`, title: "tooltip text" });
  }

  nodes.forEach((node, index) => {
    // form a mesh network with the first 10 nodes
    if (index < 5) {
      for (let i = 0; i < 9; i++) {
        if (node.id !== i) {
          edges.push({ from: node.id, to: i });
          edges.push({ from: i, to: node.id });
        }
      }
    } else {
      // connect each remaining node to one of the Prophet nodes
      edges.push({ from: node.id, to: index % 5 });
      // connect the node to its local group nodes
      for (let i = index % 5; i < nodes.length - 1; i += 5) {
        edges.push({ from: node.id, i });
      }
    }
  });

  const graph = {
    nodes,
    edges,
  };

  const options = {
    autoResize: true,
    layout: {
      hierarchical: false,
    },
    edges: {
      color: "#000000",
    },
    physics: {
      // Even though it's disabled the options still apply to network.stabilize().
      solver: "repulsion",
      repulsion: {
        nodeDistance: 400, // Put more distance between the nodes.
      },
    },
    height: "500px",
  };

  return (
    <Graph
      graph={graph}
      options={options}
      getNetwork={(network) => {
        //  if you want access to vis.js network api you can set the state in a parent component using this property
        network.stabilize();
      }}
    />
  );
}

export default SecondGraph;
