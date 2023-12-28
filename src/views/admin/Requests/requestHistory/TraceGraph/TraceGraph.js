// import { useEffect, useState } from "react";
// import ReactFlow, {
//   Background,
//   Controls,
//   useEdgesState,
//   useNodesState,
// } from "reactflow";
// import "reactflow/dist/style.css";
// import axios from "services/axios.inercept";

// const startX = 500;
// const height = 70;
// const width = 140;
// const fixedY = 50;
// const fixedX = 50;

// const nodeStyle = {
//   width: "140px",
//   height: "70px",
//   borderTop: "2px solid #2F80ED",
//   textAlign: "center",
//   boxShadow: "0px 10px 10px rgba(0, 0, 0, 0.1)",
//   padding: "5px 0",
//   borderRadius: "5px",
// };

// const edges = [
//   {
//     id: "1-2",
//     source: "1",
//     target: "2",
//     // label: 'خالد محمد فتحي',
//     type: "step",
//   },
//   {
//     id: "1-3",
//     source: "1",
//     target: "3",
//     // label: 'خالد محمد فتحي',
//     type: "step",
//   },
//   {
//     id: "1-4",
//     source: "1",
//     target: "4",
//     // label: 'خالد محمد فتحي',
//     type: "step",
//   },
//   {
//     id: "5-4",
//     source: "4",
//     target: "5",
//     // label: 'خالد محمد فتحي',
//     type: "step",
//   },
//   {
//     id: "5-6",
//     source: "5",
//     target: "6",
//     // label: 'خالد محمد فتحي',
//     type: "step",
//   },
// ];

// const nodes = [
//   {
//     id: "1",
//     data: {
//       label: " بتنجان مقلي مخلل جامد جدا جدا بتنجان مقلي مخلل جامد جدا",
//     },
//     position: { x: startX, y: 0 },
//     // targetPosition: "right",
//     type: "input",
//     style: {
//       width: "140px",
//       height: "70px",
//       borderTop: "2px solid #2F80ED",
//       textAlign: "center",
//       boxShadow: "0px 10px 10px rgba(0, 0, 0, 0.1)",
//       padding: "5px 0",
//       borderRadius: "5px",
//     },
//   },
//   {
//     id: "2",
//     type: "output",
//     // parentNode: "1",
//     // extent: "parent",
//     data: { label: "بطيخ احمر اللون" },
//     // position: { x: width + fixedX, y: height + fixedY }, //with parent
//     position: { x: startX + width + fixedX, y: height + fixedY },

//     style: {
//       width: "140px",
//       height: "70px",
//       borderTop: "2px solid #2F80ED",
//       textAlign: "center",
//       boxShadow: "0px 10px 10px rgba(0, 0, 0, 0.1)",
//       padding: "5px 0",
//       borderRadius: "5px",
//     },
//   },
//   {
//     id: "3",
//     type: "output",
//     // parentNode: "1",
//     // extent: "parent",
//     data: { label: "جمبري بالريد صوص" },
//     // position: { x: -1 * width + -1 * fixedX, y: height + fixedY }, //with parent
//     position: { x: startX + -1 * width + fixedX, y: height + fixedY },

//     style: {
//       width: "140px",
//       height: "70px",
//       borderTop: "2px solid #2F80ED",
//       textAlign: "center",
//       boxShadow: "0px 10px 10px rgba(0, 0, 0, 0.1)",
//       padding: "5px 0",
//       borderRadius: "5px",
//     },
//   },
//   {
//     id: "4",
//     // parentNode: "1",
//     // extent: "parent",
//     data: {
//       label:
//         " جمبري بالويت صوص  جمبري بالويت صوص  جمبري بالويت صوص جمبري بالويت صوص",
//     },
//     // position: { x: -width * 2 - fixedX * 2, y: height + fixedY }, //with parent
//     position: { x: startX + -2 * width + -2 * fixedX, y: height + fixedY },

//     style: {
//       width: "140px",
//       height: "70px",
//       borderTop: "2px solid #2F80ED",
//       textAlign: "center",
//       boxShadow: "0px 10px 10px rgba(0, 0, 0, 0.1)",
//       padding: "5px 0",
//       borderRadius: "5px",
//     },
//   },
//   {
//     id: "5",
//     data: { label: "جمبري  سادة" },
//     parentNode: "4",
//     extent: "parent",
//     position: { x: 0, y: height + fixedY },

//     style: {
//       width: "140px",
//       height: "70px",
//       borderTop: "2px solid #2F80ED",
//       textAlign: "center",
//       boxShadow: "0px 10px 10px rgba(0, 0, 0, 0.1)",
//       padding: "5px 0",
//       borderRadius: "5px",
//     },
//   },
//   {
//     id: "6",
//     type: "output",
//     parentNode: "5",
//     extent: "parent",
//     data: { label: "جمبري  مقلي" },
//     position: { x: 0, y: height + fixedY },
//     style: {
//       width: "140px",
//       height: "70px",
//       borderTop: "2px solid #2F80ED",
//       textAlign: "center",
//       boxShadow: "0px 10px 10px rgba(0, 0, 0, 0.1)",
//       padding: "5px 0",
//       borderRadius: "5px",
//     },
//   },
// ];

// const connectionLineStyle = { stroke: "white" };
// function TraceGraph({ reqCode }) {
//   const [nodes, setNodes] = useNodesState([]);
//   const [edges, setEdges] = useEdgesState([]);

//   function reShapeData() {
//     axios.get(`/admin/traceability/${reqCode}/trace`).then((res) => {
//       // console.log(res);
//       console.log("res", res.data.data);
//       let nodes = [
//         {
//           id: reqCode,
//           type: "input",
//           // parentNode: "5",
//           // extent: "parent",
//           data: { label: reqCode },
//           position: { x: 0, y: 0 },
//           style: nodeStyle,
//         },
//       ];
//       let edges = [];
//       let position = -1;

//       res.data.data.forEach((ele, itr) => {
//         edges.push({
//             id: `${ele.from}-${ele.to}`,
//             source: ele.from,
//             target: ele.to,
//             // label: 'خالد محمد فتحي',
//             type: "step",
//           });
//         if (ele.transactionType === "CHARGE_TO_STORE") {
//           // const to = ele.to + Math.random() * 10;
//           // const variety = edges.push({
//           //   id: `${ele.from}-${to}`,
//           //   source: ele.from,
//           //   target: to,
//           //   type: "step",
//           // });
//           position = -1 * position; //draw node in right side or left side
//           nodes.push({
//             id: ele.to,
//             //  type: "input",
//             parentNode: reqCode,
//             extent: "parent",
//             data: {
//               label:
//                 ele.amount +
//                 "\n" +
//                 `${ele.variety}الصنف : ` +
//                 "\n" +
//                 `${ele.amount} : الكمية` +
//                 "\n" +
//                 `تاريخ العملية : ${ele.transactionDate.substring(0, 10)}`,
//             },
//             position: { x: position * (width + fixedX), y: height + fixedY },
//             style: nodeStyle,
//           });
//           // res.data.data
//           //   .filter((item) => item.from === ele.to)
//           //   .map((item) => {
//           //     edges.push({
//           //       id: `${to}-${item.to}`,
//           //       source: item.to,
//           //       target: to,
//           //       type: "step",
//           //     });
//           //     position = -1 * position; //draw node in right side or left side
//           //     nodes.push({
//           //       id: item.to,
//           //       //  type: "input",
//           //       parentNode: to,
//           //       extent: "parent",
//           //       data: {
//           //         label: `ele.amount

//           //           ${ele.variety}الصنف :

//           //           ${ele.amount} : الكمية

//           //         تاريخ العملية : ${ele.transactionDate.substring(0, 10)}`,
//           //       },
//           //       position: {
//           //         x: position * (width + fixedX) + 100,
//           //         y: height + fixedY + 100,
//           //       },
//           //       style: nodeStyle,
//           //     });
//           //   });

//           if (position < 0) position *= 2; //update only when there are nodes in left and right
//           console.log("nodes", nodes);

//           // else if(ele.transactionType === "STORE_TO_DISTRIBUTER"){}
//           // console.log(ele);
//         }
//       });
//       setNodes(nodes);
//       setEdges(edges);
//     });
//   }
//   useEffect(() => {
//     console.log("nodes hook", nodes);
//   }, [nodes]);
//   useEffect(() => {
//     if (reqCode) {
//       console.log("ueEffect logged");
//       reShapeData();
//     }
//   }, [reqCode]);
//   return (
//     <div style={{ height: "50em", direction: "ltr" }}>
//       <ReactFlow
//         nodes={nodes}
//         edges={edges}
//         fitView
//         connectionLineStyle={connectionLineStyle}
//       >
//         <Background />
//         {/* <Controls /> */}
//       </ReactFlow>
//     </div>
//   );
// }

// export default TraceGraph;

// import React, { useCallback, useEffect, useState } from 'react';
// import Tree from 'react-d3-tree';
// import './test.css';

// const myTreeData = {
//   name: 'CEO test test test test test',
//   children: [
//     {
//       name: 'Manager',
//       attributes: {
//         department: 'Production',
//       },
//       children: [
//         {
//           name: 'Foreman',
//           attributes: {
//             department: 'Fabrication',
//           },
//           children: [
//             {
//               name: 'Worker',
//             },
//             {
//               name: 'ddddddddddddddddhjhgkjhdddddds',
//               fd: 'rerererererer',
//               k: 'rerererererer',
//               children: [
//                 {
//                   name: 'Worker',
//                 },
//                 {
//                   name: 'dddddddddddl;klfgdfdddddddddddds',
//                   fd: 'rerererererer',
//                   k: 'rerererererer',
//                 },
//                 {
//                   name: 'ddddddddddhghhjkkjdddddddddddds',
//                   fd: 'rerererererer',
//                   k: 'rerererererer',
//                 },
//               ],
//             },
//             {
//               name: 'ddddddddddkkkkkkkkdddddddds',
//               fd: 'rerererererer',
//               k: 'rerererererer',
//               children: [
//                 {
//                   name: 'Worker',
//                 },
//                 {
//                   name: 'dddddfffddddddddddkkkkkkksddddddds',
//                   fd: 'rerererererer',
//                   k: 'rerererererer',
//                 },
//                 {
//                   name: 'dddddddddddddssssssssdddddddddds',
//                   fd: 'rerererererer',
//                   k: 'rerererererer',
//                 },
//               ],
//             },
//           ],
//         },
//         {
//           name: 'Foreman',
//           attributes: {
//             department: 'Assembly',
//           },
//           children: [
//             {
//               name: 'Foreman',
//               attributes: {
//                 department: 'Fabrication',
//               },
//               children: [
//                 {
//                   name: 'Worker',
//                   children: [
//                     {
//                       name: 'Worker',
//                     },
//                     {
//                       name: 'ddddjhjhkljklkredddddddddddddds',
//                       fd: 'rerererererer',
//                       k: 'rerererererer',
//                     },
//                     {
//                       name: 'ddddddddddddddddjhjkhjhjhjhdddds',
//                       fd: 'rerererererer',
//                       k: 'rerererererer',
//                     },

//                     {
//                       name: 'ddfgfgfgfgddddddddddddddddds',
//                       fd: 'rerererererer',
//                       k: 'rerererererer',
//                     },
//                   ],
//                 },

//                 {
//                   name: 'ddddddddddddddrer4hghdddddds',
//                   fd: 'rerererererer',
//                   k: 'rerererererer',
//                 },
//               ],
//             },
//             {
//               name: 'Worker',
//             },
//             {
//               name: 'dddddddddddaaaaaaaaaaaaadddddds',
//               fd: 'rerererererer',
//               k: 'rerererererer',
//             },
//             {
//               name: 'dddddddddddadddddddddvvvvvvvdddddds',
//               fd: 'rerererererer',
//               k: 'rerererererer',
//             },
//             {
//               name: 'rerererererer',
//               fd: 'rerererererer',
//               k: 'rerererererer',
//             },
//           ],
//         },
//       ],
//     },
//   ],
// };

// const svgSquare = {
//   shape: 'rect',
//   shapeProps: {
//     width: 180,
//     height: 40,
//     x: 0,
//     y: -20,
//     color: '#ffffff',
//   },
// };

// const test = {
//   shape: 'rect',
//   shapeProps: {
//     width: 0,
//     height: 0,
//     x: -20,
//     y: 20,
//     stroke: '#2F80ED',
//   },
// };

// const nodeStyle = (
//   <svg viewbox="0 0 100 60" xmlns="http://www.w3.org/2000/svg">
//     <rect
//       width="80"
//       height="40"
//       x="10"
//       y="10"
//       style="fill: skyblue; stroke: cadetblue; stroke-width: 2;"
//     />
//   </svg>
// );

// const treeStyle = {
//   nodes: {
//     node: {
//       circle: <nodeStyle />,
//       name: <nodeStyle />,
//       attributes: <nodeStyle />,
//     },
//   },
// };

// class NodeLabel extends React.PureComponent {
//   render() {
//     const { className, nodeData } = this.props;
//     console.log(nodeData);
//     return (
//       <div
//         className={className}
//         style={{
//           background: 'red',
//           height: '70px',
//           borderTop: '2px solid #2F80ED',
//           textAlign: 'center',
//           // position: "fixed",
//           zIndex: '1000',
//           // left: "-10px",
//           boxShadow: '0px 10px 10px rgba(0, 0, 0, 0.1)',
//           padding: '5px 0',
//           borderRadius: '5px',
//         }}
//       >
//         {nodeData.name}
//       </div>
//     );
//   }
// }

// const useCenteredTree = () => {
//   const [translate, setTranslate] = React.useState({ x: 0, y: 0 });
//   const containerRef = React.useCallback((containerElem) => {
//     if (containerElem !== null) {
//       const { width, height } = containerElem.getBoundingClientRect();
//       setTranslate({ x: width / 2, y: height / 2 });
//     }
//   }, []);
//   return [translate, containerRef];
// };

// function NodeTest({ data }) {
//   return (
//     <foreignObject x={-70} y={-70} width={140} height={80}>
//       <div
//         style={{
//           // background: 'red',
//           width: '140px',
//           height: '70px',
//           borderTop: '2px solid #2F80ED',
//           textAlign: 'center',
//           // position: "fixed",
//           // zIndex: "100000",
//           // left: "-10px",
//           boxShadow: '0px 10px 10px rgba(0, 0, 0, 0.1)',
//           padding: '5px 0',
//           borderRadius: '5px',
//         }}
//       >
//         {data}
//       </div>
//     </foreignObject>
//   );
// }

// function TraceGraph({ reqCode }) {
//   const [translate, containerRef] = useCenteredTree();
//   return (
//     <div style={{ width: '80em', height: '50em' }} ref={containerRef}>
//       <Tree
//         data={myTreeData}
//         orientation="vertical"
//         pathFunc="step"
//         // nodeSize={{ x: 200, y: 200 }}
//         separation={{ siblings: 2, nonSiblings: 4 }}
//         translate={translate}
//         depthFactor="450"
//         // allowForeignObjects={true}
//         // rootNodeClassName="node__branch"
//         // nodeSize={{x:'170px',y:'70px'}}
//         renderCustomNodeElement={(wew) => {
//           console.log(wew.nodeDatum.name);
//           return (
//             // <NodeTest data={wew.nodeDatum.name} />
//             <g>
//               <rect
//                 fill="white"
//                 width={`${140 + wew.nodeDatum.name.length * 1.5}px`}
//                 height={`${70 + wew.nodeDatum.name.length * 5}px`}
//                 x={-70}
//                 rx={5}
//                 style={{ fill: 'skyblue', stroke: 'cadetblue', strokeWidth: 2 }}
//               />
//               <text x="20" y="30" textAnchor="middle">
//                 {wew.nodeDatum.name}
//               </text>
//               <text x="20" y="50" textAnchor="middle">
//                 {wew.nodeDatum.fd}
//               </text>
//             </g>
//           );
//         }}
//         // pathFunc="step"
//         // nodeSvgShape={svgSquare}
//         // nodeSvgShape={test}
//         // separation={{ siblings: 2, nonSiblings: 2 }}
//         // translate={{ x: 900, y: 100 }}
//         // allowForeignObjects={true}

//         // foreignObjectWrapper: {
//         //   width: 220,
//         //   height: 200,
//         //   y: -50,
//         //   x: -100,
//         // },
//         // initialDepth={0.02}
//       />
//     </div>
//   );
// }
// export default TraceGraph;

import React, { useEffect, useState } from "react";
import "@mohamed-hossam50/takweed-trace-graph/Treant.css";
// import '@mohamed-hossam50/takweed-trace-graph/examples/basic-example/basic-example.css';
import "./traceGraph.css";
import Raphael from "@mohamed-hossam50/takweed-trace-graph/vendor/raphael";
// import Raphael from './raphael';

import $ from "jquery";
import "@mohamed-hossam50/takweed-trace-graph/Treant.js";
import axiosApiInstance from "services/axios.inercept";
import { Toaster, toast } from "react-hot-toast";
// import './Treant.min.js';
import { Spinner } from "reactstrap";

window.Raphael = Raphael;
// window.$ = $;

// var config = {
//   container: "#basic-example",

//   connectors: {
//     type: "step",
//   },
//   node: {
//     HTMLclass: "nodeExample1",
//   },
// };
// const ceo = {
//   text: {
//     name: "2248020007",
//   },
// };
// const cto = {
//   parent: ceo,
//   text: {
//     name: "Joe Linux",
//     title: "Chief Technology Officer",
//   },
//   // stackChildren: true,
// };
// const cbo = {
//   parent: ceo,
//   // stackChildren: true,
//   text: {
//     name: "Linda May",
//     title: "Chief Business Officer",
//     a: "Tel: 01 213 123 134",
//     b: "Tel: 01 213 123 134",
//     c: "Tel: 01 213 123 134",
//     d: "Tel: 01 213 123 134",
//     f: "Tel: 01 213 123 134",
//   },
// };
// const cdo = {
//   parent: ceo,
//   text: {
//     name: "John Green",
//     title: "Chief accounting officer",
//     contact: "Tel: 01 213 123 134",
//     from: "Tel: 01 213 123 134",
//     b: "Tel: 01 213 123 134",
//     c: "Tel: 01 213 123 134",
//     d: "Tel: 01 213 123 134",
//     f: "Tel: 01 213 123 134",
//   },
// };
// const cio = {
//   parent: cto,
//   text: {
//     name: "Ron Blomquist",
//     title: "Chief Information Security Officer",
//   },
// };
// const ciso = {
//   parent: cto,
//   text: {
//     name: "Michael Rubin",
//     title: "Chief Innovation Officer",
//     contact: {
//       val: "we@aregreat.com",
//       href: "mailto:we@aregreat.com",
//       a: "Tel: 01 213 123 134",
//       b: "Tel: 01 213 123 134",
//       c: "Tel: 01 213 123 134",
//       d: "Tel: 01 213 123 134",
//       f: "Tel: 01 213 123 134",
//     },
//   },
// };
// const cio2 = {
//   parent: cdo,
//   text: {
//     name: "Erica Reel",
//     title: "Chief Customer Officer",
//   },
//   link: {
//     href: "http://www.google.com",
//   },
// };
// const ciso2 = {
//   parent: cbo,
//   text: {
//     name: "Alice Lopez",
//     title: "Chief Communications Officer",
//   },
// };
// const cio3 = {
//   parent: cdo,
//   text: {
//     name: "Erica Reel",
//     title: "Chief Customer Officer",
//   },
//   link: {
//     href: "http://www.google.com",
//   },
// };

// const ciso3 = {
//   parent: cbo,
//   text: {
//     name: "Mary Johnson",
//     title: "Chief Brand Officer",
//   },
// };
// const ciso4 = {
//   parent: cbo,
//   text: {
//     name: "Kirk Douglas",
//     title: "Chief Business Development Officer",
//     a: "Tel: 01 213 123 134",
//     b: "Tel: 01 213 123 134",
//     c: "Tel: 01 213 123 134",
//     d: "Tel: 01 213 123 134",
//     f: "Tel: 01 213 123 134",
//   },
// };
// const ciso5 = {
//   parent: cbo,
//   text: {
//     name: "Kirk Douglas",
//     title: "Chief Business Development Officer",
//   },
// };
// const simple_chart_config = [
//   config,
//   cto,
//   cbo,
//   ceo,
//   cdo,
//   cio,
//   ciso,
//   cio2,
//   ciso2,
//   ciso3,
//   cio3,
//   ciso5,
//   ciso4,
// ];

// var Treant = require('treantjs/Treant');
// Treant = Treant.Treant;
// const config = {
//   container: '#tree-simple',
// };
// const parent_node = {
//   text: { name: 'Parent node' },
// };
// const first_child = {
//   parent: parent_node,
//   text: { name: 'First child' },
// };
// const second_child = {
//   parent: parent_node,
//   text: { name: 'Second child' },
// };
// const simple_chart_config = [config, parent_node, first_child, second_child];

function TraceGraph({ reqCode }) {
  // console.log(window.Treant);
  // var chart = new window.Treant(simple_chart_config, function () {
  //   alert('Tree Loaded');
  // });
  const [graphData, setGraphData] = useState([]);
  const [loading, setLoading] = useState(true);

  function getGraphData() {
    // const data = [
    //   {
    //     from: "2248020007",
    //     to: "store1",
    //     varieties: [
    //       { variety: "بطيخ", amount: 100 },
    //       { variety: "بطيخ", amount: 100 },
    //       { variety: "بطيخ", amount: 100 },
    //     ],
    //   },
    //   {
    //     from: "2248020007",
    //     to: "store2",
    //     varieties: [
    //       { variety: "بطيخ", amount: 100 },
    //       { variety: "بطيخ", amount: 100 },
    //       { variety: "بطيخ", amount: 100 },
    //     ],
    //     HTMLclass: "red",
    //   },
    //   {
    //     from: "2248020007",
    //     to: "store3",
    //     varieties: [
    //       { variety: "بطيخ", amount: 100 },
    //       { variety: "بطيخ", amount: 100 },
    //       { variety: "بطيخ", amount: 100 },
    //     ],
    //   },
    //   {
    //     from: "store1",
    //     to: "dist1",
    //     varieties: [
    //       { variety: "بطيخ", amount: 100 },
    //       { variety: "بطيخ", amount: 100 },
    //       { variety: "بطيخ", amount: 100 },
    //     ],
    //   },
    //   {
    //     from: "store1",
    //     to: "dist2",
    //     varieties: [
    //       { variety: "بطيخ", amount: 100 },
    //       { variety: "بطيخ", amount: 100 },
    //       { variety: "بطيخ", amount: 100 },
    //     ],
    //   },
    //   {
    //     from: "store2",
    //     to: "dist3",
    //     varieties: [
    //       { variety: "بطيخ", amount: 100 },
    //       { variety: "بطيخ", amount: 100 },
    //       { variety: "بطيخ", amount: 100 },
    //     ],
    //   },
    //   {
    //     from: "store2",
    //     to: "dist4",
    //     varieties: [
    //       { variety: "بطيخ", amount: 100 },
    //       { variety: "بطيخ", amount: 100 },
    //       { variety: "بطيخ", amount: 100 },
    //     ],
    //   },
    //   {
    //     from: "store3",
    //     to: "dist4",
    //     varieties: [
    //       { variety: "بطيخ", amount: 100 },
    //       { variety: "بطيخ", amount: 100 },
    //       { variety: "بطيخ", amount: 100 },
    //     ],
    //   },
    // ];

    // const objects = [
    //   {
    //     text: {
    //       name: '2248020007',
    //     },
    //   },
    // ];

    // const storeData = data.filter((el) => {
    //   return el.from === reqCode;
    // });
    // const distData = data.filter((el) => {
    //   return el.from !== reqCode;
    // });

    // const dataWithStores = storeData.forEach((el, i) => {
    //   console.log(el);
    //   const varieties = [];
    //   el?.varieties.forEach((el, i) => {
    //     const name = `var${i}`;
    //     varieties.push({ [name]: `${el.variety}:${el.amount}` });
    //   });
    //   console.log(varieties);
    //   const text = { name: `${el.to}`, title: 'Chief Innovation Officer' };
    //   const result = Object.assign({}, text, ...varieties);
    //   objects.push({
    //     parent: objects[0],
    //     text: result,
    //     // innerHTML: `<span> test </span>`,
    //     ...el,
    //   });
    // });

    // const dataWithStoresAndDist = distData.forEach((outerEle, i) => {
    //   const neededIndex = objects.findIndex((innerEle) => {
    //     console.log(innerEle);
    //     return outerEle.from === innerEle?.text?.name;
    //   });
    //   console.log(neededIndex);
    //   if (neededIndex) {
    //     objects.push({
    //       parent: objects[neededIndex],
    //       text: {
    //         name: `${outerEle.to}`,
    //         title: 'Chief Innovation Officer',
    //       },
    //     });
    //   }
    // });
    setLoading(true);
    axiosApiInstance
      .get(`/admin/traceability/${reqCode}/tracetree`)
      .then((res) => {
        // console.log(res);
        // console.log('res', res.data.data);
        const objects = [
          {
            text: {
              name: reqCode,
            },
            // HTMLclass: "tracelevel1",
            HTMLclass: "requestNode",
          },
        ];

        //get from farm to store data
        const storeData = res.data.data.filter((el) => {
          return el.from === reqCode;
        });
        //get from store to distributer data
        const distData = res.data.data.filter((el) => {
          return el.fromHubType === "STORE";
        });
        // console.log(distData);
        //get from distributer to exporter data
        const exportData = res.data.data.filter((el) => {
          return el.fromHubType === "DISTRIBUTER";
        });
        storeData.forEach((el, i) => {
          // console.log(el);
          const varieties = [];
          el?.varieties.forEach((el, i) => {
            const name = `var${i}`;
            varieties.push({
              [name]: `${el.variety.replace("_", " ")} : ${el.amount}طن`,
            });
          });
          // console.log(varieties);
          // const text = { name: `${el.to}`, title: 'Chief Innovation Officer' };
          const text = {
            name: `${el.toHubName}`,
            // title: 'Chief Innovation Officer',
          };
          const result = Object.assign({}, text, ...varieties);
          objects.push({
            parent: objects[0],
            text: result,
            // HTMLclass: "tracelevel2",
            // innerHTML: `<span> test </span>`,
            ...el,
          });
        });

        distData.forEach((outerEle, i) => {
          const neededIndex = objects.findIndex((innerEle) => {
            // console.log(innerEle);
            return outerEle.fromHubName === innerEle?.text?.name;
          });
          // console.log(neededIndex);
          const varieties = [];
          outerEle?.varieties.forEach((el, i) => {
            const name = `var${i}`;
            varieties.push({
              [name]: `${el.variety.replace("_", " ")} : ${el.amount} طن`,
            });
          });
          // console.log(varieties);
          const text = {
            name: `${outerEle.toHubName}`,
          };
          const result = Object.assign({}, text, ...varieties);

          if (neededIndex) {
            objects.push({
              parent: objects[neededIndex],
              text: result,
              // HTMLclass: "tracelevel3",
              HTMLclass: "childNode",
              // innerHTML: `<span> test </span>`,
              ...outerEle,
            });
          }
        });
        exportData.forEach((outerEle, i) => {
          const neededIndex = objects.findIndex((innerEle) => {
            // console.log(innerEle);
            return outerEle.fromHubName === innerEle?.text?.name;
          });
          // console.log(neededIndex);
          const varieties = [];
          outerEle?.varieties.forEach((el, i) => {
            const name = `var${i}`;
            varieties.push({
              [name]: `${el.variety.replace("_", " ")} : ${el.amount} طن`,
            });
          });
          // console.log(varieties);
          const text = {
            name: `${outerEle.toHubName}`,
          };
          const result = Object.assign({}, text, ...varieties);

          if (neededIndex) {
            objects.push({
              parent: objects[neededIndex],
              text: result,
              // HTMLclass: "tracelevel3",
              HTMLclass: "childNode",
              // innerHTML: `<span> test </span>`,
              ...outerEle,
            });
          }
        });

        // console.log(objects);
        setGraphData(objects);
      })
      .catch((e) => {
        // console.log(e);
        setLoading(false);
        toast.error("حدث خطـأ ما");
      });
  }

  useEffect(() => {
    getGraphData();
  }, []);

  useEffect(() => {
    if (graphData.length > 0) {
      let config = {
        container: "#basic-example",

        connectors: {
          type: "step",
        },
        node: {
          HTMLclass: "nodeExample1",
        },
      };
      new window.Treant(
        // simple_chart_config,
        [config, ...graphData],
        function () {
          setLoading(false);
        },
        $
      );
    }
  }, [graphData]);

  return (
    <>
      <Toaster />
      {loading === true && <Spinner animation="border" role="status"></Spinner>}
      <div className="content" style={{ direction: "ltr" }}>
        {/* <div class="chart" id="basic-example"></div> */}
        <div
          id="basic-example"
          style={{ width: "width:2000px", hight: "10000px", direction: "ltr" }}
        ></div>
      </div>
    </>
  );
}

export default TraceGraph;
