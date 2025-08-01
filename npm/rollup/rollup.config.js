import rollup_typescript from "@rollup/plugin-typescript"
import path from "path"
import { defineConfig } from "rollup"
import * as ts_transform_paths from "typescript-transform-paths"

export default defineConfig({
    input: {
        index: path.resolve("./src/index.ts")
    },

    external: [
        /^react(\/.*)?$/,
        "react-dom",
        "@qyu/signal-core",
        "@qyu/signal-react",
        "@qyu/anim-core",
        "@qyu/anim-react",
    ],

    plugins: [
        rollup_typescript({
            declaration: true,
            include: ["./src/**/*"],
            declarationDir: "./build/declaration",

            transformers: {
                before: [
                    {
                        type: "program",

                        factory: program => {
                            return ts_transform_paths.nxTransformerPlugin.before({}, program)
                        }
                    }
                ],

                afterDeclarations: [
                    {
                        type: "program",

                        factory: program => {
                            return ts_transform_paths.nxTransformerPlugin.afterDeclarations({ afterDeclarations: true }, program)
                        }

                    }
                ]
            }
        })
    ],

    output: {
        format: "esm",
        dir: path.resolve("./build"),
        entryFileNames: "bundle/entry/[name].js",
        chunkFileNames: "bundle/chunk/[hash].js"
    }
})
