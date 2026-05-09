# Focused Repair Packet

Attempt: 2
Earliest failed gate: generated-java-static-sanity
Category: static-java

## Failure Classification

- Earliest failed gate: generated-java-static-sanity
- Category: static-java
- Hidden downstream gates: java-reference-check, cdm-java-api-usage, maven-dependency-preflight, maven-compile, maven-test-compile, maven-test, maven-package, jar-runtime:fx-ex01-fx-spot, jar-runtime:fx-ex02-spot-cross-w-side-rates, jar-runtime:fx-ex03-fx-fwd, jar-runtime:fx-ex04-fx-fwd-w-settlement, jar-runtime:fx-ex05-fx-fwd-w-ssi, jar-runtime:fx-ex06-fx-fwd-w-splits, jar-runtime:fx-ex07-non-deliverable-forward, output-validation, rosetta-validation:fx-ex01-fx-spot, rosetta-validation:fx-ex02-spot-cross-w-side-rates, rosetta-validation:fx-ex03-fx-fwd, rosetta-validation:fx-ex04-fx-fwd-w-settlement, rosetta-validation:fx-ex05-fx-fwd-w-ssi, rosetta-validation:fx-ex06-fx-fwd-w-splits, rosetta-validation:fx-ex07-non-deliverable-forward


## Repair Instruction

- Patch only the earliest failed gate unless the excerpt proves the same root cause affects another file.
- Do not reread broad context unless a referenced class or method is missing from the compact approved API summary.
- Prefer the smallest changed file set.

## Failed Gate Output

```text
[
  {
    "file": "src\\main\\java\\com\\fpml\\cdm\\fx\\mapper\\generated\\GeneratedFpmlToCdmMapper.java",
    "line": 96,
    "code": "escaped_quotes_in_java",
    "message": "Java source contains escaped quote text instead of normal string literals."
  },
  {
    "file": "src\\main\\java\\com\\fpml\\cdm\\fx\\mapper\\generated\\ReportWriter.java",
    "line": 6,
    "code": "jackson_tree_cdm_construction",
    "message": "Generated mapper must not use Jackson tree nodes as the internal CDM model."
  },
  {
    "file": "src\\main\\java\\com\\fpml\\cdm\\fx\\mapper\\generated\\ReportWriter.java",
    "line": 1,
    "code": "missing_cdm_rosetta_import",
    "message": "Generated mapper must import preflight-approved CDM/Rosetta model classes."
  }
]
```

## Affected File Excerpts

### C:\Users\User\Desktop\fpml-cdm-fyp\generated\java-mapper-poc\runs\2026-05-08T18-24-06-498Z\src\main\java\com\fpml\cdm\fx\mapper\generated\GeneratedFpmlToCdmMapper.java:71-121

```java
  71:         List<String> traceability = new ArrayList<>();
  72: 
  73:         for (String fixtureName : args.getFixtureNames()) {
  74:             String fixturePath = args.getFixtureDir().resolve(fixtureName + ".xml").toString();
  75:             File fixtureFile = new File(fixturePath);
  76: 
  77:             if (!fixtureFile.exists()) {
  78:                 unsupported.add("Fixture not found: " + fixtureName);
  79:                 continue;
  80:             }
  81: 
  82:             try {
  83:                 Document doc = parseXml(fixtureFile);
  84:                 String productType = determineProductType(doc);
  85:                 TradeState tradeState = mapDocument(doc, productType, fixtureName);
  86: 
  87:                 String json = serializeToJson(tradeState);
  88:                 results.add(json);
  89: 
  90:                 traceability.add("Rosetta: MapTradeState | Fixture: " + fixtureName + " | Product: " + productType);
  91: 
  92:                 reportWriter.writeSidecarReport(fixtureName, productType, traceability, unsupported);
  93: 
  94:             } catch (Exception e) {
  95:                 unsupported.add("Mapping error for " + fixtureName + ": " + e.getMessage());
  96:                 results.add("{\"error\": \"" + fixtureName + " failed: " + e.getMessage() + "\"}");
  97:             }
  98:         }
  99: 
 100:         return results;
 101:     }
 102: 
 103:     /**
 104:      * Maps an FpML XML Document to a CDM TradeState based on product type.
 105:      * 
 106:      * Rosetta traceability: MapFxSingleLegNonTransferableProduct, MapFxSingleLegEconomicTerms, MapTradeState
 107:      */
 108:     public TradeState mapDocument(Document doc, String productType, String fixtureName) throws Exception {
 109:         switch (productType) {
 110:             case "fxSpot":
 111:             case "fxSpotCross":
 112:                 return fxSpotMapper.mapFxSingleLeg(doc, fixtureName);
 113:             case "fxFwd":
 114:             case "fxFwdSettlement":
 115:             case "fxFwdSsi":
 116:             case "fxFwdSplits":
 117:                 return fxFwdMapper.mapFxSingleLeg(doc, fixtureName);
 118:             case "ndf":
 119:                 return ndfMapper.mapFxSingleLeg(doc, fixtureName);
 120:             default:
 121:                 throw new IllegalArgumentException("Unknown product type: " + productType);
```

### C:\Users\User\Desktop\fpml-cdm-fyp\generated\java-mapper-poc\runs\2026-05-08T18-24-06-498Z\src\main\java\com\fpml\cdm\fx\mapper\generated\ReportWriter.java:1-31

```java
   1: package com.fpml.cdm.fx.mapper.generated;
   2: 
   3: import com.fasterxml.jackson.core.JsonProcessingException;
   4: import com.fasterxml.jackson.databind.ObjectMapper;
   5: import com.fasterxml.jackson.databind.SerializationFeature;
   6: import com.fasterxml.jackson.databind.node.ArrayNode;
   7: import com.fasterxml.jackson.databind.node.ObjectNode;
   8: 
   9: import java.io.File;
  10: import java.io.IOException;
  11: import java.time.Instant;
  12: import java.util.ArrayList;
  13: import java.util.LinkedHashMap;
  14: import java.util.List;
  15: import java.util.Map;
  16: 
  17: /**
  18:  * Jackson-based sidecar report writer for mapping, validation, traceability,
  19:  * and unsupported-scope details.
  20:  */
  21: public class ReportWriter {
  22: 
  23:     private final ObjectMapper objectMapper;
  24: 
  25:     public ReportWriter() {
  26:         this.objectMapper = new ObjectMapper();
  27:         this.objectMapper.enable(SerializationFeature.INDENT_OUTPUT);
  28:     }
  29: 
  30:     /**
  31:      * Write a sidecar mapping report for a fixture.
```

### C:\Users\User\Desktop\fpml-cdm-fyp\generated\java-mapper-poc\runs\2026-05-08T18-24-06-498Z\src\main\java\com\fpml\cdm\fx\mapper\generated\ReportWriter.java:1-26

```java
   1: package com.fpml.cdm.fx.mapper.generated;
   2: 
   3: import com.fasterxml.jackson.core.JsonProcessingException;
   4: import com.fasterxml.jackson.databind.ObjectMapper;
   5: import com.fasterxml.jackson.databind.SerializationFeature;
   6: import com.fasterxml.jackson.databind.node.ArrayNode;
   7: import com.fasterxml.jackson.databind.node.ObjectNode;
   8: 
   9: import java.io.File;
  10: import java.io.IOException;
  11: import java.time.Instant;
  12: import java.util.ArrayList;
  13: import java.util.LinkedHashMap;
  14: import java.util.List;
  15: import java.util.Map;
  16: 
  17: /**
  18:  * Jackson-based sidecar report writer for mapping, validation, traceability,
  19:  * and unsupported-scope details.
  20:  */
  21: public class ReportWriter {
  22: 
  23:     private final ObjectMapper objectMapper;
  24: 
  25:     public ReportWriter() {
  26:         this.objectMapper = new ObjectMapper();
```

### C:\Users\User\Desktop\fpml-cdm-fyp\generated\java-mapper-poc\runs\2026-05-08T18-24-06-498Z\src\main\java\com\fpml\cdm\fx\mapper\generated\GeneratedFpmlToCdmMapper.java:1-26

```java
   1: package com.fpml.cdm.fx.mapper.generated;
   2: 
   3: import com.fasterxml.jackson.databind.ObjectMapper;
   4: import com.fasterxml.jackson.databind.SerializationFeature;
   5: import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
   6: import com.fpml.cdm.fx.mapper.FpmlToCdmMapper;
   7: import com.fpml.cdm.fx.mapper.RuntimeArgs;
   8: import cdm.event.common.TradeState;
   9: import org.w3c.dom.Document;
  10: import org.w3c.dom.Element;
  11: import org.w3c.dom.NodeList;
  12: import org.xml.sax.InputSource;
  13: 
  14: import javax.xml.parsers.DocumentBuilder;
  15: import javax.xml.parsers.DocumentBuilderFactory;
  16: import javax.xml.xpath.XPath;
  17: import javax.xml.xpath.XPathConstants;
  18: import javax.xml.xpath.XPathFactory;
  19: import java.io.File;
  20: import java.io.FileReader;
  21: import java.io.IOException;
  22: import java.io.StringWriter;
  23: import java.nio.file.Files;
  24: import java.nio.file.Path;
  25: import java.nio.file.Paths;
  26: import java.util.ArrayList;
```
