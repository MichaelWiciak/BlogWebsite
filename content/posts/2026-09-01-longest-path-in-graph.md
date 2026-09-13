---
title: "The Longest Path in a Graph"
date: 2026-09-13
excerpt: "What happens when we run Shortest-Path Logic backwards"
tags: [algorithms, math, graph-theory, python]
published: true
---

We are obsessed with shortest paths. Dijkstra, $A^*$, Bellman-Ford—every standard curriculum drills algorithms designed to minimize cost, time, or distance.

Yet last night I hit a problem that flipped the objective: given a set of target nodes $H \subset V$ on a graph $G=(V, E)$, find the node $v \in V$ that maximizes the distance to its nearest target node $h \in H$.

$$v^* = \arg\max_{v \in V} \min_{h \in H} d(v, h)$$

It made me realize how rarely we treat **isolation** as a primary graph metric.

## BFS vs DFS: The Geometry of Traversal

My immediate instinct was to pit standard traversals against each other.

- **DFS:** Follow a branch until hit a dead end, tracking path length $L$. Intuitive, but dangerous—DFS naturally explores _depth_, not global distance. On general graphs, it risks getting stuck in deep subtrees without guaranteed global upper bounds on path length without exhausting the search space.
- **BFS:** Wavefront propagation. The property we usually exploit is that the first time a node is touched, it is reached via the shortest path. By symmetry, the _last node touched_ in a multi-source expansion is guaranteed to be the maximum shortest distance.

While single-source DFS gives a simple long branch length $\mathcal{O}(\vert{}V\vert{})$, multi-source BFS expands all target nodes simultaneously like ripples in a pond:

```python
# Multi-source BFS propagation front
queue = deque(H)
distances = {h: 0 for h in H}

while queue:
    curr = queue.popleft()
    for nxt in graph[curr]:
        if nxt not in distances:
            distances[nxt] = distances[curr] + 1
            queue.append(nxt) # Last node appended is argmax v*

```

## The Mathematical Duality

If $H = \{h\}$ (a single origin), finding $\max_v d(v, h)$ is equivalent to finding the **eccentricity** $\epsilon(h)$ of that node.

The maximum eccentricity across the entire graph defines its **diameter** $\text{diam}(G)$:

$$\text{diam}(G) = \max_{u, v \in V} d(u, v)$$

When $\vert{}H\vert{} > 1$, we are fundamentally computing the **Voronoi diagram** over a discrete graph metric space $(V, d)$, where each cell $C_i$ belongs to site $h_i \in H$:

$$C_i = \{v \in V \mid d(v, h_i) \le d(v, h_j) \; \forall j \neq i\}$$

The node we want sits precisely on the "furthest boundary" between these expanding Voronoi fronts—the point of maximum topological distance from all origins.

| Strategy             | Time                                             | Guarantee      | Mathematical Insight                    |
| -------------------- | ------------------------------------------------ | -------------- | --------------------------------------- |
| **Multi-Source BFS** | $\mathcal{O}(\Vert{}V\Vert{} + \Vert{}E\Vert{})$ | Global Exact   | Concurrent Voronoi expansion            |
| **Tree DP**          | $\mathcal{O}(\Vert{}V\Vert{})$                   | Global Exact   | Bottom-up / Top-down radius combination |
| **Naive DFS**        | $\mathcal{O}(\Vert{}V\Vert{}!)$ worst            | Path-dependent | Local depth, no distance guarantees     |

Inverting the question from _"how close can we get?"_ to _"how far can we hide?"_ doesn't require complex machinery—just running the shortest-path logic backwards.
