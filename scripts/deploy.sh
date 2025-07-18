#!/bin/bash
npm --prefix frontend install
mvn -f backend/pom.xml dependency:go-offline
mvn -f backend/pom.xml -o package
npm --prefix frontend run build
cp -r frontend/dist/* backend/src/main/resources/static/
