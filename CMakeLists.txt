cmake_minimum_required(VERSION 3.10)
project(artoolkit5-constants-generator)

# Controllo che si stia usando Emscripten
if(NOT EMSCRIPTEN)
    message(FATAL_ERROR "Questo progetto deve essere compilato usando emcc (Emscripten). Usa 'emcmake cmake ..'")
endif()

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# 1. Percorsi delle dipendenze (Submodule)
set(WEBARKIT_LIB_DIR "${CMAKE_SOURCE_DIR}/third_party/WebARKitLib")
set(WEBARKIT_INCLUDE_DIR "${WEBARKIT_LIB_DIR}/include") # Verifica se il path è include/ o altro

# 2. Target dell'estrattore (WASM temporaneo)
set(EXTRACTOR_TARGET "constants_extractor")
set(EXTRACTOR_OUTPUT "${CMAKE_BINARY_DIR}/${EXTRACTOR_TARGET}.js")

add_executable(${EXTRACTOR_TARGET} src/constants_extractor.cpp)

# 3. Includi gli header di ARToolKit5
target_include_directories(${EXTRACTOR_TARGET} PRIVATE
        ${WEBARKIT_INCLUDE_DIR}
        # Aggiungi qui eventuali altri path necessari di WebARKitLib
)

# 4. Flag di Link per Embind e Modularizzazione
target_link_options(${EXTRACTOR_TARGET} PRIVATE
        "--bind"
        "--no-entry"
        "-sMODULARIZE=1"
        "-sEXPORT_ES6=1"
        "-sENVIRONMENT=node"
        "-sALLOW_MEMORY_GROWTH=1"
        "-sFILESYSTEM=0"
        "-sMALLOC=emmalloc"
        "-sASSERTIONS=0"
        "-sSTACK_SIZE=64KB"
        "-sINCOMING_MODULE_JS_API=[]"
        "-sSTRICT=1"                   # Modalità rigorosa (rimuove legacy bloat)
        "-sEXPORTED_RUNTIME_METHODS=[]"
)

# 5. Automazione della generazione TypeScript
set(OUTPUT_TS "${CMAKE_SOURCE_DIR}/src/generated/artoolkit_constants.ts")
set(GEN_SCRIPT "${CMAKE_SOURCE_DIR}/tools/gen_constants.js")

add_custom_command(
        OUTPUT ${OUTPUT_TS}
        COMMAND node ${GEN_SCRIPT} ${EXTRACTOR_OUTPUT} ${OUTPUT_TS}
        DEPENDS ${EXTRACTOR_TARGET} ${GEN_SCRIPT}
        COMMENT "Generating TypeScript constants from WASM extractor..."
)

# Target finale per l'utente
add_custom_target(generate_ts ALL DEPENDS ${OUTPUT_TS})