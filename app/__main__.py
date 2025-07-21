import argparse
import numpy as np
from . import app
from .astrosolver import AstroSolver


def parse_vector(text):
    values = [float(x) for x in text.split(',') if x]
    return np.array(values)


def run_cli(args):
    solver = AstroSolver(mu=args.mu)
    knowns = {}
    if args.r:
        knowns['r'] = parse_vector(args.r)
    if args.v:
        knowns['v'] = parse_vector(args.v)
    kb = solver.solve(**knowns)
    print(kb.explain())


def main():
    parser = argparse.ArgumentParser(description="AstroSolver Toolkit")
    parser.add_argument('--cli', action='store_true', help='Run CLI instead of web')
    parser.add_argument('--r', help='Position vector components comma separated')
    parser.add_argument('--v', help='Velocity vector components comma separated')
    parser.add_argument('--mu', type=float, default=398600.4418, help='Gravitational parameter')
    args = parser.parse_args()

    if args.cli:
        run_cli(args)
    else:
        app.run(host='0.0.0.0', port=8080)


if __name__ == '__main__':
    main()
