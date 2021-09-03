import React, { useEffect } from "react";

import Graph from "react-graph-vis";

function FirstGraph() {
  let nodes = [];
  let edges = [];
  for (let i = 0; i < 20; i++) {
    nodes.push({ id: i, label: ``, title: "tooltip text" });
  }
  nodes.forEach((node) => {
    for (let i = 0; i < nodes.length - 1; i++) {
      if (node.id !== i) {
        edges.push({ from: node.id, to: i });
        edges.push({ from: i, to: node.id });
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

export default FirstGraph;
