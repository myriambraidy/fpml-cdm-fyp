package com.fpml.cdm.fx.mapper.generated;

import cdm.base.staticdata.party.Party;
import cdm.base.staticdata.party.PartyReference;
import cdm.base.staticdata.party.Counterparty;
import cdm.base.staticdata.party.CounterpartyRoleEnum;
import cdm.base.staticdata.party.AncillaryParty;
import cdm.base.staticdata.identifier.Identifier;
import java.util.List;
import java.util.ArrayList;


/**
 * Party mapping utilities following Rosetta patterns.
 * 
 * Rosetta trace:
 * - MapFxSingleLegCounterpartyList (ingest-fpml-confirmation-product-fxsingleleg-func.rosetta:17-27)
 * - MapFxSingleLegAncillaryPartyList (ingest-fpml-confirmation-product-fxsingleleg-func.rosetta:28-33)
 * - MapPayerReceiverModelToCounterpartyList (ingest-fpml-confirmation-party-func.rosetta:102-119)
 */
public class PartyMappers {


    /**
     * Maps FpML exchangedCurrency payerReceiverModel to CDM Counterparty list.
     * Rosetta: MapFxSingleLegCounterpartyList, MapPayerReceiverModelToCounterpartyList
     */
    public static List<Counterparty> mapCounterpartyList(FpmlFxSingleLeg fx) {
        var counterparties = new ArrayList<Counterparty>();

        if (fx.exchangedCurrency1 == null || fx.exchangedCurrency1.payerReceiverModel == null) {
            return counterparties;
        }

        var prm = fx.exchangedCurrency1.payerReceiverModel;

        // Map Party1 (payer)
        if (prm.payerModel != null && prm.payerModel.payerPartyReference != null) {
            counterparties.add(Counterparty.builder()
                .setRole(CounterpartyRoleEnum.PARTY_1)
                .setPartyReference(PartyReference.builder()
                    .setExternalReference(prm.payerModel.payerPartyReference.href)
                    .build())
                .build());
        }

        // Map Party2 (receiver)
        if (prm.receiverModel != null && prm.receiverModel.receiverPartyReference != null) {
            counterparties.add(Counterparty.builder()
                .setRole(CounterpartyRoleEnum.PARTY_2)
                .setPartyReference(PartyReference.builder()
                    .setExternalReference(prm.receiverModel.receiverPartyReference.href)
                    .build())
                .build());
        }

        return counterparties;
    }

    /**
     * Maps FpML party list to CDM Party list.
     */
    public static List<Party> mapPartyList(FpmlDocument doc) {
        var parties = new ArrayList<Party>();
        if (doc.parties != null) {
            for (var fp : doc.parties) {
                var partyBuilder = Party.builder();
                if (fp.partyId != null) {
                    partyBuilder.setPartyId(List.of(fp.partyId));
                }
                parties.add(partyBuilder.build());
            }
        }
        return parties;
    }

    /**
     * Maps ancillary party references.
     * Rosetta: MapFxSingleLegAncillaryPartyList
     */
    public static List<AncillaryParty> mapAncillaryPartyList(FpmlFxSingleLeg fx) {
        var list = new ArrayList<AncillaryParty>();
        if (fx.ancillaryParties != null) {
            for (var ap : fx.ancillaryParties) {
                list.add(AncillaryParty.builder()
                    .setPartyReference(PartyReference.builder()
                        .setExternalReference(ap)
                        .build())
                    .build());
            }
        }
        return list;
    }
}
