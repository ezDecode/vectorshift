from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI()

# Allow frontend to call us
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class NodeItem(BaseModel):
    id: str
    # Allow any extra fields from the frontend
    class Config:
        extra = "allow"


class EdgeItem(BaseModel):
    source: str
    target: str
    # Allow any extra fields from the frontend
    class Config:
        extra = "allow"


class Pipeline(BaseModel):
    nodes: List[NodeItem]
    edges: List[EdgeItem]


def check_dag(nodes: list[NodeItem], edges: list[EdgeItem]) -> bool:
    """Check if the pipeline forms a valid Directed Acyclic Graph.

    Uses depth-first search with a recursion stack to detect cycles.
    Returns True if no cycles are found (valid DAG), False otherwise.

    Note: The frontend also blocks cycles in real-time (store.js → onConnect).
    This serves as a server-side safety net on submit.
    """
    graph = {n.id: [] for n in nodes}
    for e in edges:
        if e.source in graph:
            graph[e.source].append(e.target)

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
    num_nodes = len(pipeline.nodes)
    num_edges = len(pipeline.edges)
    is_dag = check_dag(pipeline.nodes, pipeline.edges)
    return {'num_nodes': num_nodes, 'num_edges': num_edges, 'is_dag': is_dag}
