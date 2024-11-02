from .node_definitions import Node


def build_coordinates_of_dag(dag):
    build_common_root(dag)

    queue = [dag["root"]]
    level = -1

    while queue:
        n = len(queue)
        level += 1

        for index in range(n):
            node = queue.pop(0)
            node.coordinate = (level, index)

            for kid_name in node.kids:
                kid = dag[kid_name]
                if kid.coordinate is None:
                    queue.append(kid)
                    kid.coordinate = (-1, -1)

    return dag


def build_common_root(dag):
    roots = get_all_roots(dag)
    dag["root"] = Node()

    for root in roots:
        dag["root"].kids.add(root)
        dag["root"].parents.add(root)


def get_all_roots(dag):
    res = set(dag.keys())
    for value in dag.values():
        for kid in value.kids:
            res.discard(kid)
    return list(res)

