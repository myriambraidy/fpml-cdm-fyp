import { copyFile, mkdir, stat, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import {
  GENERATED_ARTIFACT_ID,
  GENERATED_BASE_PACKAGE,
  GENERATED_IMPL_CLASS,
  GENERATED_IMPL_PACKAGE,
  GENERATED_IMPL_SOURCE_ROOT,
  GENERATED_JAR_NAME,
  GENERATED_JAVA_VERSION,
} from './java-contract'
import type { GeneratorRunConfig } from './types'

export async function createJavaProjectShell(config: GeneratorRunConfig): Promise<void> {
  await mkdir(join(config.runOutputDir, 'fixtures'), { recursive: true })
  await mkdir(join(config.runOutputDir, 'src/main/java/com/fpml/cdm/fx/mapper'), { recursive: true })
  await mkdir(join(config.runOutputDir, GENERATED_IMPL_SOURCE_ROOT), { recursive: true })
  await mkdir(join(config.runOutputDir, 'src/test/java/com/fpml/cdm/fx/mapper'), { recursive: true })
  await mkdir(join(config.runOutputDir, 'build-reports'), { recursive: true })

  await copyFixtures(config)
  await writeIfMissing(join(config.runOutputDir, 'pom.xml'), renderPom(config))
  await writeIfMissing(
    join(config.runOutputDir, 'src/main/java/com/fpml/cdm/fx/mapper/FpmlToCdmMapper.java'),
    renderMapperInterface()
  )
  await writeIfMissing(
    join(config.runOutputDir, 'src/main/java/com/fpml/cdm/fx/mapper/Main.java'),
    renderMain()
  )
  await writeIfMissing(
    join(config.runOutputDir, 'src/main/java/com/fpml/cdm/fx/mapper/RuntimeArgs.java'),
    renderRuntimeArgs()
  )
  await writeIfMissing(
    join(config.runOutputDir, GENERATED_IMPL_SOURCE_ROOT, `${GENERATED_IMPL_CLASS}.java`),
    renderGeneratedMapperSkeleton()
  )
}

function renderPom(config: GeneratorRunConfig): string {
  const cdmDependency =
    config.cdmRosettaPreflight?.status === 'passed'
      ? `    <dependency>
      <groupId>${config.cdmRosettaPreflight.cdmArtifact.groupId}</groupId>
      <artifactId>${config.cdmRosettaPreflight.cdmArtifact.artifactId}</artifactId>
      <version>${config.cdmRosettaPreflight.cdmArtifact.version}</version>
    </dependency>
`
      : ''
  return `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>
  <groupId>com.fpml.cdm</groupId>
  <artifactId>${GENERATED_ARTIFACT_ID}</artifactId>
  <version>0.1.0</version>
  <packaging>jar</packaging>

  <properties>
    <maven.compiler.source>${GENERATED_JAVA_VERSION}</maven.compiler.source>
    <maven.compiler.target>${GENERATED_JAVA_VERSION}</maven.compiler.target>
    <maven.compiler.release>${GENERATED_JAVA_VERSION}</maven.compiler.release>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <jackson.version>2.15.3</jackson.version>
    <junit.version>5.10.1</junit.version>
  </properties>

  <dependencies>
${cdmDependency}    <dependency>
      <groupId>com.fasterxml.jackson.core</groupId>
      <artifactId>jackson-databind</artifactId>
      <version>\${jackson.version}</version>
    </dependency>
    <dependency>
      <groupId>org.junit.jupiter</groupId>
      <artifactId>junit-jupiter</artifactId>
      <version>\${junit.version}</version>
      <scope>test</scope>
    </dependency>
  </dependencies>

  <build>
    <plugins>
      <plugin>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-compiler-plugin</artifactId>
        <version>3.11.0</version>
      </plugin>
      <plugin>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-surefire-plugin</artifactId>
        <version>3.2.2</version>
      </plugin>
      <plugin>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-shade-plugin</artifactId>
        <version>3.5.1</version>
        <executions>
          <execution>
            <phase>package</phase>
            <goals>
              <goal>shade</goal>
            </goals>
            <configuration>
              <finalName>${GENERATED_JAR_NAME}</finalName>
              <transformers>
                <transformer implementation="org.apache.maven.plugins.shade.resource.ManifestResourceTransformer">
                  <mainClass>com.fpml.cdm.fx.mapper.Main</mainClass>
                </transformer>
              </transformers>
            </configuration>
          </execution>
        </executions>
      </plugin>
    </plugins>
  </build>
</project>
`
}

function renderMain(): string {
  return `package ${GENERATED_BASE_PACKAGE};

import ${GENERATED_IMPL_PACKAGE}.${GENERATED_IMPL_CLASS};
import java.nio.file.Files;

public final class Main {
    private Main() {
    }

    public static void main(String[] args) throws Exception {
        RuntimeArgs runtimeArgs = RuntimeArgs.parse(args);
        FpmlToCdmMapper mapper = new ${GENERATED_IMPL_CLASS}();
        String cdmJson = mapper.mapFile(runtimeArgs.inputPath(), runtimeArgs.reportsDir());
        Files.writeString(runtimeArgs.outputPath(), cdmJson);
    }
}
`
}

function renderMapperInterface(): string {
  return `package ${GENERATED_BASE_PACKAGE};

import java.nio.file.Path;

public interface FpmlToCdmMapper {
    String mapFile(Path inputPath, Path reportsDir) throws Exception;
}
`
}

function renderRuntimeArgs(): string {
  return `package ${GENERATED_BASE_PACKAGE};

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
                "Usage: java -jar target/${GENERATED_JAR_NAME}.jar <input.xml> --output <output.json> --reports <reportsDir>"
            );
        }
        return new RuntimeArgs(Path.of(args[0]), Path.of(args[2]), Path.of(args[4]));
    }
}
`
}

function renderGeneratedMapperSkeleton(): string {
  return `package ${GENERATED_IMPL_PACKAGE};

import cdm.event.common.Trade;
import cdm.event.common.TradeState;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fpml.cdm.fx.mapper.FpmlToCdmMapper;
import java.nio.file.Files;
import java.nio.file.Path;
import javax.xml.parsers.DocumentBuilderFactory;
import org.w3c.dom.Document;

public class ${GENERATED_IMPL_CLASS} implements FpmlToCdmMapper {
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public String mapFile(Path inputPath, Path reportsDir) throws Exception {
        Files.createDirectories(reportsDir);
        Document document = DocumentBuilderFactory.newInstance()
            .newDocumentBuilder()
            .parse(inputPath.toFile());
        TradeState tradeState = mapTradeState(document, reportsDir);
        return objectMapper.writeValueAsString(tradeState);
    }

    private TradeState mapTradeState(Document document, Path reportsDir) throws Exception {
        writeUnsupportedReport(reportsDir, "Generated skeleton has not implemented full FX mapping yet.");
        Trade trade = Trade.builder().build();
        return TradeState.builder().setTrade(trade).build();
    }

    private void writeUnsupportedReport(Path reportsDir, String message) throws Exception {
        Files.writeString(reportsDir.resolve("unsupported-fields-report.txt"), message);
    }
}
`
}

async function copyFixtures(config: GeneratorRunConfig): Promise<void> {
  for (const fixture of config.runtimeFixtures) {
    const target = join(config.runOutputDir, 'fixtures', fixture.fixtureFileName)
    if (await exists(target)) continue
    await mkdir(dirname(target), { recursive: true })
    await copyFile(fixture.fpmlPath, target)
  }
}

async function writeIfMissing(path: string, content: string): Promise<void> {
  if (await exists(path)) return
  await mkdir(dirname(path), { recursive: true })
  await writeFile(path, content, 'utf8')
}

async function exists(path: string): Promise<boolean> {
  try {
    await stat(path)
    return true
  } catch {
    return false
  }
}
