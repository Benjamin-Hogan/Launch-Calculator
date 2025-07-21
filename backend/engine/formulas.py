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


def mean_motion(a, mu):
    if a > 0:
        return sqrt(mu / a ** 3)
    return None


def semi_latus_rectum(h_mag, mu):
    return h_mag ** 2 / mu


def periapsis_distance(a, e):
    if a > 0:
        return a * (1 - e)
    return None


def apoapsis_distance(a, e):
    if a > 0 and e < 1:
        return a * (1 + e)
    return None


def node_vec(h_vec):
    k = np.array([0.0, 0.0, 1.0])
    return np.cross(k, h_vec)


def node_mag(node_vec):
    return np.linalg.norm(node_vec)


def inclination(h_vec, h_mag):
    return np.arccos(h_vec[2] / h_mag)


def raan(node_vec):
    n_mag = np.linalg.norm(node_vec)
    if n_mag == 0:
        return 0.0
    n = node_vec / n_mag
    angle = np.arccos(np.clip(n[0], -1.0, 1.0))
    if n[1] < 0:
        angle = 2 * pi - angle
    return angle


def argument_of_periapsis(node_vec, e_vec):
    n_mag = np.linalg.norm(node_vec)
    e_mag = np.linalg.norm(e_vec)
    if n_mag == 0 or e_mag == 0:
        return 0.0
    cos_arg = np.dot(node_vec, e_vec) / (n_mag * e_mag)
    angle = np.arccos(np.clip(cos_arg, -1.0, 1.0))
    if e_vec[2] < 0:
        angle = 2 * pi - angle
    return angle


def true_anomaly(e_vec, r, v):
    e_mag = np.linalg.norm(e_vec)
    r_mag_val = np.linalg.norm(r)
    if e_mag == 0:
        cos_nu = r[0] / r_mag_val
        nu = np.arccos(np.clip(cos_nu, -1.0, 1.0))
        if r[1] < 0:
            nu = 2 * pi - nu
        return nu
    cos_nu = np.dot(e_vec, r) / (e_mag * r_mag_val)
    nu = np.arccos(np.clip(cos_nu, -1.0, 1.0))
    if np.dot(r, v) < 0:
        nu = 2 * pi - nu
    return nu


def hohmann_delta_v(r1, r2, mu):
    """Return the two burn magnitudes, total \u0394V and transfer time."""
    dv1 = sqrt(mu / r1) * (sqrt(2 * r2 / (r1 + r2)) - 1)
    dv2 = sqrt(mu / r2) * (1 - sqrt(2 * r1 / (r1 + r2)))
    total = abs(dv1) + abs(dv2)
    a_trans = (r1 + r2) / 2
    tof = pi * sqrt(a_trans ** 3 / mu)
    return dv1, dv2, total, tof
