from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Any

app = FastAPI()

# allow frontend to call us
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class Pipeline(BaseModel):
    nodes: List[Any]
    edges: List[Any]


def check_dag(nodes, edges):
    # build adjacency list
    graph = {n['id']: [] for n in nodes}
    for e in edges:
        src = e.get('source')
        tgt = e.get('target')
        if src in graph:
            graph[src].append(tgt)

    visited = set()
    rec_stack = set()

    def has_cycle(node):
        visited.add(node)
        rec_stack.add(node)
        for neighbor in graph.get(node, []):
            if neighbor not in visited:
                if has_cycle(neighbor):
                    return True
            elif neighbor in rec_stack:
                return True
        rec_stack.discard(node)
        return False

    for node_id in list(graph.keys()):
        if node_id not in visited:
            if has_cycle(node_id):
                return False
    return True


@app.get('/')
def read_root():
    return {'Ping': 'Pong'}


@app.post('/pipelines/parse')
def parse_pipeline(pipeline: Pipeline):
    nodes = pipeline.nodes
    edges = pipeline.edges
    num_nodes = len(nodes)
    num_edges = len(edges)
    is_dag = check_dag(nodes, edges)
    return {'num_nodes': num_nodes, 'num_edges': num_edges, 'is_dag': is_dag}
