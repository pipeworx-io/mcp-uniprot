# mcp-uniprot

UniProt protein sequence + function knowledge-base (EBI)

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 250+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `search` | UniProtKB search (Lucene-style: "gene:BRCA1 AND organism_id:9606"). |
| `get` | Single UniProtKB entry by accession. |
| `proteomes_search` | Search reference proteomes. |
| `taxonomy_search` | Search NCBI taxonomy via UniProt. |
| `keyword` | UniProt keyword info (KW-####). |
| `feature_summary` | Feature annotation summary (DOMAIN, MUTAGEN, etc.) for an accession. |

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

Or connect to the full Pipeworx gateway for access to all 250+ data sources:

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
