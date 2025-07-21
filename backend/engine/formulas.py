import numpy as np
from math import pi, sqrt


def r_mag(r):
    return np.linalg.norm(r)


def v_mag(v):
    return np.linalg.norm(v)


def h_vec(r, v):
    return np.cross(r, v)


def h_mag(h):
    return np.linalg.norm(h)


def specific_energy(v_mag, r_mag, mu):
    return v_mag ** 2 / 2 - mu / r_mag


def semi_major_axis(energy, mu):
    return -mu / (2 * energy)


def eccentricity_vec(r, v, mu):
    return np.cross(v, np.cross(r, v)) / mu - r / np.linalg.norm(r)


def eccentricity(e_vec):
    return np.linalg.norm(e_vec)


def orbit_type(e):
    if e < 1:
        return "elliptical"
    elif np.isclose(e, 1.0):
        return "parabolic"
    else:
        return "hyperbolic"


def period(a, mu):
    if a > 0:
        return 2 * pi * sqrt(a ** 3 / mu)
    return None
