# Multi-stage build for Launch Calculator

# ---- Frontend build ----
FROM node:20 AS frontend-build
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm install
COPY frontend .
RUN npm run build

# ---- Backend build ----
FROM maven:3.9.6-eclipse-temurin-11 AS backend-build
WORKDIR /app
COPY backend/pom.xml backend/pom.xml
RUN mvn -f backend/pom.xml dependency:go-offline
COPY backend ./backend
# Copy frontend build output into backend static resources
COPY --from=frontend-build /app/frontend/dist ./backend/src/main/resources/static
RUN mvn -f backend/pom.xml package -DskipTests

# ---- Runtime image ----
FROM eclipse-temurin:11-jre
WORKDIR /app
COPY --from=backend-build /app/backend/target/launch-calculator-*.jar /app/launch-calculator.jar
EXPOSE 8080
CMD ["java", "-jar", "/app/launch-calculator.jar"]
