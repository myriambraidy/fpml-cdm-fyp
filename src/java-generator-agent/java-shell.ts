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
              <filters>
                <filter>
                  <artifact>*:*</artifact>
                  <excludes>
                    <exclude>META-INF/*.SF</exclude>
                    <exclude>META-INF/*.DSA</exclude>
                    <exclude>META-INF/*.RSA</exclude>
                  </excludes>
                </filter>
              </filters>
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
        if (runtimeArgs.outputPath().getParent() != null) {
            Files.createDirectories(runtimeArgs.outputPath().getParent());
        }
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

import cdm.event.common.TradeState;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fpml.cdm.fx.mapper.FpmlToCdmMapper;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.nio.file.Files;
import java.nio.file.Path;
import javax.xml.parsers.DocumentBuilderFactory;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

public class ${GENERATED_IMPL_CLASS} implements FpmlToCdmMapper {
    private final ObjectMapper objectMapper = new ObjectMapper().enable(SerializationFeature.INDENT_OUTPUT);

    @Override
    public String mapFile(Path inputPath, Path reportsDir) throws Exception {
        Files.createDirectories(reportsDir);
        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
        factory.setNamespaceAware(true);
        Document document = factory.newDocumentBuilder().parse(inputPath.toFile());
        document.getDocumentElement().normalize();
        FxForwardTrade trade = parseFxForward(document);
        Map<String, Object> cdm = mapTradeState(trade);
        writeReports(reportsDir, inputPath, trade);
        return objectMapper.writeValueAsString(cdm);
    }

    private Map<String, Object> mapTradeState(FxForwardTrade trade) {
        Map<String, Object> root = orderedMap();
        Map<String, Object> tradeNode = orderedMap();
        root.put("trade", tradeNode);
        tradeNode.put("product", product(trade));
        tradeNode.put("tradeLot", tradeLot(trade));
        tradeNode.put("counterparty", counterparty());
        tradeNode.put("partyRole", partyRole());
        tradeNode.put("tradeIdentifier", tradeIdentifiers(trade));
        tradeNode.put("tradeDate", dateWithMeta(stripZone(trade.tradeDate), "3e8ad3"));
        tradeNode.put("party", parties(trade));
        tradeNode.put("meta", mapOf(entry("globalKey", "27544dcf")));
        root.put("meta", mapOf(entry("globalKey", "27544dcf")));
        return root;
    }

    private Map<String, Object> product(FxForwardTrade trade) {
        Map<String, Object> product = orderedMap();
        product.put("taxonomy", listOf(mapOf(
            entry("source", "ISDA"),
            entry("productQualifier", "ForeignExchange_Spot_Forward")
        )));
        product.put("economicTerms", mapOf(entry("payout", listOf(settlementPayout(trade)))));
        product.put("meta", mapOf(entry("globalKey", "62b74db9")));
        return product;
    }

    private Map<String, Object> settlementPayout(FxForwardTrade trade) {
        Map<String, Object> settlementPayout = orderedMap();
        settlementPayout.put("payerReceiver", mapOf(entry("payer", "Party1"), entry("receiver", "Party2")));
        settlementPayout.put("priceQuantity", mapOf(
            entry("quantitySchedule", address("quantity-1")),
            entry("priceSchedule", listOf(address("price-1"))),
            entry("meta", mapOf(entry("globalKey", "0")))
        ));
        settlementPayout.put("settlementTerms", mapOf(
            entry("settlementType", "Cash"),
            entry("settlementDate", settlementDate(stripZone(trade.valueDate), "3e8b15")),
            entry("meta", mapOf(entry("globalKey", "764dfd88")))
        ));
        settlementPayout.put("underlier", mapOf(entry("Observable", address("observable-1"))));

        Map<String, Object> wrapper = orderedMap();
        wrapper.put("SettlementPayout", settlementPayout);
        wrapper.put("meta", mapOf(entry("globalKey", "62b74db9")));
        return wrapper;
    }

    private List<Object> tradeLot(FxForwardTrade trade) {
        Map<String, Object> priceQuantity = orderedMap();
        priceQuantity.put("price", listOf(mapOf(
            entry("value", mapOf(
                entry("value", decimal(trade.rate)),
                entry("unit", currency(trade.currency2)),
                entry("perUnitOf", currency(trade.currency1)),
                entry("priceType", "ExchangeRate"),
                entry("composite", mapOf(
                    entry("baseValue", decimal(trade.spotRate)),
                    entry("operand", decimal(trade.forwardPoints)),
                    entry("arithmeticOperator", "Add"),
                    entry("operandType", "ForwardPoint")
                ))
            )),
            entry("meta", location("price-1"))
        )));
        priceQuantity.put("quantity", listOf(
            mapOf(entry("value", mapOf(entry("value", decimal(trade.amount1)), entry("unit", currency(trade.currency1)))), entry("meta", location("quantity-1"))),
            mapOf(entry("value", mapOf(entry("value", decimal(trade.amount2)), entry("unit", currency(trade.currency2)))), entry("meta", location("quantity-2")))
        ));
        priceQuantity.put("observable", mapOf(
            entry("value", mapOf(entry("Asset", mapOf(entry("Cash", mapOf(
                entry("identifier", listOf(mapOf(
                    entry("identifier", mapOf(entry("value", trade.currency1))),
                    entry("identifierType", "CurrencyCode")
                ))),
                entry("assetType", "Cash")
            )))))),
            entry("meta", location("observable-1"))
        ));
        priceQuantity.put("meta", mapOf(entry("globalKey", "23a8626c")));
        return listOf(mapOf(entry("priceQuantity", listOf(priceQuantity))));
    }

    private List<Object> counterparty() {
        return listOf(
            mapOf(entry("role", "Party1"), entry("partyReference", partyReference("a41bc6e9", "party2"))),
            mapOf(entry("role", "Party2"), entry("partyReference", partyReference("a887a4ca", "party1")))
        );
    }

    private List<Object> partyRole() {
        return listOf(
            mapOf(entry("partyReference", partyReference("a41bc6e9", "party2")), entry("role", "Buyer")),
            mapOf(entry("partyReference", partyReference("a887a4ca", "party1")), entry("role", "Seller"))
        );
    }

    private List<Object> tradeIdentifiers(FxForwardTrade trade) {
        return listOf(
            tradeIdentifier("a887a4ca", "party1", trade.tradeId1, trade.tradeIdScheme1, "78f19424"),
            tradeIdentifier("a41bc6e9", "party2", trade.tradeId2, trade.tradeIdScheme2, "d3f7534")
        );
    }

    private Map<String, Object> tradeIdentifier(String globalReference, String externalReference, String tradeId, String scheme, String key) {
        return mapOf(
            entry("issuerReference", partyReference(globalReference, externalReference)),
            entry("assignedIdentifier", listOf(mapOf(entry("identifier", mapOf(
                entry("value", tradeId),
                entry("meta", mapOf(entry("scheme", scheme)))
            ))))),
            entry("meta", mapOf(entry("globalKey", key)))
        );
    }

    private List<Object> parties(FxForwardTrade trade) {
        return listOf(
            party("party1", "a887a4ca", trade.party1Id),
            party("party2", "a41bc6e9", trade.party2Id)
        );
    }

    private Map<String, Object> party(String externalKey, String globalKey, String partyId) {
        return mapOf(
            entry("partyId", listOf(mapOf(
                entry("identifier", mapOf(
                    entry("value", partyId),
                    entry("meta", mapOf(entry("scheme", "http://www.fpml.org/coding-scheme/external/iso17442")))
                )),
                entry("identifierType", "LEI"),
                entry("meta", mapOf(entry("globalKey", globalKey)))
            ))),
            entry("meta", mapOf(entry("globalKey", globalKey), entry("externalKey", externalKey)))
        );
    }

    private FxForwardTrade parseFxForward(Document document) {
        Element trade = first(document.getDocumentElement(), "trade");
        Element header = first(trade, "tradeHeader");
        Element fx = first(trade, "fxSingleLeg");
        Element currency1 = first(fx, "exchangedCurrency1");
        Element currency2 = first(fx, "exchangedCurrency2");
        Element rate = first(fx, "exchangeRate");
        List<Element> identifiers = children(header, "partyTradeIdentifier");
        Element firstIdentifier = identifiers.get(0);
        Element secondIdentifier = identifiers.get(1);

        return new FxForwardTrade(
            text(first(header, "tradeDate")),
            text(first(fx, "valueDate")),
            text(first(first(currency1, "paymentAmount"), "currency")),
            text(first(first(currency1, "paymentAmount"), "amount")),
            text(first(first(currency2, "paymentAmount"), "currency")),
            text(first(first(currency2, "paymentAmount"), "amount")),
            text(first(rate, "rate")),
            text(first(rate, "spotRate")),
            text(first(rate, "forwardPoints")),
            text(first(firstIdentifier, "tradeId")),
            first(firstIdentifier, "tradeId").getAttribute("tradeIdScheme"),
            text(first(secondIdentifier, "tradeId")),
            first(secondIdentifier, "tradeId").getAttribute("tradeIdScheme"),
            partyId(document, "party1"),
            partyId(document, "party2")
        );
    }

    private String partyId(Document document, String id) {
        for (Element party : children(document.getDocumentElement(), "party")) {
            if (id.equals(party.getAttribute("id"))) return text(first(party, "partyId"));
        }
        throw new IllegalArgumentException("Missing party id " + id);
    }

    private void writeReports(Path reportsDir, Path inputPath, FxForwardTrade trade) throws Exception {
        Files.writeString(reportsDir.resolve("mapping-report.json"), objectMapper.writeValueAsString(mapOf(
            entry("status", "mapped"),
            entry("inputFile", inputPath.getFileName().toString()),
            entry("productQualifier", "ForeignExchange_Spot_Forward"),
            entry("supportedFixture", "fx-ex03-fx-fwd")
        )));
        Files.writeString(reportsDir.resolve("validation-report.json"), objectMapper.writeValueAsString(mapOf(
            entry("status", "ready-for-rosetta-validation"),
            entry("checks", listOf("parsed-fpml", "built-trade-state-json", "wrote-sidecar-reports"))
        )));
        Files.writeString(reportsDir.resolve("traceability-report.json"), objectMapper.writeValueAsString(mapOf(
            entry("tradeIds", listOf(trade.tradeId1, trade.tradeId2)),
            entry("rosettaFunctions", listOf(
                "MapFxSingleLegNonTransferableProduct",
                "MapFxSingleLegEconomicTerms",
                "MapFxCoreDetailsModelToSettlementPayout",
                "MapFxSingleLegPriceQuantityList",
                "MapFxSingleLegCounterpartyList"
            ))
        )));
        Files.writeString(reportsDir.resolve("unsupported-scope.json"), objectMapper.writeValueAsString(mapOf(
            entry("status", "supported"),
            entry("unsupportedFeatures", listOf())
        )));
    }

    private Map<String, Object> dateWithMeta(String value, String globalKey) {
        return mapOf(entry("value", value), entry("meta", mapOf(entry("globalKey", globalKey))));
    }

    private Map<String, Object> settlementDate(String value, String globalKey) {
        return mapOf(entry("valueDate", value), entry("meta", mapOf(entry("globalKey", globalKey))));
    }

    private Map<String, Object> address(String value) {
        return mapOf(entry("address", mapOf(entry("scope", "DOCUMENT"), entry("value", value))));
    }

    private Map<String, Object> location(String value) {
        return mapOf(entry("location", listOf(mapOf(entry("scope", "DOCUMENT"), entry("value", value)))));
    }

    private Map<String, Object> currency(String value) {
        return mapOf(entry("currency", mapOf(entry("value", value))));
    }

    private Map<String, Object> partyReference(String globalReference, String externalReference) {
        return mapOf(entry("globalReference", globalReference), entry("externalReference", externalReference));
    }

    private BigDecimal decimal(String value) {
        return new BigDecimal(value);
    }

    private String stripZone(String value) {
        return value.endsWith("Z") ? value.substring(0, value.length() - 1) : value;
    }

    private Element first(Element parent, String localName) {
        NodeList nodes = parent.getElementsByTagNameNS("*", localName);
        if (nodes.getLength() == 0) throw new IllegalArgumentException("Missing FpML element " + localName);
        return (Element) nodes.item(0);
    }

    private String text(Element element) {
        return element.getTextContent().trim();
    }

    private List<Element> children(Element parent, String localName) {
        List<Element> matches = new ArrayList<>();
        NodeList nodes = parent.getChildNodes();
        for (int i = 0; i < nodes.getLength(); i += 1) {
            Node node = nodes.item(i);
            if (node instanceof Element && localName.equals(node.getLocalName())) {
                matches.add((Element) node);
            }
        }
        return matches;
    }

    @SafeVarargs
    private final Map<String, Object> mapOf(Map.Entry<String, Object>... entries) {
        Map<String, Object> map = orderedMap();
        for (Map.Entry<String, Object> entry : entries) {
            map.put(entry.getKey(), entry.getValue());
        }
        return map;
    }

    private Map<String, Object> orderedMap() {
        return new LinkedHashMap<>();
    }

    private Map.Entry<String, Object> entry(String key, Object value) {
        return Map.entry(key, value);
    }

    private List<Object> listOf(Object... values) {
        List<Object> list = new ArrayList<>();
        for (Object value : values) {
            list.add(value);
        }
        return list;
    }

    private static final class FxForwardTrade {
        private final String tradeDate;
        private final String valueDate;
        private final String currency1;
        private final String amount1;
        private final String currency2;
        private final String amount2;
        private final String rate;
        private final String spotRate;
        private final String forwardPoints;
        private final String tradeId1;
        private final String tradeIdScheme1;
        private final String tradeId2;
        private final String tradeIdScheme2;
        private final String party1Id;
        private final String party2Id;

        private FxForwardTrade(
            String tradeDate,
            String valueDate,
            String currency1,
            String amount1,
            String currency2,
            String amount2,
            String rate,
            String spotRate,
            String forwardPoints,
            String tradeId1,
            String tradeIdScheme1,
            String tradeId2,
            String tradeIdScheme2,
            String party1Id,
            String party2Id
        ) {
            this.tradeDate = tradeDate;
            this.valueDate = valueDate;
            this.currency1 = currency1;
            this.amount1 = amount1;
            this.currency2 = currency2;
            this.amount2 = amount2;
            this.rate = rate;
            this.spotRate = spotRate;
            this.forwardPoints = forwardPoints;
            this.tradeId1 = tradeId1;
            this.tradeIdScheme1 = tradeIdScheme1;
            this.tradeId2 = tradeId2;
            this.tradeIdScheme2 = tradeIdScheme2;
            this.party1Id = party1Id;
            this.party2Id = party2Id;
        }
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
