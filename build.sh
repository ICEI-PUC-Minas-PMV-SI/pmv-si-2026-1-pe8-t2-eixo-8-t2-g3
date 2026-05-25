#!/bin/bash
set -e

echo "=== Build do React ==="
cd react
npm install
npm run build
cd ..

echo "=== Copiando build do React para o Quarkus ==="
mkdir -p quarkus/src/main/resources/META-INF/resources
cp -r react/build/client/* quarkus/src/main/resources/META-INF/resources/

echo "=== Build do Quarkus ==="
cd quarkus
./mvnw package -DskipTests
cd ..

echo "=== Copiando JAR para o Electron ==="
JAR="quarkus/target/desejonatural-1.0.0-runner.jar"
if [ -f "$JAR" ]; then
  cp "$JAR" electron/resources/
  echo "JAR copiado para electron/resources/"
fi

echo ""
echo "=== Build concluido! ==="
echo ""
echo "  Modo servidor: java -jar quarkus/target/desejonatural-1.0.0-runner.jar"
echo "  Acesse:        http://localhost:8080/"
echo ""
echo "  Modo desktop:  cd electron && npm install && bash build-resources.sh && npm start"
echo "  Empacotar:     cd electron && npm run dist:mac  (ou dist:linux, dist:win)"
