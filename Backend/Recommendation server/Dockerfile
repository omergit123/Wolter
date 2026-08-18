# Stage 1: Builder using the native Debian OS
FROM debian:bookworm-slim AS builder

# Install native compiler and build tools
RUN apt-get update && apt-get install -y cmake g++ make && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copying relevant files
COPY CMakeLists.txt .
COPY serverMain.cpp .
COPY src/ ./src/

# Build the project
RUN mkdir build && cd build && \
    cmake -DCMAKE_BUILD_TYPE=Release -DBUILD_TESTS=OFF .. && \
    make -j$(nproc)

# Stage 2: Minimal runtime using the exact same OS
FROM debian:bookworm-slim
WORKDIR /app

# Creating data folder if it doesn't exist
RUN mkdir -p data && chmod -R 777 data 

# Copy the compiled binary from the builder stage
COPY --from=builder /app/build/product_app .

EXPOSE 8080

CMD ["./product_app", "0.0.0.0", "8080"]