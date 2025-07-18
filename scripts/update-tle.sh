#!/bin/bash
set -e
mkdir -p data/tle
curl -L https://celestrak.com/NORAD/elements/active.txt -o data/tle/active.txt
