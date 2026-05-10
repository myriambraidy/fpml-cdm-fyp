package com.fpml.cdm.fx.mapper;

import java.nio.file.Path;

public final class RuntimeArgs {
    private final Path inputPath;
    private final Path outputPath;
    private final Path reportsDir;

    public RuntimeArgs(Path inputPath, Path outputPath, Path reportsDir) {
        this.inputPath = inputPath;
        this.outputPath = outputPath;
        this.reportsDir = reportsDir;
    }

    public Path inputPath() {
        return inputPath;
    }

    public Path outputPath() {
        return outputPath;
    }

    public Path reportsDir() {
        return reportsDir;
    }

    public static RuntimeArgs parse(String[] args) {
        if (args.length != 5 || !"--output".equals(args[1]) || !"--reports".equals(args[3])) {
            throw new IllegalArgumentException(
                "Usage: java -jar target/fpml-cdm-rosetta-mapper.jar <input.xml> --output <output.json> --reports <reportsDir>"
            );
        }
        return new RuntimeArgs(Path.of(args[0]), Path.of(args[2]), Path.of(args[4]));
    }
}
