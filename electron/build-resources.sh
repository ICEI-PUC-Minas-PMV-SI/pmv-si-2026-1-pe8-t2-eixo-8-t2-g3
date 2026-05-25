#!/bin/bash
set -e

JRE_DIR="resources/jre"
JAVA_HOME="${JAVA_HOME:-$(dirname $(dirname $(readlink -f $(which java))))}"

if [ ! -d "$JAVA_HOME" ]; then
  echo "JAVA_HOME not found. Set JAVA_HOME to your JDK 21 installation."
  exit 1
fi

echo "Generating custom JRE from: $JAVA_HOME"
echo "JRE output: $JRE_DIR"

rm -rf "$JRE_DIR"

# Módulos mínimos para uma aplicação Quarkus com Hibernate + SQLite
"$JAVA_HOME/bin/jlink" \
  --add-modules java.base,java.sql,java.naming,java.management,jdk.unsupported,java.compiler,java.desktop,java.logging,java.xml,jdk.management \
  --output "$JRE_DIR" \
  --strip-debug \
  --compress zip-9 \
  --no-header-files \
  --no-man-pages

echo "JRE gerado em: $JRE_DIR"
du -sh "$JRE_DIR"
