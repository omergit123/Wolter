cmake_minimum_required(VERSION 3.10)
project(ProductRecommendation)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_EXE_LINKER_FLAGS "-static-libgcc -static-libstdc++ -static")

file(GLOB LIB_SRC "src/*.cpp")

add_library(product_lib ${LIB_SRC})
target_include_directories(product_lib PUBLIC ${CMAKE_CURRENT_SOURCE_DIR})

add_executable(product_app serverMain.cpp)
target_link_libraries(product_app PRIVATE product_lib)