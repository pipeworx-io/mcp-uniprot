# mcp-uniprot

UniProt MCP — protein sequence + function database.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 965+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `search` | "Find protein [name]" / "look up [gene] in UniProt" / "BRCA1 / TP53 / insulin protein info" / "all proteins for [organism]" — UniProtKB search via Lucene-style queries (e.g. "gene:BRCA1 AND organism_id:9606" for human BRCA1). UniProt is the authoritative protein-sequence-and-function database — use for protein characterization, function annotation, sequence retrieval, and cross-references to PDB/GO/PubMed. |
| `get` | "Fetch protein [P12345]" / "UniProt entry for [accession]" / "FASTA sequence for [protein]" — single UniProtKB entry by accession (e.g. P12345 or P38398 for BRCA1_HUMAN). Returns full protein record: sequence, function annotations, GO terms, cross-refs, post-translational modifications, variants. Pass format=fasta for sequence only. |
| `proteomes_search` | "Reference proteome for [organism]" / "complete protein set of [species]" — search UniProt reference proteomes (the curated representative protein set per organism). Use as a starting point for genome-scale protein analyses. |
| `taxonomy_search` | "NCBI taxonomy ID for [organism]" / "taxid for [species]" / "look up [Latin name] in NCBI taxonomy" — search NCBI Taxonomy via UniProt\'s mirror. Returns taxonomic IDs you can use as organism_id filters in `search` (9606 = human, 10090 = mouse, 7227 = D. melanogaster, etc). |
| `keyword` | "UniProt keyword KW-N info" / "what does keyword [X] mean" — fetch a UniProt controlled-vocabulary keyword by ID. Use to look up annotation tags like "Kinase" / "Membrane" / "Disease-associated". |
| `feature_summary` | "Domain map of [protein]" / "annotated features of [accession]" / "what regions / sites does [protein] have" — annotated features (domains, active sites, transmembrane regions, mutagenesis sites, glycosylation, disulfide bonds, etc.) for a UniProt accession. Use for structural/functional analysis without pulling the full protein record. |

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "uniprot": {
      "url": "https://gateway.pipeworx.io/uniprot/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 965+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Uniprot data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [All tools and guides](https://github.com/pipeworx-io/examples)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
