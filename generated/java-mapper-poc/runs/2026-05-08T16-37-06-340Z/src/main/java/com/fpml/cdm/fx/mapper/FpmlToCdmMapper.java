package com.fpml.cdm.fx.mapper;

import java.nio.file.Path;

public interface FpmlToCdmMapper {
    String mapFile(Path inputPath, Path reportsDir) throws Exception;
}
